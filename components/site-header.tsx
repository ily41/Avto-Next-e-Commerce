import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="hidden md:flex font-bold uppercase tracking-tighter text-xs">
            <a href="/">Vebsayta qayıt</a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
