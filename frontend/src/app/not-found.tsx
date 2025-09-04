import Link from "next/link"

export default function NotFound() {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col p-5">
      <p className="text-amber-50 font-bold text-xl text-center">Page not found</p>
      <Link href={"/"} className="mt-5 p-2 w-40 text-amber-50 font-bold bg-purple-950 rounded-md hover:bg-purple-900 cursor-pointer text-center">Go to home</Link>
    </div>
  )
}