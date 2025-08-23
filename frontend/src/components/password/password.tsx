"use client";

import { useState } from "react";
import Image from "next/image";

interface PasswordInputProps {
  register: any;
  name: string;
  id?: string;
  placeholder?: string;
}

export default function PasswordInput({ register, name, id = "password", placeholder = "" }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={visible ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        {...register(name)}
        className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute inset-y-0 right-2 flex items-center"
      >
        <Image
          src={visible ? "/img/visibleoff.png" : "/img/visible.png"}
          alt={visible ? "Hide password" : "Show password"}
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}
