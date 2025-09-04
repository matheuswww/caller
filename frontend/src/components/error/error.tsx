"use client"

export default function ErrorPage() {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col p-5">
      <p className="text-amber-50 font-bold text-xl text-center">It looks like there was an error, try refresh the page</p>
      <button onClick={() => window.location.reload()} className="mt-5 p-2 w-40 text-amber-50 font-bold bg-purple-950 rounded-md hover:bg-purple-900 cursor-pointer text-center">Refresh Page</button>
    </div>
  )
}