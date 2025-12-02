"use client"

import React, { useEffect, useState } from "react"
import { apiAdmin } from "@/lib/api"

type Summary = {
  revenueToday: number
  ordersToday: number
  totalUsers: number
  lowStock: number
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await apiAdmin('/api/admin/summary')
        if (active) setSummary(data)
      } catch (e: any) {
        if (active) setError(e?.message || 'Không tải được dữ liệu')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  if (loading) return <div>Đang tải dashboard...</div>
  if (error) return <div className="text-red-400">{error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded p-4">
        <div className="text-gray-400 text-sm">Doanh thu hôm nay</div>
        <div className="text-2xl font-bold">{summary?.revenueToday?.toLocaleString()}đ</div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded p-4">
        <div className="text-gray-400 text-sm">Đơn hàng hôm nay</div>
        <div className="text-2xl font-bold">{summary?.ordersToday}</div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded p-4">
        <div className="text-gray-400 text-sm">Tổng người dùng</div>
        <div className="text-2xl font-bold">{summary?.totalUsers}</div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded p-4">
        <div className="text-gray-400 text-sm">Sản phẩm sắp hết hàng</div>
        <div className="text-2xl font-bold">{summary?.lowStock}</div>
      </div>
    </div>
  )
}


