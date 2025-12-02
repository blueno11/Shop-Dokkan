import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dokkan Shop - Chuyên bán tài khoản Dragon Ball Dokkan Battle",
  description:
    "Shop Dokkan uy tín - Bán tài khoản, dịch vụ farm, vật phẩm Dragon Ball Dokkan Battle. Giá rẻ, chất lượng, bảo hành tận tâm!",
    generator: 'v0.dev',
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
    ],
    appleWebApp: {
      title: "Dokkan Shop",
      statusBarStyle: "default",
      capable: true
    }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
