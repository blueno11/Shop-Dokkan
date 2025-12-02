"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface SearchSectionProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  priceRange: string
  setPriceRange: (range: string) => void
  resultCount?: number
}

export default function SearchSection({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  resultCount = 0,
}: SearchSectionProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSortBy("featured")
    setPriceRange("all")
  }

  const activeFiltersCount = [
    selectedCategory !== "all",
    sortBy !== "featured",
    priceRange !== "all",
    searchTerm.length > 0,
  ].filter(Boolean).length

  return (
    <section className="py-6 px-4 bg-gray-800/50">
      <div className="container mx-auto max-w-6xl">
        {/* Mobile Search */}
        <div className="block md:hidden space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm kiếm sản phẩm, dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border-gray-600 text-black placeholder-gray-500 focus:border-orange-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">{resultCount} kết quả</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-orange-600 text-white">
                  {activeFiltersCount} bộ lọc
                </Badge>
              )}
            </div>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-gray-900 border-gray-700 h-[80vh]">
                <SheetHeader>
                  <SheetTitle className="text-white">Bộ lọc tìm kiếm</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <label className="text-white font-medium mb-3 block">Danh mục</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        <SelectItem value="account">Tài khoản</SelectItem>
                        <SelectItem value="farm">Dịch vụ Farm</SelectItem>
                        <SelectItem value="items">Vật phẩm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-3 block">Khoảng giá</label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Chọn khoảng giá" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all">Tất cả giá</SelectItem>
                        <SelectItem value="under-100k">Dưới 100k</SelectItem>
                        <SelectItem value="100k-500k">100k - 500k</SelectItem>
                        <SelectItem value="500k-1m">500k - 1M</SelectItem>
                        <SelectItem value="over-1m">Trên 1M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-3 block">Sắp xếp theo</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Sắp xếp" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="featured">Nổi bật</SelectItem>
                        <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                        <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="popular">Phổ biến nhất</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      Xóa bộ lọc
                    </Button>
                    <Button onClick={() => setIsFilterOpen(false)} className="flex-1 bg-orange-600 hover:bg-orange-700">
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm sản phẩm, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white border-gray-600 text-black placeholder-gray-500 focus:border-orange-500"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="account">Tài khoản</SelectItem>
                <SelectItem value="farm">Dịch vụ Farm</SelectItem>
                <SelectItem value="items">Vật phẩm</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Khoảng giá" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">Tất cả giá</SelectItem>
                <SelectItem value="under-100k">Dưới 100k</SelectItem>
                <SelectItem value="100k-500k">100k - 500k</SelectItem>
                <SelectItem value="500k-1m">500k - 1M</SelectItem>
                <SelectItem value="over-1m">Trên 1M</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="featured">Nổi bật</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Hiển thị {resultCount} kết quả</span>
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-orange-400 hover:text-orange-300"
              >
                Xóa tất cả bộ lọc ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
