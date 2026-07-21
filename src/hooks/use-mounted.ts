"use client"

import { useEffect, useState } from "react"

/**
 * Returns true only after the component has mounted on the client.
 * Useful to avoid hydration mismatches when reading from persisted
 * (LocalStorage-backed) Zustand stores.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
