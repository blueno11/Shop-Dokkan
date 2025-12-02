import { Card, CardContent } from "@/components/ui/card"

export default function CTA() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <p className="text-lg md:text-xl leading-relaxed text-gray-100">
                <span className="font-bold text-orange-400">Shop Dokkan</span> cam kết: Giá rẻ - Chất lượng - Uy tín lâu
                năm! Hỗ trợ 24/7, bảo hành tới lúc nhận acc/vật phẩm.
              </p>

              <p className="text-base md:text-lg text-gray-300">
                Feedback thật 100% từ khách hàng, giao dịch nhanh, bảo mật tuyệt đối.
              </p>

              <div className="inline-block bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg md:text-xl shadow-lg hover:bg-orange-700 transition-colors cursor-pointer">
                <a href="tel:0333847948" className="text-white no-underline">
                  ZALO ĐẶT NGAY: 033.847.948
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
