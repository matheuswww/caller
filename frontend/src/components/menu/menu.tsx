import { useEffect, useRef, useState } from "react";
import Image from "next/image"
import NotiButton from "./noti/notiButton";
import NotiPopup from "./noti/notiPopup";
import { deleteCookie } from "@/action/deleteCookie";
import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter()
  const [expanded, setExpanded] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [notiPopup, setNotiPopup] = useState<boolean>(false)
  const popupNotiRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className={`overflow-hidden fixed h-screen left-0 top-0 z-50`}>
      <NotiPopup open={notiPopup} popupRef={popupNotiRef} setOpen={setNotiPopup} />
      <nav ref={menuRef} className={`flex flex-col h-screen bg-[rgb(23,17,26)] p-2 transition-all duration-300 pl-3 overflow-hidden ${expanded ? "w-64" : "w-16"}`}>
        <button onClick={handleClick} className={`p-2 cursor-pointer bg-purple-950 hover:bg-purple-900 rounded-full fixed top-1 flex justify-center items-center transition-all duration-300 w-8 h-8 ${expanded ? "left-58" : "left-12"}`}> 
          { expanded ? <Image src="/img/arrowLeft.png" className="relative left-[3px]" alt="arrow" width={20} height={20} /> : <Image src="/img/arrowRight.png" alt="arrow" width={20} height={20} /> }
        </button>

        <NotiButton open={notiPopup} popupRef={popupNotiRef} setOpen={setNotiPopup}  />

        <div className="flex items-center">
          <div className="rounded-full w-11 h-11 bg-white mt-2 flex-shrink-0">     
            <Image
              src="/img/account.png"
              alt="user image"
              width={44}
              height={44}
              className="cursor-pointer mb-1"
            />
          </div>
          <div className={`ml-2 transition-all duration-300 ${expanded ? "visible opacity-100" : "invisible opacity-0"}`}aria-hidden={!expanded}>
            <p className="text-amber-50 font-bold mt-2">Cleiton</p>
            <p className="text-white/60 text-center text-[.9rem] font-bold">@peidei</p>
          </div>
        </div>
      </nav>
      <button onClick={handleExit} className="bg-purple-950 absolute bottom-10 ml-2 w-30 p-2 rounded-md font-bold text-amber-50 cursor-pointer flex hover:bg-purple-900">
        <Image src="/img/exit.png" className="mr-6" width={24} height={24} alt="sdf" />Exit
      </button>
    </div>
  )
}