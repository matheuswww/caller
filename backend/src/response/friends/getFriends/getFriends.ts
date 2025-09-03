export default interface getFriendsResponse {
  friends: friendsResponse[]
  requests: friendsResponse[]
  last_user: string
  next: boolean
}

export interface friendsResponse {
  user_id: string
  name: string
  user: string
  img: string
  state: "on" | "off" | "busy"
}