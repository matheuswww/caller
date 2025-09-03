import { useEffect, useState } from "react"

export default function Timer() {
  const [timer, setTimer] = useState<number>(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <p className="text-white text-center font-bold text-[1.5rem]">{formatTime(timer)}</p>
  )
}