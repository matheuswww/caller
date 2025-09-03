import { Home } from "@/components/home/home";
import { cookies } from "next/headers";

export default async function Page() {
  const cookie = (await cookies()).get("user")?.value
  

  return (
    <Home
      cookie={cookie}
    />
  );
}
