import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import StoreProvider from "@/lib/providers/store-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
            <ThemeProvider  
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>  {/* ← pages go here */}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      
    </StoreProvider>
  )
}
