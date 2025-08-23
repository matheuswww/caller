"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAlertSystem } from "../alert/alert";
import signin, { EmailNotFound, InvalidPassword } from "@/lib/api/user/signin";
import Link from "next/link";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const signinSchema = z.object({
  email: z.string()
    .regex(emailRegex, { message: "Invalid email format" })
    .max(255, { message: "Email must be at most 255 characters long" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(60, { message: "Password must be at most 60 characters long" }),
})

type SigninData = z.infer<typeof signinSchema>;

export default function SigninForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SigninData>({
    resolver: zodResolver(signinSchema),
  });
  const router = useRouter()
  const [load, setLoad] = useState<boolean>(false)
  const [alertComponent, addAlert] = useAlertSystem()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: SigninData) => {
    try {
      setLoad(true)
      await signin(data)
      router.push("/")
    } catch (error) {
      if (error instanceof EmailNotFound) {
        setError("Email not found")
        setLoad(false)
        return
      }
      if (error instanceof InvalidPassword) {
        setError("Invalid password")
        setLoad(false)
        return
      }
      addAlert("Parece que houve um erro, tente novamente", "red", 2000)
      setLoad(false)
      console.log(error)
    }
  };

  return (
    <main>
      {alertComponent}
      <section className="h-screen grid p-3">
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="
            bg-gray-950 rounded-md p-10 border-amber-50
            flex flex-col w-full m-auto max-w-lg relative
            [&>input]:p-2 [&>input]:rounded-md [&>input]:bg-purple-900 [&>input]:text-amber-50 
            [&>input]:focus:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-amber-50
            [&>label]:text-amber-50 [&>label]:mt-3
          "
        >
          <h1 className="text-amber-50 text-5xl font-bold absolute -top-20 left-1/2 -translate-x-1/2">Signin</h1>
          <label htmlFor="email">Email</label>
          <input id="email" {...register("email")} />
          {errors.email && <p className="text-red-400 font-bold mt-2">{errors.email.message}</p>}

          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
          {errors.password && <p className="text-red-400 font-bold mt-2">{errors.password.message}</p>}
          {error && <p className="text-red-400 font-bold mt-7">{error}</p>}
          <Link href="/signup" className="text-amber-50 mt-3 underline">Não possui uma conta?</Link>
          <div className="relative mt-8">
            <button
              type="submit"
              disabled={load}
              className="w-full bg-purple-500 hover:bg-purple-600 z-10 hover:cursor-pointer rounded-md p-3 text-amber-50 font-bold text-2xl transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
            </button>
            {load && (
              <span className="absolute inset-0 flex items-center justify-center w-full h-full">
                <span className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></span>
              </span>
            )}
          </div>
        </form>
      </section>
    </main>
  )
}
