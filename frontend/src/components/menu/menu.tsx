import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image"
import NotiButton from "./noti/notiButton";
import NotiPopup from "./noti/notiPopup";
import { deleteCookie } from "@/action/deleteCookie";
import { useRouter } from "next/navigation";
import { getFriends, getFriendsResponse } from "@/lib/api/friend/getFriends";
import { friendshipAction } from "@/lib/api/friend/friendShipAction";
import { InvalidCookie } from "@/lib/api/error";
import { AlertType } from "../alert/alert";

interface props {
  setError: Dispatch<SetStateAction<boolean>>
  addAlert: (message: string, type?: AlertType | undefined, duration?: number) => void
}

export default function Menu({ setError, addAlert }:props) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<boolean>(false)
  const [friends, setFriends] = useState<getFriendsResponse | null>(null)
  const [notiPopup, setNotiPopup] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const popupNotiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    (async function() {
      try {
        const res = await getFriends()
        setFriends(res)
      } catch (error) {
        if (error instanceof InvalidCookie) {
          await deleteCookie("user")
          router.push("/signin")
          return
        }
        setError(true)
        console.log(error)
      }
    }())
  }, [])

  useEffect(() => {
    const main = document.querySelector("main")
    if (main) {
      if (expanded) {
        main.style.opacity = "0.1"
        return
      }
      main.style.opacity = "1"
    }
    window.addEventListener("click", handleOut)
  }, [expanded])

  function handleOut(event: Event) {
    if (menuRef.current && event.target instanceof HTMLElement) {
      if(!menuRef.current.contains(event.target)) {
        setExpanded(false)
      }
    }
  }

  function handleClick() {
    setExpanded(prev => !prev);
  }

  async function handleExit() {
    await deleteCookie("user")
    router.push("/signin")
  }
  
  async function handleDeleteFriend(id: string) {
    try {
      await friendshipAction({
        action: "delete",
        friend_id: id
      })
    } catch (error) {
      if (error instanceof InvalidCookie) {
        await deleteCookie("user")
        router.push("/signin")
        return
      }
      addAlert("parece que houver um erro, tente novamente", "red", 1800)
      console.log(error)
    }
  }

  return (
    <div className={`overflow-hidden fixed h-screen left-0 top-0 z-50`}>
      <NotiPopup addAlert={addAlert} getFriendsResponse={friends} open={notiPopup} popupRef={popupNotiRef} setOpen={setNotiPopup} />
      <nav ref={menuRef} className={`flex flex-col h-screen bg-[rgb(23,17,26)] p-2 transition-all duration-300 pl-3 overflow-hidden ${expanded ? "w-64" : "w-16"}`}>
        <button aria-label={!expanded ? "open menu" : "close menu"} onClick={handleClick} className={`p-2 cursor-pointer bg-purple-950 hover:bg-purple-900 rounded-full fixed top-1 flex justify-center items-center transition-all duration-300 w-8 h-8 ${expanded ? "left-58" : "left-12"}`}> 
          { expanded ? <Image src="/img/arrowLeft.png" className="relative left-[3px]" alt="arrow" width={20} height={20} /> : <Image src="/img/arrowRight.png" alt="arrow" width={20} height={20} /> }
        </button>

        <NotiButton open={notiPopup} popupRef={popupNotiRef} setOpen={setNotiPopup} getFriendsResponse={friends}  />

        {friends ? friends.friends.map((friend) => {
          return (
            <>
            <div className="flex items-center relative" key={friend.user_id}>
              <div className="rounded-full w-11 h-11 bg-white mt-2 flex-shrink-0">     
                <Image
                  src={friend.img ? friend.img : "/img/account.png"}
                  alt="user image"
                  width={44}
                  height={44}
                  className="cursor-pointer mb-1"
                />
              </div>
              <div className={`ml-2 transition-all duration-300 ${expanded ? "visible opacity-100" : "invisible opacity-0"}`}aria-hidden={!expanded}>
                <p className="text-amber-50 font-bold mt-2">{friend.name}</p>
                <p className="text-white/60 text-[.9rem] font-bold">@{friend.user}</p>
              </div>
              <button onClick={() => handleDeleteFriend(friend.user_id)} aria-label="x to delete from friends " className="bg-red-400 rounded-full w-6 h-6 font-bold text-amber-50 mt-2 cursor-pointer hover:bg-red-500 absolute -top-5 left-7">x</button>
            </div>
            </>
          )
        }) : 
          [...Array(3)].map((_,i) => {        
            return <div key={i} role="status" aria-label="loading friends" className="w-11 h-11 rounded-full mt-2 flex-shrink-0 bg-purple-950 animate-pulse"></div>
          })
        }
      </nav>
      <button onClick={handleExit} className="bg-purple-950 absolute bottom-10 ml-2 w-30 p-2 rounded-md font-bold text-amber-50 cursor-pointer flex hover:bg-purple-900">
        <Image src="/img/exit.png" className="mr-6" width={24} height={24} alt="sdf" />Exit
      </button>
    </div>
  )
}