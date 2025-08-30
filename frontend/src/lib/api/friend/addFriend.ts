import { API_URL } from "../api"
import { AppError, InvalidCookie } from "../error"
import error from "../errorType"

interface addFriendRequest {
  friend: string
}

export default async function addFriend(friend: addFriendRequest) {
  const url = `${API_URL}/friend/addFriend`
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(friend)
  }).then(async (res) => {
    if (res.status === 201) {
      return
    }
    const text = await res.text()
    if (text) {
      if (res.status === 400) {
        const err: error = await JSON.parse(text)
        if (err.message === "friend request already sent") {
          throw new AlreadySent()
        }
      }
    }
    if (res.status === 401) {
      throw new InvalidCookie()
    }
    throw Error()
  })
}

export class AlreadySent extends AppError {
  constructor(msg = 'already sent error') {
    super(msg, 400);
    this.name = 'AlreadySent';
  }
}