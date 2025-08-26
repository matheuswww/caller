import Image from "next/image"

export default function Search() {
  return (
    <div className="max-w-xs flex justify-center items-center h-12 relative top-10">
      <label htmlFor="search" className="absolute right-7">
        <Image src="/img/search.png" alt="lupa" width={20} height={20} className="cursor-pointer" />
      </label>
      <input id="search" type="text" placeholder="Buscar usuário" className="w-52 bg-purple-950 rounded-md text-amber-50 p-1 pl-2 pr-10 font-bold"/>

      <div className="bg-[rgb(23,17,26)] w-52 h-45 absolute -bottom-45 rounded-md overflow-hidden overflow-y-auto">



        <div className="flex items-center mt-2">
          <div className="bg-amber-50 w-8 h-8 rounded-full m-2 ml-3">
            <Image
              src="/img/account.png"
              alt="user image"
              width={32}
              height={32}
              className="cursor-pointer mb-1"
            />
          </div>
          <div>
             <p className="text-white text-[0.8rem] font-bold">name</p>
             <p className="relative bottom-1 text-white text-[0.8rem] font-bold">@user</p>
          </div>
        </div>

                <div className="flex items-center mt-2">
          <div className="bg-amber-50 w-8 h-8 rounded-full m-2 ml-3">
            <Image
              src="/img/account.png"
              alt="user image"
              width={32}
              height={32}
              className="cursor-pointer mb-1"
            />
          </div>
          <div>
             <p className="text-white text-[0.8rem] font-bold">name</p>
             <p className="relative bottom-1 text-white text-[0.8rem] font-bold">@user</p>
          </div>
        </div>

        <div className="flex items-center mt-2">
          <div className="bg-amber-50 w-8 h-8 rounded-full m-2 ml-3">
            <Image
              src="/img/account.png"
              alt="user image"
              width={32}
              height={32}
              className="cursor-pointer mb-1"
            />
          </div>
          <div>
             <p className="text-white text-[0.8rem] font-bold">name</p>
             <p className="relative bottom-1 text-white text-[0.8rem] font-bold">@user</p>
          </div>
        </div>

     <div className="flex items-center mt-2">
          <div className="bg-amber-50 w-8 h-8 rounded-full m-2 ml-3">
            <Image
              src="/img/account.png"
              alt="user image"
              width={32}
              height={32}
              className="cursor-pointer mb-1"
            />
          </div>
          <div>
             <p className="text-white text-[0.8rem] font-bold">name</p>
             <p className="relative bottom-1 text-white text-[0.8rem] font-bold">@user</p>
          </div>
        </div>


      </div>
    </div>
  )
}
