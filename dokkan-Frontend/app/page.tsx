"use client"

import Header from "@/components/header"
import Banner from "@/components/banner"
import TopServices from "@/components/top-services"
import FeaturedProducts from "@/components/featured-products"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

const accounts = [
  {
    id: 1,
    title: "LR Gogeta + LR Vegito Account",
    price: "$45.99",
    rank: 487,
    stones: 1250,
    lrs: 8,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
    category: "Premium",
  },
  {
    id: 2,
    title: "Fresh Reroll - 3 LRs",
    price: "$12.99",
    rank: 1,
    stones: 50,
    lrs: 3,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    category: "Fresh",
  },
  {
    id: 3,
    title: "Endgame Account - 15 LRs",
    price: "$89.99",
    rank: 650,
    stones: 2100,
    lrs: 15,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
    category: "Endgame",
  },
  {
    id: 4,
    title: "Mid-Game Account - 6 LRs",
    price: "$28.99",
    rank: 320,
    stones: 800,
    lrs: 6,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    category: "Mid-Game",
  },
  {
    id: 5,
    title: "JP Fresh Start - 4 LRs",
    price: "$18.99",
    rank: 5,
    stones: 120,
    lrs: 4,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    category: "Fresh",
  },
  {
    id: 6,
    title: "Global Beast Account",
    price: "$65.99",
    rank: 520,
    stones: 1800,
    lrs: 12,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
    category: "Premium",
  },
]

export default function DokkanMarketplace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <main>
        <Banner />
        <TopServices />
        <FeaturedProducts />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
