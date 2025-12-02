import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 border-t-2 border-orange-500 py-8">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <Image src="https://i.imgur.com/ZgrCHRx.png" width={28} height={28} alt="logo dokkan mini" className="mr-3" />
          <span className="font-bold text-orange-300 text-xl tracking-wider">DOKKAN SHOP</span>
        </div>

        <p className="text-gray-300 mb-4 leading-relaxed">Bán tài khoản, dịch vụ, vật phẩm game Dokkan uy tín.</p>

        <div className="space-y-2 mb-6">
          <p className="text-gray-300">
            Liên hệ{" "}
            <a href="tel:0333847948" className="text-orange-400 hover:text-orange-300 transition-colors font-semibold">
              ZALO 033.847.948
            </a>
          </p>
          <p className="text-gray-300">
            Fanpage:{" "}
            <a
              href="https://fb.com/shopdokkan"
              className="text-orange-400 hover:text-orange-300 transition-colors font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              fb.com/shopdokkan
            </a>
          </p>
        </div>

        <div className="text-gray-500 text-sm border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} Dokkan Shop. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
