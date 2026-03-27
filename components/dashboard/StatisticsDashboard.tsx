"use client"

import * as React from "react"
import { useGetDashboardStatisticsQuery } from "@/lib/store/statistics/apislice"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconPackage, 
  IconUsers, 
  IconShoppingCart, 
  IconCurrencyDollar,
  IconLoader2
} from "@tabler/icons-react"
import { ChartConfig } from "@/components/ui/chart"

export function StatisticsDashboard() {
  const { data: stats, isLoading, error } = useGetDashboardStatisticsQuery()

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center text-destructive">
        Error loading statistics. Please try again later.
      </div>
    )
  }

  if (!stats) return null

  const trendConfig = {
    amount: {
      label: "Revenue",
      color: "var(--primary)",
    },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <IconCurrencyDollar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.total.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {stats.growth.revenuePercentage >= 0 ? (
                <span className="flex items-center text-green-500 font-medium">
                  <IconTrendingUp className="w-3 h-3 mr-1" />
                  +{stats.growth.revenuePercentage}%
                </span>
              ) : (
                <span className="flex items-center text-red-500 font-medium">
                  <IconTrendingDown className="w-3 h-3 mr-1" />
                  {stats.growth.revenuePercentage}%
                </span>
              )}
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <IconShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {stats.growth.ordersPercentage >= 0 ? (
                <span className="flex items-center text-green-500 font-medium">
                  <IconTrendingUp className="w-3 h-3 mr-1" />
                  +{stats.growth.ordersPercentage}%
                </span>
              ) : (
                <span className="flex items-center text-red-500 font-medium">
                  <IconTrendingDown className="w-3 h-3 mr-1" />
                  {stats.growth.ordersPercentage}%
                </span>
              )}
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            <IconUsers className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.active.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {stats.growth.customersPercentage >= 0 ? (
                <span className="flex items-center text-green-500 font-medium">
                  <IconTrendingUp className="w-3 h-3 mr-1" />
                  +{stats.growth.customersPercentage}%
                </span>
              ) : (
                <span className="flex items-center text-red-500 font-medium">
                  <IconTrendingDown className="w-3 h-3 mr-1" />
                  {stats.growth.customersPercentage}%
                </span>
              )}
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            <IconPackage className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.lowStock}</div>
            <p className="pt-1 text-xs text-muted-foreground capitalize">
              {stats.products.total} total products in catalog
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Listings Grid */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 lg:grid-cols-7">
        {/* Trends Chart */}
        <div className="lg:col-span-4 h-full">
           <ChartAreaInteractive 
             data={stats.trends} 
             title="Revenue Growth" 
             dataKey="amount" 
             showMobile={false}
             config={trendConfig}
           />
        </div>

        {/* Top Products */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performers by unit volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.products.topSellingProducts.length > 0 ? (
                stats.products.topSellingProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between group">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Item ID: {p.id.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold">{p.soldCount}</span>
                       <Badge variant="outline" className="text-[10px] px-1 h-5">Sold</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground italic text-sm">
                  No products sold yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Order Status */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
             <CardTitle>Order Fulfillment</CardTitle>
             <CardDescription>Real-time status of your orders pipeline</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                   <span className="text-xs text-orange-600 font-semibold uppercase tracking-wider">Pending</span>
                   <span className="text-xl font-bold">{stats.orders.pending}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                   <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Confirmed</span>
                   <span className="text-xl font-bold">{stats.orders.confirmed}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                   <span className="text-xs text-green-600 font-semibold uppercase tracking-wider">Delivered</span>
                   <span className="text-xl font-bold">{stats.orders.delivered}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-zinc-500/5 border border-zinc-500/10">
                   <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Average Value</span>
                   <span className="text-xl font-bold">${stats.revenue.averageOrderValue.toFixed(2)}</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
