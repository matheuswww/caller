import { API_URL } from "../api"
import { InvalidCookie } from "../error"

export interface friendShipActionRequest {
  friend_id: string
  action: "accept" | "reject" | "delete"
}

export async function friendshipAction(req: friendShipActionRequest) {
  const url = `${API_URL}/friend/friendshipAction`
  await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(req)
  }).then((res) => {
    if(res.status === 200) {
      return
    }
    if (res.status === 401) {
      throw new InvalidCookie()
    }
    throw new Error()
  })
}