import { cn } from "@/lib/utils"

interface NotificationBadgeProps {
  count?: number
  className?: string
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (!count || count <= 0) return null

  const displayCount = count > 99 ? "99+" : count

  return (
    <span
      className={cn(
        "flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm ring-1 ring-white animate-in zoom-in duration-300",
        className
      )}
    >
      {displayCount}
    </span>
  )
}
