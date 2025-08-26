import Image from "next/image"

export default function() {
  return (
    <div>
      <p className="text-white text-center font-bold text-[1.5rem]">00:00</p>
      
      <div className="flex">
        <div className="flex-1 flex flex-col items-center">
          <div className="bg-white w-25 h-25 rounded-full m-3">
            <Image src="/img/account.png" alt="lupa" width={100} height={100} className="cursor-pointer mb-1" />
          </div>
          <p className="text-amber-50 text-center mt-2 font-bold">Name</p>
          <p className="text-white/60 text-center text-[.9rem] font-bold">@User</p>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="bg-white w-25 h-25 rounded-full m-3">
            <Image src="/img/account.png" alt="lupa" width={100} height={110} className="cursor-pointer mb-1" />
            </div>
            <p className="text-amber-50 text-center mt-2 font-bold">Name</p>
            <p className="text-white/60 text-center text-[.9rem] font-bold">@User</p>
          </div>
        </div>
    </div>
  )
}