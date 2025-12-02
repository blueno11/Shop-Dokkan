import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

export default function TopServices() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-orange-600">
          Top dịch vụ được đặt nhiều nhất
        </h3>

        {/* Mobile Card Layout - Table Style */}
        <div className="block md:hidden">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
              <h4 className="text-yellow-400 font-semibold text-center">Top dịch vụ được đặt nhiều nhất</h4>
            </div>
            <div className="divide-y divide-gray-700">
              {PRODUCTS.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white text-sm leading-tight flex-1 pr-2">{product.name}</h5>
                    {product.badge && (
                      <Badge variant="destructive" className="text-xs">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-orange-400 text-sm">{product.type}</span>
                    <span className="text-green-400 font-bold text-lg">{product.price.toLocaleString()}đ</span>
                  </div>
                  <Button asChild size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                    <a href={`/product/${product.id}`}>Mua</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800">
                <th className="text-left p-4 text-yellow-400 font-semibold">Tên dịch vụ/sản phẩm</th>
                <th className="text-left p-4 text-yellow-400 font-semibold">Loại</th>
                <th className="text-left p-4 text-yellow-400 font-semibold">Giá</th>
                <th className="text-center p-4 text-yellow-400 font-semibold">Mua</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-t border-gray-700 hover:bg-gray-800 transition-colors ${
                    index % 2 === 0 ? "bg-gray-900" : "bg-gray-850"
                  }`}
                >
                  <td className="p-4 text-white">{product.name}</td>
                  <td className="p-4 text-orange-400">{product.type}</td>
                  <td className="p-4 text-green-400 font-semibold">{product.price.toLocaleString()}đ</td>
                  <td className="p-4 text-center">
                    <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 px-6">
                      <a href={`/product/${product.id}`}>Mua</a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
