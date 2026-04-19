"use client"

import * as React from "react"
import {
  IconBoxSeam,
  IconBrandProducthunt,
  IconCamera,
  IconCertificate,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFilter,
  IconFilterCheck,
  IconFolder,
  IconGift,
  IconHelp,
  IconHierarchy2,
  IconInnerShadowTop,
  IconListDetails,
  IconMoneybag,
  IconReport,
  IconSearch,
  IconSettings,
  IconShoppingCart,
  IconTicket,
  IconUsers,
  IconPhoto,
  IconFingerprint
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useGetMeQuery } from "@/lib/store/auth/apislice"

const data = {
  navMain: [
    {
      title: "İdarə Paneli",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "İstifadəçilər",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Məhsullar",
      url: "/dashboard/products",
      icon: IconBoxSeam,
    },
    {
      title: "Kateqoriyalar",
      url: "/dashboard/categories",
      icon: IconHierarchy2,
    },
    {
      title: "Brendlər",
      url: "/dashboard/brands",
      icon: IconCertificate,
    },
    {
      title: "Bannerlər",
      url: "/dashboard/banners",
      icon: IconPhoto,
    },
    {
      title: "Sifarişlər",
      url: "/dashboard/orders",
      icon: IconShoppingCart,
    },
    {
      title: "Filterlər",
      url: "/dashboard/filters",
      icon: IconFilter,
    },
    {
      title: "Filterləri Təyin Et",
      url: "/dashboard/assign-filters",
      icon: IconFilterCheck,
    },
    {
      title: "Hissəli Ödənişlər",
      url: "/dashboard/installments",
      icon: IconMoneybag,
    },
    {
      title: "Kredit Müraciətləri",
      url: "/dashboard/credit-requests",
      icon: IconFingerprint,
    },
  ],
  navSecondary: [
    {
      title: "Parametrlər",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
  marketing: [
    {
      name: "Promokodlar",
      url: "/dashboard/promocodes",
      icon: IconTicket,
    },
    {
      name: "Loyallıq",
      url: "/dashboard/settings",
      icon: IconGift,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useGetMeQuery()

  const userData = {
    name: user ? `${user.firstName} ${user.lastName}` : "Loading...",
    email: user?.email || "...",
    avatar: "/avatars/shadcn.jpg", // Fallback or dynamic avatar if available
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">AvtoStore</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.marketing} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
