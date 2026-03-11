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
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: IconBoxSeam,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: IconHierarchy2,
    },
    {
      title: "Brands",
      url: "/dashboard/brands",
      icon: IconCertificate,
    },
    {
      title: "Banners",
      url: "/dashboard/banners",
      icon: IconPhoto,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: IconShoppingCart,
    },
    {
      title: "Filters",
      url: "/dashboard/filters",
      icon: IconFilter,
    },
    {
      title: "Assign Filters",
      url: "/dashboard/assign-filters",
      icon: IconFilterCheck,
    },
    {
      title: "Installment Payments",
      url: "/dashboard/installment-payments",
      icon: IconMoneybag,
    },


  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  marketing: [
    {
      name: "Promocodes",
      url: "/dashboard/promocodes",
      icon: IconTicket,
    },
    {
      name: "Loyalty",
      url: "/dashboard/loyalty",
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
              <a href="#">
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
