"use client"

import type React from "react"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const { totalQuantity } = useCart()

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    fetch(`${base}/api/auth/me`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) setUser(data.user)
        else setUser(null)
      })
  }, [])

  const handleLogout = async () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    await fetch(`${base}/api/auth/logout`, { method: "POST", credentials: "include" })
    setUser(null)
    window.location.href = "/"
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b-2 border-orange-500 shadow-lg min-h-[72px]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3">
            <Image src="https://i.imgur.com/ZgrCHRx.png" alt="logo dokkan" width={36} height={36} className="rounded" />
            <span className="text-white font-bold text-xl tracking-wider hidden sm:block">DOKKAN SHOP</span>
            <span className="text-white font-bold text-lg tracking-wider sm:hidden">DOKKAN</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none w-64"
                />
              </div>
            </form>
            <a href="/" className="text-white font-medium hover:text-orange-400 transition-colors">
              Trang chủ
            </a>
            <a href="/accounts" className="text-white hover:text-orange-400 transition-colors">
              Tài khoản Dokkan
            </a>
            <a href="/farm" className="text-white hover:text-orange-400 transition-colors">
              Dịch vụ Farm
            </a>
            <a href="/cart" className="text-white hover:text-orange-400 transition-colors">
              Giỏ Hàng ({totalQuantity})
            </a>
            {user ? (
              <>
                <span className="text-white mr-2">Xin chào, <b>{user.fullName}</b></span>
                <Button className="bg-orange-600 hover:bg-orange-700 px-6 font-semibold" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Button asChild className="bg-orange-600 hover:bg-orange-700 px-6 font-semibold">
                <a href="/login">Đăng nhập</a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-gray-900 border-l border-orange-500">
              <div className="flex flex-col space-y-6 mt-8">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none w-full"
                    />
                  </div>
                </form>
                <a
                  href="/"
                  className="text-white font-medium text-lg hover:text-orange-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Trang chủ
                </a>
                <a
                  href="/accounts"
                  className="text-white text-lg hover:text-orange-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Tài khoản Dokkan
                </a>
                <a
                  href="/farm"
                  className="text-white text-lg hover:text-orange-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dịch vụ Farm
                </a>
                <a
                  href="/cart"
                  className="text-white text-lg hover:text-orange-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Giỏ hàng ({totalQuantity})
                </a>
                {user ? (
                  <>
                    <span className="text-white mb-2">Xin chào, <b>{user.fullName}</b></span>
                    <Button className="bg-orange-600 hover:bg-orange-700 w-full font-semibold text-lg py-3" onClick={handleLogout}>
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <Button asChild className="bg-orange-600 hover:bg-orange-700 w-full font-semibold text-lg py-3">
                    <a href="/login" onClick={() => setIsOpen(false)}>
                      Đăng nhập
                    </a>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
