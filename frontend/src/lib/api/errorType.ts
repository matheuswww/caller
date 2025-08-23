export default interface error {
  message: string
  code: string
  causes: causes | null
}

interface causes {
  field: string
  message: string
}