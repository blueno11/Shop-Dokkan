"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiAdmin } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"

type ProductPayload = {
  name: string
  slug: string
  description?: string
  price: number
  sale_price?: number | null
  category_id?: number | null
  sku?: string | null
  is_active?: boolean
  meta?: {
    featured?: boolean
    rank?: number | null
    stones?: number | null
    lrs?: number | null
    images?: string[]
    features?: string[]
    lrList?: string[]
  }
}

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const idParam = params?.id as string
  const isNew = idParam === 'new'
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{id:number; name:string}[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [newImageUrl, setNewImageUrl] = useState<string>("")
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [categoryForm, setCategoryForm] = useState<{name:string; slug:string}>({ name: '', slug: '' })

  function stripTracking(u: string): string {
    try {
      if (u.startsWith('data:image/')) return u
      const url = new URL(u)
      const paramsToRemove = [
        'utm_source','utm_medium','utm_campaign','utm_term','utm_content',
        'fbclid','gclid','mc_cid','mc_eid','si','igsh','igshid'
      ]
      paramsToRemove.forEach(p => url.searchParams.delete(p))
      url.hash = ''
      return url.toString()
    } catch {
      return u
    }
  }

  function mergeUniqueImages(current: string[], incoming: string[]): string[] {
    const normalizedIncoming = incoming.map(s => stripTracking(s.trim())).filter(Boolean)
    const seen = new Set(current.map(stripTracking))
    const next: string[] = [...current]
    for (const n of normalizedIncoming) {
      if (!seen.has(n)) {
        seen.add(n)
        next.push(n)
      }
    }
    return next
  }

  function slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const [form, setForm] = useState<ProductPayload>({
    name: '', slug: '', description: '', price: 0, sale_price: null, category_id: null, sku: '', is_active: true,
    meta: { featured: false, rank: null, stones: null, lrs: null, images: [], features: [], lrList: [] }
  })

  useEffect(() => {
    if (isNew) return
    (async () => {
      try {
        const data = await apiAdmin(`/api/admin/products/${idParam}`)
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          price: Number(data.price),
          sale_price: data.sale_price != null ? Number(data.sale_price) : null,
          category_id: data.category_id || null,
          sku: data.sku || '',
          is_active: Boolean(data.is_active),
          meta: {
            featured: Boolean(data.meta?.featured),
            rank: data.meta?.rank != null ? Number(data.meta.rank) : null,
            stones: data.meta?.stones != null ? Number(data.meta.stones) : null,
            lrs: data.meta?.lrs != null ? Number(data.meta.lrs) : null,
            images: Array.isArray(data.meta?.images) ? data.meta.images : [],
            features: Array.isArray(data.meta?.features) ? data.meta.features : [],
            lrList: Array.isArray(data.meta?.lrList) ? data.meta.lrList : [],
          }
        })
      } catch (e: any) {
        setError(e?.message || 'Không tải được sản phẩm')
      } finally {
        setLoading(false)
      }
    })()
  }, [idParam, isNew])

  useEffect(() => {
    (async () => {
      try {
        const res = await apiAdmin('/api/admin/categories')
        setCategories(res.items || [])
      } catch {}
    })()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const method = isNew ? 'POST' : 'PUT'
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${idParam}`
      await apiAdmin(url, {
        method,
        body: JSON.stringify({
          ...form,
          is_active: form.is_active ? 1 : 0,
          meta: {
            featured: Boolean(form.meta?.featured),
            rank: form.meta?.rank != null ? Number(form.meta.rank) : null,
            stones: form.meta?.stones != null ? Number(form.meta.stones) : null,
            lrs: form.meta?.lrs != null ? Number(form.meta.lrs) : null,
            images: (form.meta?.images || []).filter(Boolean),
            features: (form.meta?.features || []).filter(Boolean),
            lrList: (form.meta?.lrList || []).filter(Boolean),
          }
        })
      })
      router.push('/admin/products')
    } catch (e: any) {
      setError(e?.message || 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div className="max-w-2xl">
      <div className="text-xl font-semibold mb-4">{isNew ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}</div>
      {error && <div className="text-red-400 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="text-sm mb-1">Tên</div>
          <Input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required className="bg-white text-black" />
        </div>
        <div>
          <div className="text-sm mb-1">Slug</div>
          <Input value={form.slug} onChange={(e)=>setForm({...form, slug: e.target.value})} required className="bg-white text-black" />
        </div>
        <div>
          <div className="text-sm mb-1">Mô tả</div>
          <textarea
            className="w-full bg-transparent border border-gray-700 rounded p-2 text-sm"
            rows={5}
            value={form.description || ''}
            onChange={(e)=>setForm({ ...form, description: e.target.value })}
            placeholder="Mô tả sản phẩm (tùy chọn)"
          />
        </div>
        <div>
          <div className="text-sm mb-1">Giá</div>
          <Input type="number" value={String(form.price)} onChange={(e)=>setForm({...form, price: Number(e.target.value)})} required className="bg-white text-black" />
        </div>
        <div>
          <div className="text-sm mb-1">Giá khuyến mãi</div>
          <Input type="number" value={form.sale_price != null ? String(form.sale_price) : ''} onChange={(e)=>setForm({...form, sale_price: e.target.value===''?null:Number(e.target.value)})} className="bg-white text-black" />
        </div>
        <div>
          <div className="text-sm mb-1">SKU</div>
          <Input value={form.sku || ''} onChange={(e)=>setForm({...form, sku: e.target.value})} className="bg-white text-black" />
        </div>
        <div>
          <div className="text-sm mb-1">Danh mục</div>
          <Select value={form.category_id != null ? String(form.category_id) : "none"} onValueChange={(v)=>setForm({...form, category_id: v === 'none' ? null : Number(v)})}>
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="none">Không có</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={()=>{
              setShowAddCategory((s)=>!s)
              setShowEditCategory(false)
              setCategoryForm({ name: '', slug: '' })
            }}>Thêm danh mục</Button>
            {form.category_id != null && (
              <Button type="button" variant="secondary" onClick={()=>{
                const current = categories.find(c=>c.id === form.category_id)
                setCategoryForm({ name: current?.name || '', slug: slugify(current?.name || '') })
                setShowEditCategory((s)=>!s)
                setShowAddCategory(false)
              }}>Sửa danh mục</Button>
            )}
          </div>
          {showAddCategory && (
            <div className="mt-2 border border-gray-700 rounded p-3 space-y-2">
              <div className="text-sm font-medium">Thêm danh mục</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input placeholder="Tên danh mục" value={categoryForm.name} onChange={(e)=>{
                  const name = e.target.value
                  setCategoryForm({ name, slug: slugify(name) })
                }} className="bg-white text-black" />
                <Input placeholder="Slug" value={categoryForm.slug} onChange={(e)=>setCategoryForm({...categoryForm, slug: e.target.value})} className="bg-white text-black" />
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={async ()=>{
                  const { name, slug } = categoryForm
                  if (!name || !slug) return alert('Vui lòng nhập tên và slug')
                  try {
                    const created = await apiAdmin('/api/admin/categories', {
                      method: 'POST',
                      body: JSON.stringify({ name, slug, is_active: 1 })
                    })
                    setCategories(prev=>[...prev, { id: created.id, name: created.name }])
                    setForm(prev=>({ ...prev, category_id: created.id }))
                    setShowAddCategory(false)
                    setCategoryForm({ name: '', slug: '' })
                  } catch (e:any) {
                    alert(e?.message || 'Tạo danh mục thất bại')
                  }
                }}>Lưu</Button>
                <Button type="button" variant="secondary" onClick={()=>{ setShowAddCategory(false); }}>Hủy</Button>
              </div>
            </div>
          )}
          {showEditCategory && form.category_id != null && (
            <div className="mt-2 border border-gray-700 rounded p-3 space-y-2">
              <div className="text-sm font-medium">Sửa danh mục</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input placeholder="Tên danh mục" value={categoryForm.name} onChange={(e)=>{
                  const name = e.target.value
                  setCategoryForm({ name, slug: slugify(name) })
                }} className="bg-white text-black" />
                <Input placeholder="Slug" value={categoryForm.slug} onChange={(e)=>setCategoryForm({...categoryForm, slug: e.target.value})} className="bg-white text-black" />
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={async ()=>{
                  const { name, slug } = categoryForm
                  if (!name || !slug) return alert('Vui lòng nhập tên và slug')
                  try {
                    await apiAdmin(`/api/admin/categories/${form.category_id}`, {
                      method: 'PUT',
                      body: JSON.stringify({ name, slug, is_active: 1 })
                    })
                    setCategories(prev=>prev.map(c=> c.id === form.category_id ? { ...c, name } : c))
                    setShowEditCategory(false)
                  } catch (e:any) {
                    alert(e?.message || 'Cập nhật danh mục thất bại')
                  }
                }}>Lưu</Button>
                <Button type="button" variant="secondary" onClick={()=>{ setShowEditCategory(false); }}>Hủy</Button>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.is_active} onChange={(e)=>setForm({...form, is_active: e.target.checked})} />
            Hiển thị
          </label>
        </div>
        <div className="pt-2 border-t border-gray-800" />
        <div className="text-base font-semibold">Thông tin tài khoản (meta)</div>
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.meta?.featured} onChange={(e)=>setForm({...form, meta: { ...(form.meta||{}), featured: e.target.checked }})} />
            Featured
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <div className="text-sm mb-1">Rank</div>
            <Input type="number" value={form.meta?.rank != null ? String(form.meta.rank) : ''} onChange={(e)=>setForm({...form, meta: { ...(form.meta||{}), rank: e.target.value===''?null:Number(e.target.value) }})} />
          </div>
          <div>
            <div className="text-sm mb-1">Stones</div>
            <Input type="number" value={form.meta?.stones != null ? String(form.meta.stones) : ''} onChange={(e)=>setForm({...form, meta: { ...(form.meta||{}), stones: e.target.value===''?null:Number(e.target.value) }})} />
          </div>
          <div>
            <div className="text-sm mb-1">LRs</div>
            <Input type="number" value={form.meta?.lrs != null ? String(form.meta.lrs) : ''} onChange={(e)=>setForm({...form, meta: { ...(form.meta||{}), lrs: e.target.value===''?null:Number(e.target.value) }})} />
          </div>
        </div>
        <div>
          <div className="text-sm mb-1">Hình ảnh (mỗi dòng một URL)</div>
          <textarea className="w-full bg-transparent border border-gray-700 rounded p-2 text-sm" rows={4}
            value={(form.meta?.images || []).join('\n')}
            onChange={(e)=>{
              const parts = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean)
              // Rebuild with normalized unique values in original order
              const next = Array.from(new Set(parts.map(stripTracking)))
              setForm({ ...form, meta: { ...(form.meta || {}), images: next } })
            }}
          />
          <div className="mt-2 flex gap-2">
            <Input
              placeholder="Dán URL ảnh rồi nhấn Enter hoặc bấm Thêm"
              value={newImageUrl}
              onChange={(e)=>setNewImageUrl(e.target.value)}
              onKeyDown={(e)=>{
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const parts = newImageUrl.split(/[\n\r\s,]+/).map(s=>s.trim()).filter(Boolean)
                  if (parts.length === 0) return
                  const next = mergeUniqueImages((form.meta?.images || []), parts)
                  setForm({ ...form, meta: { ...(form.meta || {}), images: next }})
                  setNewImageUrl("")
                }
              }}
              className="bg-white text-black"
            />
            <Button type="button" onClick={()=>{
              const parts = newImageUrl.split(/[\n\r\s,]+/).map(s=>s.trim()).filter(Boolean)
              if (parts.length === 0) return
              const next = mergeUniqueImages((form.meta?.images || []), parts)
              setForm({ ...form, meta: { ...(form.meta || {}), images: next }})
              setNewImageUrl("")
            }}>Thêm</Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="file" accept="image/*" multiple onChange={async (e)=>{
              const fileList = e.target.files
              if (!fileList || fileList.length === 0) return
              try {
                const uploaded: string[] = []
                const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
                for (const file of Array.from(fileList)) {
                  const fd = new FormData()
                  fd.append('file', file)
                  const res = await fetch(`${base}/api/upload/image`, {
                    method: 'POST',
                    credentials: 'include',
                    body: fd,
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data.error || 'Upload thất bại')
                  if (data.url) uploaded.push(data.url)
                }
                const next = mergeUniqueImages((form.meta?.images || []), uploaded)
                setForm({...form, meta: { ...(form.meta||{}), images: next }})
              } catch (err:any) {
                alert(err?.message || 'Upload thất bại')
              } finally {
                e.currentTarget.value = ''
              }
            }} />
            <span className="text-xs text-gray-400">Bạn có thể dán link ảnh cloud hoặc upload để nhận URL cục bộ</span>
          </div>
          {(form.meta?.images?.length || 0) > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(form.meta?.images || []).map((url, idx) => (
                <div
                  key={idx}
                  className="relative group border border-gray-700 rounded overflow-hidden cursor-move"
                  draggable
                  onDragStart={() => setDragIndex(idx)}
                  onDragOver={(e) => {
                    e.preventDefault()
                  }}
                  onDrop={() => {
                    if (dragIndex == null || dragIndex === idx) return
                    const current = [...(form.meta?.images || [])]
                    const [moved] = current.splice(dragIndex, 1)
                    current.splice(idx, 0, moved)
                    setDragIndex(null)
                    setForm({ ...form, meta: { ...(form.meta || {}), images: current } })
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`image-${idx}`} className="w-full h-28 object-cover" />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-xs bg-red-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    onClick={() => {
                      const next = (form.meta?.images || []).filter((_, i) => i !== idx)
                      setForm({ ...form, meta: { ...(form.meta || {}), images: next } })
                    }}
                    aria-label="Xóa ảnh"
                    title="Xóa ảnh"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="text-sm mb-1">Features (mỗi dòng một mục)</div>
          <textarea className="w-full bg-transparent border border-gray-700 rounded p-2 text-sm" rows={4}
            value={(form.meta?.features || []).join('\n')}
            onChange={(e)=>setForm({...form, meta: { ...(form.meta||{}), features: e.target.value.split('\n').map(s=>s.trim()).filter(Boolean) }})}
          />
        </div>
        <div>
          <div className="text-sm mb-1">LR List (mỗi dòng một LR)</div>
          <textarea className="w-full bg-transparent border border-gray-700 rounded p-2 text-sm" rows={4}
            value={(form.meta?.lrList || []).join('\n')}
            onChange={(e)=>setForm({...form, meta: { ...(form.meta||{}), lrList: e.target.value.split('\n').map(s=>s.trim()).filter(Boolean) }})}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700">{saving ? 'Đang lưu...' : 'Lưu'}</Button>
          <Button type="button" variant="secondary" onClick={()=>router.push('/admin/products')}>Hủy</Button>
        </div>
      </form>
    </div>
  )
}


