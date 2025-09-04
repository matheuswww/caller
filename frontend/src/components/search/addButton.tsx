import { useState } from "react"
import Image from "next/image"
import addFriend, { AlreadySent } from "@/lib/api/friend/addFriend"
import { searchUserResponse } from "@/lib/api/user/searchUser"
import { InvalidCookie } from "@/lib/api/error"
import { deleteCookie } from "@/action/deleteCookie"
import { useRouter } from "next/navigation"
import { AlertType } from "@/components/alert/alert"

interface addButtonProps {
  user: searchUserResponse
  addAlert: (message: string, type?: AlertType | undefined, duration?: number) => void
}

export default function AddButton({ user, addAlert }:addButtonProps) {
  const router = useRouter()
  const [sent, sentSent] = useState<boolean>(false)

  async function handleClick(user: string) {
    if (sent) return
    try {
      await addFriend({
        friend: user
      })
      sentSent(true)
    } catch (error) {
      if (error instanceof AlreadySent) {
        addAlert("You have already sent a friend request to this user", "yellow", 1800)
        return
      }
      if (error instanceof InvalidCookie) {
        await deleteCookie("user")
        router.push("/signin")
        return
      }
      addAlert("There seems to be an error, please try again", "red", 1800)
      console.log(error)
    }
  }
  
  return (
    <button className={`absolute -top-3 -left-3 ${!sent ? "bg-purple-900" : "bg-green-700"} ${!sent ?"hover:bg-purple-700" : "hover:bg-green-800"} hover:cursor-pointer rounded-full`} onClick={() => handleClick(user.user)}>
      {
        !sent ?
          <Image
          src="/img/add.png"
          alt="user image"
          width={20}
          height={20}
        />
        :
        <Image
          src="/img/check.png"
          alt="user image"
          width={20}
          height={20}
        />
      }
    </button>
  )
}