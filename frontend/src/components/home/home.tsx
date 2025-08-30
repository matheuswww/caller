"use client"

import Menu from "../menu/menu"
import Search from "@/app/search/search"
import Call from "@/app/call/call"
import { useState } from "react"
import { useAlertSystem } from "../alert/alert"

export default function Home() {
  const [alertComponent, addAlert] = useAlertSystem()
  const [error, setError] = useState<boolean>(false)
  
  return (
    <>
    <Menu
      setError={setError}
      addAlert={addAlert}
    />
    <main className={`transition-opacity duration-300 ease-in-out`}>
      { alertComponent }
      <section className="grid grid-rows-[max-content_1fr] justify-center items-center h-screen ml-16">
        <Search
          addAlert={addAlert}
        />
        <Call />
      </section>
    </main>
    </>
  )
}