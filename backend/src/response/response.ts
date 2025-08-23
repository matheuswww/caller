import type { $ZodIssue } from "zod/v4/core"

interface response {
  message: string
  code: number
  causes: errors[] | null
}

interface errors {
  field: string
  message: string
}

export type messages = "invalid cookie" | "validation error" | string

export default function response(message: string, code: number, errors: errors[] | null): response {
  return {
    message: message,
    code: code,
    causes: errors
  }
}

export function getErrors(errors: $ZodIssue[]): errors[] {
  const res: errors[] = errors.map((e) => {
    return {
      field: typeof e.path[0] == "string" ? e.path[0] : "",
      message: e.message
    }
  })
  return res
}