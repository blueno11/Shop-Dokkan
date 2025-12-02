"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Clock, Shield, Star, CheckCircle, AlertCircle, Gem } from "lucide-react"

const FARM_SERVICES = [
  {
    id: "farm1",
    name: "Farm 450 Dragon Stones",
    desc: "Farm story mode và event để có 450 Dragon Stones. Thời gian 36-48h.",
    img: "https://ext.same-assets.com/1216909121/3295788989.png",
    price: 230000,
    type: "Dragon Stones",
    category: "stones",
    badge: "Best Seller",
    duration: "36-48h",
    guarantee: "100% an toàn",
    featured: true,
    difficulty: "Dễ",
    requirements: "Rank 50+",
  },
  {
    id: "farm2",
    name: "Farm 1000+ Dragon Stones",
    desc: "Farm toàn bộ story mode và event hiện tại để có 1000+ stones.",
    img: "https://ext.same-assets.com/1216909121/3295788989.png",
    price: 450000,
    type: "Dragon Stones",
    category: "stones",
    badge: "HOT",
    duration: "3-5 ngày",
    guarantee: "Bảo hành 7 ngày",
    featured: true,
    difficulty: "Trung bình",
    requirements: "Fresh account",
  },
  {
    id: "farm3",
    name: "Farm LR Event Character",
    desc: "Farm full SA và unlock potential cho 1 LR event character.",
    img: "https://ext.same-assets.com/1216909121/3774473831.png",
    price: 150000,
    type: "LR Event",
    category: "characters",
    duration: "24-36h",
    guarantee: "100% hoàn thành",
    featured: false,
    difficulty: "Dễ",
    requirements: "Có team mạnh",
  },
  {
    id: "farm4",
    name: "EZA Full Level 140",
    desc: "Hoàn thành EZA cho 1 character lên level 140 với full skill.",
    img: "https://ext.same-assets.com/1216909121/3349626925.png",
    price: 120000,
    type: "EZA Service",
    category: "eza",
    duration: "12-24h",
    guarantee: "Hoàn thành 100%",
    featured: false,
    difficulty: "Trung bình",
    requirements: "Có character cần EZA",
  },
  {
    id: "farm5",
    name: "World Tournament Grind",
    desc: "Grind World Tournament để đạt rank cao và nhận full reward.",
    img: "https://ext.same-assets.com/1216909121/794577549.png",
    price: 300000,
    type: "WT Grind",
    category: "events",
    badge: "LIMITED",
    duration: "3 ngày",
    guarantee: "Top 10% rank",
    featured: true,
    difficulty: "Khó",
    requirements: "WT đang diễn ra",
  },
  {
    id: "farm6",
    name: "Battlefield Clear All Stages",
    desc: "Clear toàn bộ Virtual Dokkan Battlefield và nhận full reward.",
    img: "https://ext.same-assets.com/1216909121/3774473831.png",
    price: 180000,
    type: "Battlefield",
    category: "events",
    duration: "24h",
    guarantee: "Clear 100%",
    featured: false,
    difficulty: "Khó",
    requirements: "Box đa dạng",
  },
  {
    id: "farm7",
    name: "Chain Battle Support",
    desc: "Setup và chạy Chain Battle để đạt điểm số cao nhất có thể.",
    img: "https://ext.same-assets.com/1216909121/3349626925.png",
    price: 100000,
    type: "Chain Battle",
    category: "events",
    duration: "2-4h",
    guarantee: "Điểm tối đa",
    featured: false,
    difficulty: "Dễ",
    requirements: "Event đang mở",
  },
  {
    id: "farm8",
    name: "Red Zone All Stages",
    desc: "Clear toàn bộ Red Zone stages với team tối ưu nhất.",
    img: "https://ext.same-assets.com/1216909121/794577549.png",
    price: 400000,
    type: "Red Zone",
    category: "endgame",
    badge: "EXTREME",
    duration: "2-3 ngày",
    guarantee: "Clear hoặc hoàn tiền",
    featured: true,
    difficulty: "Cực khó",
    requirements: "Box LR mạnh",
  },
]

export default function FarmPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")

  const filteredServices = FARM_SERVICES.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory

    let matchesPrice = true
    if (priceRange !== "all") {
      const price = service.price
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

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "duration") return a.duration.localeCompare(b.duration)
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Dễ":
        return "text-green-400"
      case "Trung bình":
        return "text-yellow-400"
      case "Khó":
        return "text-orange-400"
      case "Cực khó":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="py-12 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Dịch vụ Farm Dokkan</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Để chúng tôi farm giúp bạn! Từ Dragon Stones đến các event khó nhất. An toàn, nhanh chóng, uy tín.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">50+</div>
              <div className="text-sm text-gray-400">Dịch vụ</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">99%</div>
              <div className="text-sm text-gray-400">Thành công</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">24h</div>
              <div className="text-sm text-gray-400">Hỗ trợ</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400">1000+</div>
              <div className="text-sm text-gray-400">Khách hàng</div>
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
        resultCount={sortedServices.length}
      />

      {/* Services Grid */}
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {sortedServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">Không tìm thấy dịch vụ nào phù hợp</div>
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
              {sortedServices.map((service) => (
                <Card
                  key={service.id}
                  className="bg-gray-900 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 relative group"
                >
                  {service.badge && (
                    <Badge
                      variant="destructive"
                      className={`absolute top-3 right-3 z-10 ${
                        service.badge === "EXTREME"
                          ? "bg-red-600 hover:bg-red-700"
                          : service.badge === "LIMITED"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-orange-600 hover:bg-orange-700"
                      }`}
                    >
                      {service.badge}
                    </Badge>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={service.img || "/placeholder.svg"}
                        alt={service.name}
                        className="w-16 h-16 rounded-full object-contain bg-gray-800 p-2"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg text-blue-300 leading-tight">{service.name}</CardTitle>
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300 mt-1">
                          {service.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.desc}</p>

                    {/* Service Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">Thời gian:</span>
                        </div>
                        <span className="text-sm font-medium text-blue-400">{service.duration}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">Độ khó:</span>
                        </div>
                        <span className={`text-sm font-medium ${getDifficultyColor(service.difficulty)}`}>
                          {service.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">Bảo hành:</span>
                        </div>
                        <span className="text-sm font-medium text-green-400">{service.guarantee}</span>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-orange-400" />
                          <span className="text-sm font-medium text-gray-300">Yêu cầu:</span>
                        </div>
                        <span className="text-sm text-gray-400">{service.requirements}</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-blue-400">{service.price.toLocaleString()}đ</div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-400">4.9</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                        <a href={`/farm/${service.id}`}>Đặt dịch vụ</a>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                      >
                        <Gem className="w-4 h-4 mr-2" />
                        Tư vấn miễn phí
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Process Section */}
      <section className="py-12 px-4 bg-gray-800/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Quy trình farm của chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Đặt dịch vụ</h3>
              <p className="text-gray-400 text-sm">Chọn dịch vụ và cung cấp thông tin tài khoản</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Thanh toán</h3>
              <p className="text-gray-400 text-sm">Thanh toán an toàn qua các phương thức hỗ trợ</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Thực hiện</h3>
              <p className="text-gray-400 text-sm">Team chuyên nghiệp farm theo yêu cầu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Hoàn thành</h3>
              <p className="text-gray-400 text-sm">Giao tài khoản và hỗ trợ sau bán hàng</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
