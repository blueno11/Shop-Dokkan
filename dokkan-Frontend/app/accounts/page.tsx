"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Crown, Users } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

import { useEffect } from "react"
import { api } from "@/lib/api"

type ProductCard = {
  id: number
  name: string
  price: number
  meta?: any
}


export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [serverFilter, setServerFilter] = useState("all")
  const [items, setItems] = useState<ProductCard[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await api('/api/products')
        if (active) setItems(res.items || [])
      } catch {}
    })()
    return () => { active = false }
  }, [])

  const mapToAccount = (p: ProductCard) => {
    const price = Number(p.price)
    
    // Parse meta nếu là string JSON
    let meta = p.meta || {}
    if (typeof meta === 'string') {
      try {
        meta = JSON.parse(meta)
      } catch (e) {
        console.error('Failed to parse meta:', e)
        meta = {}
      }
    }
    
    return {
      id: String(p.id),
      name: p.name,
      desc: meta.description || '',
      img: (meta.images && meta.images[0]) || '/placeholder.svg',
      price,
      type: meta.type || 'Account',
      category: meta.category || 'account',
      badge: meta.badge || undefined,
      rank: Number(meta.rank) || 0,
      stones: Number(meta.stones) || 0,
      lrs: Number(meta.lrs) || 0,
      featured: Boolean(meta.featured),
      server: meta.server || 'Global',
      screenshots: (meta.images || []).length || 0,
    }
  }

  const sourceAccounts = items.map(mapToAccount)

  function normalizeCategory(input: string): string {
    const raw = (input || '').toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
    if (!raw) return 'account'
    // Common synonyms mapping
    if (/(tai khoan|tai-khoan|account|acc)/.test(raw)) return 'account'
    if (/(farm|dich vu|dich vu farm|service)/.test(raw)) return 'farm'
    if (/(item|vat pham|vat-pham|items|goods)/.test(raw)) return 'items'
    return raw.replace(/\s+/g, '-')
  }

  const filteredAccounts = sourceAccounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || normalizeCategory(account.category) === selectedCategory
    const matchesServer = serverFilter === "all" || account.server.toLowerCase() === serverFilter

    let matchesPrice = true
    if (priceRange !== "all") {
      const price = account.price
      switch (priceRange) {
        case "under-100k":
          matchesPrice = price < 100000
          break
        case "100k-500k":
          matchesPrice = price >= 100000 && price <= 500000
          break
        case "500k-1m":
          matchesPrice = price >= 500000 && price <= 1000000
          break
        case "over-1m":
          matchesPrice = price > 1000000
          break
      }
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesServer
  })

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "lrs") return b.lrs - a.lrs
    if (sortBy === "rank") return b.rank - a.rank
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="py-12 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Tài khoản Dokkan Battle</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Chọn từ hàng trăm tài khoản Dokkan Battle chất lượng cao. Từ fresh reroll đến endgame whale account.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400">100+</div>
              <div className="text-sm text-gray-400">Tài khoản</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">24/7</div>
              <div className="text-sm text-gray-400">Hỗ trợ</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">100%</div>
              <div className="text-sm text-gray-400">An toàn</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">5★</div>
              <div className="text-sm text-gray-400">Đánh giá</div>
            </div>
          </div>
        </div>
      </section>

      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        resultCount={sortedAccounts.length}
      />

      {/* Accounts Grid */}
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {sortedAccounts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">Không tìm thấy tài khoản nào phù hợp</div>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setPriceRange("all")
                  setSortBy("featured")
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAccounts.map((account) => (
                <Card
                  key={account.id}
                  className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 relative group overflow-hidden"
                >
                  {account.badge && (
                    <Badge
                      variant="destructive"
                      className={`absolute top-3 right-3 z-10 ${
                        account.badge === "VIP"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : account.badge === "PREMIUM"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : account.badge === "NEW"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {account.badge}
                    </Badge>
                  )}

                  <CardContent className="p-0">
                    {/* Image Section */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <img
                        src={account.img || "/placeholder.svg"}
                        alt={account.name}
                        className="w-24 h-24 rounded-full object-contain"
                      />
                      <div className="absolute bottom-2 left-2 flex space-x-1">
                        <Badge variant="outline" className="bg-gray-900/80 text-white border-gray-600 text-xs">
                          {account.server}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-900/80 text-white border-gray-600 text-xs">
                          {account.screenshots} ảnh
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-orange-300 mb-2 leading-tight">{account.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{account.desc}</p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{account.rank}</div>
                          <div className="text-xs text-gray-500">Rank</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{account.stones}</div>
                          <div className="text-xs text-gray-500">Stones</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">{account.lrs}</div>
                          <div className="text-xs text-gray-500">LRs</div>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-orange-400">{account.price.toLocaleString()}đ</div>
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                          {account.type}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 font-semibold">
                          <a href={`/account/${account.id}`}>Xem chi tiết</a>
                        </Button>
                        <Button
                          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200"
                          onClick={() => addItem({ productId: account.id, name: account.name, price: account.price, image: account.img, quantity: 1 })}
                        >
                          Thêm vào giỏ
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Liên hệ mua
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Trust Section */}
      <section className="py-12 px-4 bg-gray-800/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Tại sao chọn tài khoản của chúng tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">100% An toàn</h3>
              <p className="text-gray-400 text-sm">
                Tất cả tài khoản đều được kiểm tra kỹ lưỡng, đảm bảo không bị ban hay có vấn đề gì.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-400 text-sm">
                Nhận transfer code ngay sau khi thanh toán, hỗ trợ 24/7 nếu có vấn đề.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Chất lượng cao</h3>
              <p className="text-gray-400 text-sm">
                Chỉ bán những tài khoản chất lượng cao với LR meta và team build tốt nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
