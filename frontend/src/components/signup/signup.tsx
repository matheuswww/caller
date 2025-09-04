"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import signup, { ConfictEmailError, ConfictUserError } from "@/lib/api/user/signup";
import { useState } from "react";
import { useAlertSystem } from "../alert/alert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "../password/password";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const signupSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(20, { message: "Name must be at most 20 characters long" }),
  user: z.string()
    .min(1, { message: "User is required" })
    .max(20, { message: "User must be at most 20 characters long" }),
  email: z.string()
    .regex(emailRegex, { message: "Invalid email format" })
    .max(255, { message: "Email must be at most 255 characters long" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(60, { message: "Password must be at most 60 characters long" }),
  confirmPassword: z.string()
    .min(6, { message: "Confirm password must be at least 6 characters long" })
    .max(60, { message: "Confirm password must be at most 60 characters long" }),
  img: z
  .custom<FileList>(
   (fileList) => {
    if (!fileList) return false;
    return (
     fileList instanceof FileList &&
     fileList.length === 1 &&
     fileList[0] instanceof File
    );
   },
   {
    message: 'Selecione uma imagem válida',
   },
  )
  .refine(
   (fileList) => {
    if (!(fileList instanceof FileList) || fileList.length === 0) return false;
    const file = fileList[0];
    const maxSize = 4 * 1024 * 1024;
    return file.size <= maxSize;
   },
   {
    message: 'Imagem deve ter no máximo 4MB',
   },
  )
  .refine(
   (fileList) => {
    if (!(fileList instanceof FileList) || fileList.length === 0) return false;
    const file = fileList[0];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    return ['.jpg', '.jpeg', '.png'].includes(ext);
   },
   {
    message: 'A imagem deve ser JPG, JPEG ou PNG',
   },
  ),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords must match",
})

type SignupData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter()
  const [load, setLoad] = useState<boolean>(false)
  const [alertComponent, addAlert] = useAlertSystem()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: SignupData) => {
  try {
    setLoad(true)
    await signup(data)
    router.push("/")
    } catch (error) {
      if (error instanceof ConfictEmailError) {
        setError("This email already is in use")
        setLoad(false)
        return
      }
      if (error instanceof ConfictUserError) {
        setLoad(false)
        setError("This user already is in use")
        return
      }
      setLoad(false)
      addAlert("Parece que houve um erro, tente novamente", "red", 2000)
      console.log(error)
    }
  }

  return (
    <main>
      {alertComponent}
      <section className="h-screen grid p-3">
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="
            bg-gray-950 rounded-md p-10 border-amber-50
            flex flex-col w-full m-auto max-w-lg relative
            [&_input]:p-2 [&_input]:rounded-md [&_input]:bg-purple-900 [&_input]:text-amber-50 
            [&_input]:focus:outline-none [&_input]:focus:ring-2 [&_input]:focus:ring-amber-50
            [&>label]:text-amber-50 [&>label]:mt-3
          "
          encType="multipart/form-data"
        >
          <h1 className="text-amber-50 text-5xl font-bold text-center mb-5">Signup</h1>
          
          <label htmlFor="name">Name</label>
          <input placeholder="Your name" id="name" {...register("name")} />
          {errors.name && <p className="text-red-400 font-bold mt-2">{errors.name.message}</p>}

          <label htmlFor="user">User</label>
          <input placeholder="Your user" id="user" {...register("user")} />
          {errors.user && <p className="text-red-400 font-bold mt-2">{errors.user.message}</p>}

          <label htmlFor="email">Email</label>
          <input placeholder="Your email" id="email" {...register("email")} />
          {errors.email && <p className="text-red-400 font-bold mt-2">{errors.email.message}</p>}

          <label htmlFor="password">Password</label>
          <PasswordInput register={register} name="password" placeholder="Your password" />
          {errors.password && <p className="text-red-400 font-bold mt-2">{errors.password.message}</p>}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <PasswordInput register={register} name="confirmPassword" placeholder="Confirme Your password" />
          {errors.confirmPassword && <p className="text-red-400 font-bold mt-2">{errors.confirmPassword.message}</p>}

          <label htmlFor="img">Profile Image</label>
          <input
            type="file"
            id="img"
            {...register("img")}
            className="
              w-full text-sm text-amber-50 
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-600 file:text-amber-50
              hover:file:bg-purple-700
              cursor-pointer
            "
          />
          {errors.img?.message && typeof errors.img.message === "string" && (
            <p className="text-red-400 font-bold mt-2">{errors.img.message}</p>
          )}

          {error && <p className="text-red-400 font-bold mt-7">{error}</p>}
          <Link href="/signin" className="text-amber-50 mt-3 underline">Already have an account?</Link>
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
