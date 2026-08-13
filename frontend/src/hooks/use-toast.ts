import { useState, useEffect } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
} & { variant?: "default" | "destructive" | "success" }

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = {
  ADD_TOAST: "ADD_TOAST"
  UPDATE_TOAST: "UPDATE_TOAST"
  DISMISS_TOAST: "DISMISS_TOAST"
  REMOVE_TOAST: "REMOVE_TOAST"
}

let memoryState: { toasts: ToasterToast[] } = { toasts: [] }
const listeners: Array<(state: { toasts: ToasterToast[] }) => void> = []

export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId()
  const update = (props: ToasterToast) => {
    memoryState = {
      ...memoryState,
      toasts: memoryState.toasts.map((t) => (t.id === id ? { ...t, ...props } : t)),
    }
    listeners.forEach((listener) => listener(memoryState))
  }
  const dismiss = () => {
    memoryState = {
      ...memoryState,
      toasts: memoryState.toasts.filter((t) => t.id !== id),
    }
    listeners.forEach((listener) => listener(memoryState))
  }

  memoryState = {
    ...memoryState,
    toasts: [{ ...props, id }, ...memoryState.toasts].slice(0, TOAST_LIMIT),
  }
  listeners.forEach((listener) => listener(memoryState))

  return {
    id,
    dismiss,
    update,
  }
}

export function useToast() {
  const [state, setState] = useState<{ toasts: ToasterToast[] }>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      memoryState = {
        ...memoryState,
        toasts: toastId
          ? memoryState.toasts.filter((t) => t.id !== toastId)
          : [],
      }
      listeners.forEach((listener) => listener(memoryState))
    },
  }
}
