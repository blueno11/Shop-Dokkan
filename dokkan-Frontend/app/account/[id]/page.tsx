"use client"

import { ArrowLeft, Shield, Star, Crown, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { api } from "@/lib/api"

export default function AccountDetails() {
  const [copied, setCopied] = useState(false)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any | null>(null)
  const router = useRouter()
  const params = useParams()
  const idParam = params?.id as string
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const imgContainerRef = useRef<HTMLDivElement | null>(null)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBuy = async () => {
    setError("")
    setBuying(true)
    // Kiểm tra đăng nhập
    const data = await api('/api/auth/me')
    if (!data.loggedIn) {
      router.push("/login")
      return
    }
    // Nếu đã đăng nhập, thực hiện logic mua hàng ở đây
    alert("Mua hàng thành công! (Demo)")
    setBuying(false)
  }
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const id = parseInt(idParam as string, 10)
        if (!Number.isFinite(id)) throw new Error('ID không hợp lệ')
        const p = await api(`/api/products/${id}`)
        if (active) setProduct(p)
      } catch (e: any) {
        setError(e?.message || 'Không tải được dữ liệu')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [idParam])

  function nextImage() {
    if (!product?.meta?.images?.length) return
    setSelectedIdx((i)=> (i + 1) % product.meta.images.length)
  }
  function prevImage() {
    if (!product?.meta?.images?.length) return
    setSelectedIdx((i)=> (i - 1 + product.meta.images.length) % product.meta.images.length)
  }

  function onTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX)
    setTouchDeltaX(0)
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX == null) return
    setTouchDeltaX(e.touches[0].clientX - touchStartX)
  }
  function onTouchEnd() {
    if (touchStartX == null) return
    const threshold = 40
    if (touchDeltaX <= -threshold) nextImage()
    if (touchDeltaX >= threshold) prevImage()
    setTouchStartX(null)
    setTouchDeltaX(0)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightboxOpen) return
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, product?.meta?.images?.length])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Account Details</h1>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6 text-white">
        {loading && <div>Đang tải...</div>}
        {error && !loading && <div className="text-red-400">{error}</div>}
        {!loading && product && (
        <>
        {/* Featured Badge */}
        {product.meta?.featured && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-4 h-4" />
              <span className="font-semibold text-sm">PREMIUM FEATURED ACCOUNT</span>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <div
              ref={imgContainerRef}
              className="relative aspect-video bg-gray-700 rounded-t-lg overflow-hidden flex items-center justify-center select-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onClick={() => setLightboxOpen(true)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(product.meta?.images?.[selectedIdx]) || "/placeholder.svg"}
                alt="Account preview"
                className="w-full h-full object-contain"
                draggable={false}
                style={{ transform: touchStartX != null ? `translateX(${touchDeltaX}px)` : undefined, transition: touchStartX == null ? 'transform 150ms ease-out' : 'none' }}
              />
              <button
                type="button"
                className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8"
                onClick={(e)=>{ e.stopPropagation(); prevImage(); }}
                aria-label="Prev"
              >
                ‹
              </button>
              <button
                type="button"
                className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8"
                onClick={(e)=>{ e.stopPropagation(); nextImage(); }}
                aria-label="Next"
              >
                ›
              </button>
            </div>
            <div className="flex space-x-2 p-4">
              {(product.meta?.images || []).map((img: string, index: number) => (
                <button key={index} type="button" onClick={()=>setSelectedIdx(index)} className={`w-16 h-16 bg-gray-700 rounded overflow-hidden border ${selectedIdx===index? 'border-orange-500' : 'border-gray-600'}`}>
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col"
            onClick={()=> setLightboxOpen(false)}
          >
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(product.meta?.images?.[selectedIdx]) || "/placeholder.svg"}
                alt="Zoom preview"
                className={`max-w-none ${zoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'} transition-transform duration-200`}
                style={{ width: zoomed ? 'auto' : '100%', height: zoomed ? 'auto' : '100%', objectFit: zoomed ? 'contain' : 'contain' }}
                onClick={(e)=>{ e.stopPropagation(); setZoomed(z=>!z) }}
                draggable={false}
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10"
                onClick={(e)=>{ e.stopPropagation(); prevImage(); }}
                aria-label="Prev"
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10"
                onClick={(e)=>{ e.stopPropagation(); nextImage(); }}
                aria-label="Next"
              >
                ›
              </button>
              <button
                type="button"
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded px-3 py-1"
                onClick={(e)=>{ e.stopPropagation(); setLightboxOpen(false); setZoomed(false) }}
                aria-label="Close"
              >
                Đóng
              </button>
            </div>
            <div className="p-3 bg-black/60">
              <div className="container mx-auto">
                <div className="flex gap-2 overflow-x-auto">
                  {(product.meta?.images || []).map((img: string, index: number) => (
                    <button key={index} type="button" onClick={(e)=>{ e.stopPropagation(); setSelectedIdx(index); }} className={`min-w-16 w-16 h-16 bg-gray-800 rounded overflow-hidden border ${selectedIdx===index? 'border-orange-500' : 'border-gray-700'}`}>
                      <img src={img || '/placeholder.svg'} alt={`thumb-${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Title and Price */}
        <div>
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-600">{Number(product.sale_price ?? product.price).toLocaleString()}đ</span>
            <div className="flex space-x-2">
              {product.meta?.rank != null && (
                <Badge variant="secondary">Rank {product.meta.rank}</Badge>
              )}
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {(product.meta?.lrs ?? 0)} LRs
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{product.meta?.stones ?? 0}</div>
              <div className="text-sm text-gray-300">Dragon Stones</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{product.meta?.rank ?? '-'}</div>
              <div className="text-sm text-gray-300">Player Rank</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{product.meta?.lrs ?? 0}</div>
              <div className="text-sm text-gray-300">LR Units</div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="font-semibold tracking-tight text-lg text-white">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{product.description || ''}</p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">What's Included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(product.meta?.features || []).map((feature: string, index: number) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* LR List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">LR Units ({product.meta?.lrs ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {(product.meta?.lrList || []).map((lr: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-900/30 rounded border border-yellow-700/50">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">{lr}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Notice */}
        <Alert className="bg-blue-900/30 border-blue-700/50">
          <Shield className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-gray-300">
            This account comes with our safety guarantee. Transfer code will be provided immediately after purchase.
          </AlertDescription>
        </Alert>
        </>
        )}
        </div>
      </main>

      {/* Purchase Button */}
      <div className="sticky bottom-0 bg-gray-900 border-t border-orange-500 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300">Total Price</div>
              <div className="text-xl font-bold text-orange-400">{Number(product?.sale_price ?? product?.price ?? 0).toLocaleString()}đ</div>
            </div>
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 px-8" 
              onClick={handleBuy} 
              disabled={buying}
            >
              {buying ? "Processing..." : "Buy Now"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
