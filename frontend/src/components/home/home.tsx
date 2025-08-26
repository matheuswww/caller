"use client"

import Menu from "../menu/menu"
import Search from "@/app/search/search"
import Call from "@/app/call/call"

export default function Home() {
  return (
    <>
    <Menu />
    <main className={`transition-opacity duration-300 ease-in-out`}>
      <section className="grid grid-rows-[max-content_1fr] justify-center items-center h-screen ml-16">
        <Search />
        <Call />
      </section>
    </main>
    </>
  )
}