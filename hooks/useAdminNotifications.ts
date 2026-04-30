import { useState, useEffect, useCallback } from "react"
import Cookies from "js-cookie"

export interface NotificationCounts {
  newOrdersCount: number
  newCreditRequestsCount: number
  totalUnseenCount: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://avtoo027-001-site1.ntempurl.com"

export function useAdminNotifications() {
  const [counts, setCounts] = useState<NotificationCounts>({
    newOrdersCount: 0,
    newCreditRequestsCount: 0,
    totalUnseenCount: 0,
  })

  const getHeaders = useCallback(() => {
    const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null)
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }, [])

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/Notifications/counts`, {
        headers: getHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        setCounts(data)
      } else {
         console.warn(`Notification API returned status: ${res.status}`)
      }
    } catch (err) {
      console.warn("Failed to fetch notification counts:", err)
    }
  }, [getHeaders])

  const markSeen = async (type: "orders" | "creditRequests" | "all") => {
    // Optimistic UI update could go here, but the user specifically asked 
    // to update state from the response of mark-seen.
    try {
      const res = await fetch(`${API_BASE}/api/v1/Notifications/mark-seen`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ type }),
      })
      if (res.ok) {
        const data = await res.json()
        setCounts(data)
      }
    } catch (err) {
      console.warn(`Failed to mark ${type} as seen:`, err)
    }
  }

  useEffect(() => {
    fetchCounts()
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [fetchCounts])

  return { counts, markSeen }
}
