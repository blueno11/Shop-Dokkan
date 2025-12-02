"use client"

import React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const me = await api('/api/auth/me', { credentials: 'include' })
        if (!me?.loggedIn || me.user?.role !== 'admin') {
          router.replace('/login')
          return
        }
      } catch (e: any) {
        setError(e?.message || 'Không thể xác thực')
        router.replace('/login')
        return
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">Đang tải...</div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <aside className="fixed left-0 top-0 h-full w-56 bg-gray-900 border-r border-gray-800 p-4 space-y-3">
        <div className="text-lg font-bold mb-4">Admin</div>
        <nav className="space-y-2">
          <Link href="/admin" className="block hover:text-orange-400">Dashboard</Link>
          <Link href="/admin/products" className="block hover:text-orange-400">Sản phẩm</Link>
          <Link href="/admin/orders" className="block hover:text-orange-400">Đơn hàng</Link>
          <Link href="/admin/users" className="block hover:text-orange-400">Người dùng</Link>
          <Link href="/admin/coupons" className="block hover:text-orange-400">Mã giảm giá</Link>
          <Link href="/admin/banners" className="block hover:text-orange-400">Banner</Link>
          <Link href="/admin/settings" className="block hover:text-orange-400">Cài đặt</Link>
        </nav>
      </aside>
      <main className="ml-56 min-h-screen">
        <header className="h-14 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-900">
          <div className="font-semibold">Dokkan Admin</div>
          <Link href="/" className="text-sm text-gray-300 hover:text-white">Về trang chủ</Link>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}


