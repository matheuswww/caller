"use client"

import Image from "next/image"
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react"

interface props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  popupRef: RefObject<HTMLDivElement | null>
}

export default function NotiButton({ open, setOpen, popupRef }:props) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const main = document.querySelector("main")
    const nav = document.querySelector("nav")
    if (main && nav) {
      if (open) {
        main.style.opacity = "0.1"
        nav.style.opacity = "0.1"
        return
      }
      main.style.opacity = "1"
      nav.style.opacity = "1"
    }
    window.addEventListener("click", handleOut)
  }, [open])

  function handleOut(event: Event) {
    if (popupRef.current && buttonRef.current && event.target instanceof HTMLElement) {
      if(!popupRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
  }

  function handleClick() {
    setOpen(true)
  }

  return (
    <>
      <button  ref={buttonRef} onClick={handleClick} className="cursor-pointer p-2 bg-purple-950 w-10 h-10 rounded-full mb-5 mt-14 relative hover:bg-purple-900">
        <Image src="/img/noti.png" alt="lupa" width={24} height={24} className="mb-1" />
        <span className="flex justify-center items-center absolute bg-red-400 w-6 h-6 text-center rounded-full text-white font-bold -top-2 left-6 text-[.9rem]">3</span>
      </button>
    </>
  )
}