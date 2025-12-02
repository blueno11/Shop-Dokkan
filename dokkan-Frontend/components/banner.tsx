import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Banner() {
  return (
    <section className="text-center py-12 px-4 text-white">
      <div className="container mx-auto max-w-4xl">
        <Image
          src="https://i.imgur.com/ZgrCHRx.png"
          alt="dokkan banner"
          width={120}
          height={120}
          className="mx-auto rounded-full shadow-lg mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wider text-white">SHOP DOKKAN</h1>
        <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto text-gray-100">
          Chuyên bán tài khoản, dịch vụ farm, vật phẩm <span className="font-bold">Dragon Ball Dokkan</span>
          <br className="hidden sm:block" />
          Giá rẻ, uy tín, bảo hành & hỗ trợ tận tâm!
        </p>
        <Button
          asChild
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-xl font-semibold tracking-wide shadow-lg"
        >
          <a href="#sanpham">Mua ngay</a>
        </Button>
      </div>
    </section>
  )
}
