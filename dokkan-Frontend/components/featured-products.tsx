import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const PRODUCTS = [
  {
    id: "acc1",
    name: "Tài khoản Dokkan Reroll - Nhiều LR HOT",
    desc: "Reroll random 7-10 LR, đổi tên, chưa liên kết. Phù hợp newbie.",
    img: "https://ext.same-assets.com/1216909121/3499720186.png",
    price: 120000,
    type: "Tài khoản",
    badge: "HOT",
  },
  {
    id: "farm1",
    name: "Dịch vụ Farm 450 Dragon Stones",
    desc: "Nhanh 36-48h, cam kết an toàn tuyệt đối. Bảo mật tối đa acc!",
    img: "https://ext.same-assets.com/1216909121/3295788989.png",
    price: 230000,
    type: "Farm",
    badge: "Best Seller",
  },
  {
    id: "gift1",
    name: "Gói vật phẩm: Vé Summon SSR",
    desc: "5 vé SSR có xác suất cao nhận SSR, mua nhiều giảm giá.",
    img: "https://ext.same-assets.com/1216909121/3349626925.png",
    price: 70000,
    type: "Gói vật phẩm",
  },
  {
    id: "acc2",
    name: "Acc Dokkan Build sẵn (VIP)",
    desc: "Có 30+ LR, full event, đá dư. Rất phù hợp chơi lâu dài.",
    img: "https://ext.same-assets.com/1216909121/794577549.png",
    price: 900000,
    type: "Tài khoản",
    badge: "HOT",
  },
  {
    id: "eventfarm1",
    name: "Thuê farm sự kiện LR/EZA",
    desc: "Cày full event, unlock nhân vật, đảm bảo uy tín bảo mật.",
    img: "https://ext.same-assets.com/1216909121/3774473831.png",
    price: 75000,
    type: "Farm",
  },
]

export default function FeaturedProducts() {
  return (
    <section id="sanpham" className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-yellow-400">Sản phẩm & dịch vụ nổi bật</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
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
      </div>
    </section>
  )
}
