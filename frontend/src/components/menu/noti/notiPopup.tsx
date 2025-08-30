import { AlertType } from "@/components/alert/alert"
import { friendshipAction } from "@/lib/api/friend/friendShipAction"
import { friendsResponse, getFriendsResponse } from "@/lib/api/friend/getFriends"
import Image from "next/image"
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react"

interface props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  popupRef: RefObject<HTMLDivElement | null>
  getFriendsResponse: getFriendsResponse | null
  addAlert: (message: string, type?: AlertType | undefined, duration?: number) => void
}

export default function NotiPopup({ open, setOpen, popupRef, getFriendsResponse, addAlert }:props) {

  useEffect(() => {
    if (open) {
      if(popupRef.current) {
        popupRef.current.focus()
      }
    }
  }, [open])

  async function handleFriendAction(id: string, accept: boolean) {
    try {
      await friendshipAction({
        action: accept ? "accept" : "reject",
        friend_id: id
      })
    } catch (error) {
      addAlert("Parece que houve um erro, tente novamente", "red", 2000)
      console.log(error)
    }
  }

  return (
    <div aria-hidden={!open} className={`w-88 h-96 bg-[rgb(23,17,26)] fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md shadow-lg transition-all duration-300 ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"} p-4`} ref={popupRef}>

      <div className="overflow-hidden overflow-y-auto max-h-96">
        { 
        getFriendsResponse ? 
            getFriendsResponse.requests.length > 0 ? 
            getFriendsResponse.requests.map((friend) => {
            return (
              <div key={friend.user_id} className="bg-purple-950 w-full min-h-25 rounded-md flex items-center mt-2 p-2 relative">
                <div className="bg-amber-50 w-14 h-14 shrink-0 rounded-full ml-2">
                  <Image
                    src="/img/account.png"
                    alt="user image"
                    width={60}
                    height={60}
                    className="cursor-pointer mb-1"
                  />
                </div>
                <p className="text-[.9rem] text-amber-50 font-bold ml-3 pb-8">{friend.name}</p>
                <button className="absolute right-24 bottom-2 bg-green-700 text-amber-50 font-bold w-20 rounded-md cursor-pointer" onClick={() => handleFriendAction(friend.user_id, true)}>aceitar</button>
                <button className="absolute right-2 bottom-2 bg-red-700 text-amber-50 font-bold w-20 rounded-md cursor-pointer" onClick={() => handleFriendAction(friend.user_id, false)}>recusar</button>
              </div>
            )}) 
            :
              <div className="text-amber-50 font-bold text-center mt-4">No notifications found</div>
        : 
          [...Array(3)].map((_,i) => {
            return <div key={i} role="status" aria-label="loading notifications" className="bg-purple-950 w-full min-h-25 rounded-md flex items-center mt-2 p-2 relative animate-pulse"></div>
          })
        }
      </div>

      <button aria-label="close notifications" className="bg-purple-950 w-10 h-10 rounded-full flex justify-center items-center absolute -top-5 -right-5 cursor-pointer hover:bg-purple-900" onClick={() => setOpen(false)}>
        <Image width={26} height={26} alt="x to close button" src="/img/close.png" />
      </button>

    </div>
  )
}