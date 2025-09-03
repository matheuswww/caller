"use client"

import Menu from "../menu/menu"
import Search from "@/app/search/search"
import Call from "@/app/call/call"
import { useState } from "react"
import { useAlertSystem } from "../alert/alert"
import { getFriendsResponse } from "@/lib/api/friend/getFriends"

export interface actions { 
  actions: "request" | "accept" | "desconect" | null 
  friend_id: string | null
}

interface props {
  cookie: string | undefined
}

export function Home({ cookie }:props) {
  const [friends, setFriends] = useState<getFriendsResponse | null>(null)
  const [alertComponent, addAlert] = useAlertSystem()
  const [error, setError] = useState<boolean>(false)
  const [actions, setActions] = useState<actions>({
    actions: null,
    friend_id: null
  })
  
  return (
    <>
    <Menu
      setError={setError}
      addAlert={addAlert}
      setActions={setActions}
      friends={friends}
      setFriends={setFriends}
    />
    <main className={`transition-opacity duration-300 ease-in-out`}>
      { alertComponent }
      <section className="grid grid-rows-[max-content_1fr] justify-center items-center h-screen ml-16">
        <Search
          addAlert={addAlert}
        />
        <Call 
          setActions={setActions} 
          actions={actions}
          cookie={cookie}
          setError={setError}
          friends={friends}
          setFriends={setFriends}
        />
      </section>
    </main>
    </>
  )
}