interface msg {
  message: string
}

export default function responseWs(msg: string): msg {
  return {
    message: msg
  }
}