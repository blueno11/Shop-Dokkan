"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { apiAdmin } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Product = {
  id: number
  name: string
  slug: string
  price: number
  sale_price: number | null
  sku: string | null
  is_active: 0 | 1
  created_at: string
  category_name?: string
}

type ListResponse = { items: Product[]; total: number; page: number; pageSize: number }

export default function AdminProductsPage() {
  const [data, setData] = useState<ListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc")

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), q, sortBy, sortDir })
      const res = await apiAdmin(`/api/admin/products?${params.toString()}`)
      setData(res)
    } catch (e: any) {
      setError(e?.message || 'Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, pageSize, sortBy, sortDir])

  const totalPages = useMemo(() => data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1, [data])

  async function handleDelete(id: number) {
    if (!confirm('Xóa sản phẩm này?')) return
    await apiAdmin(`/api/admin/products/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold">Sản phẩm</div>
        <Button asChild className="bg-orange-600 hover:bg-orange-700"><Link href="/admin/products/new">Thêm sản phẩm</Link></Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Input placeholder="Tìm theo tên/SKU" value={q} onChange={(e)=>setQ(e.target.value)} className="w-64" />
        <Button variant="secondary" onClick={()=>{ setPage(1); load(); }}>Tìm</Button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div className="overflow-x-auto border border-gray-800 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-900">
              <tr className="text-left">
                <th className="p-3 cursor-pointer" onClick={()=>{ setSortBy('id'); setSortDir(sortDir==='asc'?'desc':'asc'); }}>ID</th>
                <th className="p-3">Tên</th>
                <th className="p-3">Giá</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Danh mục</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map(p => (
                <tr key={p.id} className="border-t border-gray-800">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.price.toLocaleString()}đ</td>
                  <td className="p-3">{p.sku || '-'}</td>
                  <td className="p-3">{p.category_name || '-'}</td>
                  <td className="p-3">{p.is_active ? 'Hiển thị' : 'Ẩn'}</td>
                  <td className="p-3 space-x-2">
                    <Button asChild variant="secondary" size="sm"><Link href={`/admin/products/${p.id}`}>Sửa</Link></Button>
                    <Button variant="destructive" size="sm" onClick={()=>handleDelete(p.id)}>Xóa</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 text-sm text-gray-300">
        <div>Trang {page}/{totalPages} • Tổng {data?.total || 0}</div>
        <div className="space-x-2">
          <Button variant="secondary" disabled={page<=1} onClick={()=>setPage((p)=>p-1)}>Trước</Button>
          <Button variant="secondary" disabled={page>=totalPages} onClick={()=>setPage((p)=>p+1)}>Sau</Button>
        </div>
      </div>
    </div>
  )
}


