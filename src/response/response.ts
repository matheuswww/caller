import type { $ZodIssue } from "zod/v4/core"

interface response {
  message: string
  code: number
  causes: errors[] | null
}

interface errors {
  Field: string
  Message: string
}

export type messages =  "validation error" | "server error"

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
      Field: typeof e.path[0] == "string" ? e.path[0] : "",
      Message: e.message
    }
  })
  return res
}