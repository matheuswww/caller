import { actions } from "@/components/home/home"
import { WS_URL } from "@/lib/api/api"
import { getFriendsResponse } from "@/lib/api/friend/getFriends"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import Timer from "./timer"
import getUser, { getUserResponse } from "@/lib/api/user/getUser"

interface props {
  friends: getFriendsResponse | null
  setActions: Dispatch<SetStateAction<actions>>
  setError: Dispatch<SetStateAction<boolean>>
  setFriends: Dispatch<SetStateAction<getFriendsResponse | null>>
  actions: actions
  cookie: string | undefined
}

interface friend {
  user_id: string
  name: string
  user: string
}

export default function Call({ setActions, setFriends, setError, actions, cookie, friends }: props) {
  const actionsRef = useRef<actions>({
    actions: null,
    friend_id: null
  })

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([])
  const [callStarted, setCallStarted] = useState(false)
  const [acceptedCall, setAcceptedCall] = useState(false)
  const [receivingCall, setReceivingCall] = useState(false)
  const [sendingCall, setSendingCall] = useState(false)
  const [offerData, setOfferData] = useState<any>(null)
  const [friend, setFriend] = useState<friend | null>(null)
  const [user, setUser] = useState<getUserResponse | null>(null)

  useEffect(() => {
    try {
      (async function() {
        const user = await getUser()
        setUser(user)
      }())
    } catch (error) {
      console.log(error)
      setError(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    wsRef.current = new WebSocket(`${WS_URL}?user=${encodeURIComponent(cookie || "")}`)
    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case "data":
          const friends: getFriendsResponse = data.friends
          if ("friends" in friends) {
            setFriends(friends)
          }
          break
        case "offer":
          const friend: friend = data.user
          if ("user_id" in friend) {
            setFriend(friend)
          }
          setOfferData(data)
          setReceivingCall(true)
          break
        case "answer":
          await handleAnswer(data)
          break
        case "ice":
          if (pcRef.current) {
            await pcRef.current.addIceCandidate(data.candidate)
          } else {
            pendingCandidates.current.push(data.candidate)
          }
          break
        case "desconect":
          endCall()
          break
      }
    }

    return () => {
      wsRef.current?.close()
      pcRef.current?.close()
    }
  }, [user])

  useEffect(() => {
    if (!actions.actions || !actions.friend_id) return
    switch (actions.actions) {
      case "request":
        if (friends) {
          for (let friend of friends?.friends) {
            if (friend.user_id === actions.friend_id) {
              setFriend({
                user_id: friend.user_id,
                name: friend.name,
                user: friend.user
              })
            }
          }
        }
        actionsRef.current.actions = actions.actions
        actionsRef.current.friend_id = actions.friend_id
        setSendingCall(true)
        startCall()
        break;
      case "accept":
        actionsRef.current.actions = actions.actions
        actionsRef.current.friend_id = actions.friend_id
        handleOffer(offerData)
        break;
      case "desconect":
        actionsRef.current.actions = actions.actions
        actionsRef.current.friend_id = actions.friend_id
        handleEndCall()
      default:
        break;
    }

  }, [actions])

  useEffect(() => {
    if (friends) {
      friends.friends.forEach((friend) => {
        if (friend.user_id === actions.friend_id) {
          if (actions.off === "off") {
            setActions({
              actions: actions.actions,
              friend_id: actions.friend_id
            })
          }
        }
      })
    }
  }, [friends])

  useEffect(() => {
    if (acceptedCall && receivingCall) {
      setActions({
        actions: "accept",
        friend_id: offerData.from
      })
      setReceivingCall(false)
    }
    if (!acceptedCall && receivingCall) {
      setOfferData(null)
      setReceivingCall(false)
    }
  }, [acceptedCall])

  async function createPeerConnection(friend_id: string) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    localStreamRef.current = stream

    const pc = new RTCPeerConnection()
    pcRef.current = pc

    stream.getTracks().forEach((track) => pc.addTrack(track, stream))

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = event.streams[0]
      setSendingCall(false)
      setAcceptedCall(true)
      setCallStarted(true)
    }
    
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "ice",
          candidate: event.candidate,
          friend_id: friend_id
        }))
      }
    }

    pc.oniceconnectionstatechange = () => {
      switch (pcRef.current?.iceConnectionState) {
        case "disconnected":
          if (callStarted) {
            endCall()
          }
          break
        case "failed":
          endCall()
          break
      }
    }
  }

  async function startCall() {
    if (!actionsRef.current.friend_id || !wsRef.current || callStarted) return
    await createPeerConnection(actionsRef.current.friend_id)
    if (!pcRef.current) return

    const offer = await pcRef.current.createOffer()
    await pcRef.current.setLocalDescription(offer)

    wsRef.current?.send(JSON.stringify({
      type: "offer",
      sdp: offer,
      friend_id: actionsRef.current.friend_id
    }))
  }

  async function handleOffer(data:any) {
    await createPeerConnection(data.from)
    if (!pcRef.current) return

    await pcRef.current.setRemoteDescription(data.sdp)
    const answer = await pcRef.current.createAnswer()
    await pcRef.current.setLocalDescription(answer)

    wsRef.current?.send(JSON.stringify({
      type: "answer",
      sdp: answer,
      friend_id: data.from
    }))

    pendingCandidates.current.forEach(c => pcRef.current && pcRef.current.addIceCandidate(c))
    pendingCandidates.current = []
    setOfferData(null)
    setReceivingCall(false)
  }

  async function handleAnswer(data: any) {
    if (!pcRef.current) return
    await pcRef.current.setRemoteDescription(data.sdp)
  }

  function handleEndCall() {
    wsRef.current?.send(JSON.stringify({
      type: "desconect",
      friend_id: actionsRef.current.friend_id
    }))
    endCall()
  }

  function endCall() {
    setSendingCall(false)
    setFriend(null)
    setAcceptedCall(false)
    setCallStarted(false)
    setReceivingCall(false)
    wsRef.current?.send(JSON.stringify({
      type: "unbusy"
    }))
    pcRef.current?.close()
    pcRef.current = null
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    localStreamRef.current = null
  }

  return (
    <>
    <div className="grid justify-center">
      { callStarted && <Timer /> }

      <div className="flex justify-center">
        <div className="flex-1 flex flex-col items-center">
          <div className={`bg-white w-25 h-25 rounded-full m-3 ${!user && ""}`}>
            <Image src="/img/account.png" alt="your image" width={100} height={100} className="cursor-pointer mb-1" />
          </div>
          {user && 
          <>
            <p className="text-amber-50 text-center mt-2 font-bold">{user.name}</p>
            <p className="text-white/60 text-center text-[.9rem] font-bold">@{user.user}</p>
          </>}
        </div>

        {friend &&
        <div className="flex-1 flex flex-col items-center fade-in-up">
          <div className={`bg-white w-25 h-25 rounded-full m-3 ${(receivingCall || sendingCall) && "animate-pulse"}`}>
            <Image src="/img/account.png" alt="user image" width={100} height={110} className="cursor-pointer mb-1" />
          </div>
          <p className="text-amber-50 text-center mt-2 font-bold">{friend.name}</p>
          <p className="text-white/60 text-center text-[.9rem] font-bold">@{friend.user}</p>
        </div>
        }
      </div>
      <div className="flex justify-center">
        {(callStarted || receivingCall) && (
          <div className={`${receivingCall && "animate-pulse"}`}>
            <button
              aria-label="accept call"
              onClick={() => {
                if (receivingCall && friend) {
                  setActions({
                    actions: "desconect",
                    friend_id: friend.user_id,
                  })
                  return
                }
                handleEndCall()
              }}
              className="bg-red-500 hover:bg-red-600 rounded-full w-20 h-20 m-auto mt-5 flex justify-center items-center fade-in-up cursor-pointer"
            >
            <Image src="/img/phone.png" alt="phone" width={45} height={45} />
          </button>
          </div>
        )}

        {receivingCall && (
          <div className="animate-pulse">
            <button
              aria-label="finish call"
              onClick={() => setAcceptedCall(true)}
              className="bg-green-500 hover:bg-green-600 rounded-full w-20 h-20 m-auto mt-5 flex justify-center items-center fade-in-up cursor-pointer ml-4"
            >
              <Image src="/img/phone.png" alt="phone" width={45} height={45} />
            </button>
          </div>
        )}
      </div>
    </div>
    <audio ref={remoteAudioRef} autoPlay />
    { ( receivingCall || sendingCall ) && <audio src="/audio/phone_ring.wav" autoPlay loop/> }
    </>

  )
}