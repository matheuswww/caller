import throttle from "@/funcs/throttle"
import searchUser, { searchUserResponse } from "@/lib/api/user/searchUser"
import Image from "next/image"
import { SyntheticEvent, useMemo, useState } from "react"
import AddButton from "./addButton"
import { AlertType } from "@/components/alert/alert"

interface searchProps {
  addAlert: (message: string, type?: AlertType | undefined, duration?: number) => void
}

export default function Search({ addAlert }:searchProps) {
  const [users, setUsers] = useState<searchUserResponse[] | null>(null)

  const throttledHandleInput = useMemo(() => throttle(handleInput, 500), [])

  async function handleInput(event: SyntheticEvent) {
    if (event.target instanceof HTMLInputElement) {
      const val = event.target.value
      if(val === "") {
        setUsers(null)
        return
      }
      try {
        const res = await searchUser({
          user: val
        })
        setUsers(res)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
     <div className="max-w-xs flex justify-center items-center h-12 relative top-10">  
      <label htmlFor="search" className="absolute right-4">
        <Image src="/img/search.png" alt="magnifying glass" width={20} height={20} className="cursor-pointer" />
      </label>
      <input id="search" type="text" placeholder="Search user" className="w-52 bg-purple-950 rounded-md text-amber-50 p-1 pl-2 pr-10 font-bold sm:w-80" onInput={throttledHandleInput}/>
      {users && users.length > 0 &&
      <div className="w-52 h-45 absolute -bottom-43 overflow-hidden overflow-y-auto sm:w-80">
        <div className="bg-[rgb(23,17,26)] rounded-md">
            {users.map((user) => {
              return (
                <div className="flex items-center mt-2" key={user.user_id}>
                  <div className="w-8 h-8 m-2 ml-3 relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                        src={user.img ? user.img : "/img/account.png"}
                        alt="user image"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <AddButton user={user} addAlert={addAlert} />
                  </div>
                  <div>
                    <p className="text-white text-[0.8rem] font-bold">{user.name}</p>
                    <p className="relative bottom-1 text-white text-[0.8rem] font-bold">@{user.user}</p>
                  </div>
                </div>
              )
          })}
        </div>
      </div>
      }
    </div>
  )
}
