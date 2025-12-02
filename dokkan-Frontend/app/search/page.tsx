"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const PRODUCTS = [
  {
    id: "acc1",
    name: "Tài khoản Dokkan Reroll - Nhiều LR HOT",
    desc: "Reroll random 7-10 LR, đổi tên, chưa liên kết. Phù hợp newbie.",
    img: "https://ext.same-assets.com/1216909121/3499720186.png",
    price: 120000,
    type: "Tài khoản",
    category: "account",
    badge: "HOT",
  },
  {
    id: "farm1",
    name: "Dịch vụ Farm 450 Dragon Stones",
    desc: "Nhanh 36-48h, cam kết an toàn tuyệt đối. Bảo mật tối đa acc!",
    img: "https://ext.same-assets.com/1216909121/3295788989.png",
    price: 230000,
    type: "Farm",
    category: "farm",
    badge: "Best Seller",
  },
  {
    id: "gift1",
    name: "Gói vật phẩm: Vé Summon SSR",
    desc: "5 vé SSR có xác suất cao nhận SSR, mua nhiều giảm giá.",
    img: "https://ext.same-assets.com/1216909121/3349626925.png",
    price: 70000,
    type: "Gói vật phẩm",
    category: "items",
  },
  {
    id: "acc2",
    name: "Acc Dokkan Build sẵn (VIP)",
    desc: "Có 30+ LR, full event, đá dư. Rất phù hợp chơi lâu dài.",
    img: "https://ext.same-assets.com/1216909121/794577549.png",
    price: 900000,
    type: "Tài khoản",
    category: "account",
    badge: "HOT",
  },
  {
    id: "eventfarm1",
    name: "Thuê farm sự kiện LR/EZA",
    desc: "Cày full event, unlock nhân vật, đảm bảo uy tín bảo mật.",
    img: "https://ext.same-assets.com/1216909121/3774473831.png",
    price: 75000,
    type: "Farm",
    category: "farm",
  },
  {
    id: "acc3",
    name: "Tài khoản Fresh JP - 5 LR",
    desc: "Tài khoản Nhật mới, 5 LR đẹp, chưa farm story.",
    img: "https://ext.same-assets.com/1216909121/3499720186.png",
    price: 150000,
    type: "Tài khoản",
    category: "account",
  },
  {
    id: "farm2",
    name: "Farm Dragon Stones 1000+",
    desc: "Farm 1000+ đá rồng, thời gian 2-3 ngày.",
    img: "https://ext.same-assets.com/1216909121/3295788989.png",
    price: 400000,
    type: "Farm",
    category: "farm",
  },
]

function SearchResults() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    let matchesPrice = true
    if (priceRange !== "all") {
      const price = product.price
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

    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "newest") return b.id.localeCompare(a.id)
    if (sortBy === "popular") return (b.badge ? 1 : 0) - (a.badge ? 1 : 0)
    return (b.badge ? 1 : 0) - (a.badge ? 1 : 0) // featured
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        resultCount={sortedProducts.length}
      />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {searchTerm && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Kết quả tìm kiếm cho "{searchTerm}"</h1>
              <p className="text-gray-400">Tìm thấy {sortedProducts.length} sản phẩm</p>
            </div>
          )}

          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">Không tìm thấy sản phẩm nào phù hợp</div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 relative group"
                >
                  {product.badge && (
                    <Badge variant="destructive" className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700">
                      {product.badge}
                    </Badge>
                  )}

                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="mb-4">
                      <img
                        src={product.img || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 mx-auto rounded-full object-contain bg-gray-800 p-2"
                      />
                    </div>

                    <h5 className="text-lg font-semibold mb-3 text-orange-300 leading-tight min-h-[3rem] flex items-center justify-center">
                      {product.name}
                    </h5>

                    <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-2 leading-relaxed">{product.desc}</p>

                    <div className="mt-auto">
                      <p className="text-2xl font-bold mb-4 text-blue-400">{product.price.toLocaleString()}đ</p>

                      <Button
                        asChild
                        className="w-full bg-orange-600 hover:bg-orange-700 font-semibold py-2 transition-all duration-300 group-hover:bg-orange-500"
                      >
                        <a href={`/product/${product.id}`}>Xem chi tiết</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
