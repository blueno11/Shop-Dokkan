"use client"

import React from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image";

export default function CartPage() {
	const { items, totalPrice, totalQuantity, loading, updateQuantity, removeItem, clear, addItem } = useCart();

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto">
					<div className="container mx-auto max-w-4xl p-6 text-white">Đang tải giỏ hàng...</div>
				</main>
				<Footer />
			</div>
		);
	}
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
			<Header />
			<main className="flex-1 overflow-y-auto">
				<div className="container mx-auto max-w-4xl p-3 sm:p-6 text-white">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-xl sm:text-2xl font-bold">Giỏ hàng</h1>
					</div>
					{items.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-gray-400 text-lg mb-4">🛒</div>
							<div className="text-gray-300">Giỏ hàng trống</div>
						</div>
					) : (
						<>
							<div className="space-y-3 max-h-[60vh] sm:max-h-[55vh] overflow-y-auto pr-1 sm:pr-2">
								{items.map((item) => (
									<div key={item.productId} className="bg-gray-800 p-3 sm:p-4 rounded border border-gray-700">
										{/* Mobile Layout */}
										<div className="block sm:hidden">
											<div className="flex gap-3 mb-3">
												{item.image ? (
													<Image src={item.image} alt={item.name} width={60} height={60} className="rounded flex-shrink-0" />
												) : (
													<div className="w-15 h-15 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
														<span className="text-gray-400 text-xs">IMG</span>
													</div>
												)}
												<div className="flex-1 min-w-0">
													<div className="font-semibold text-sm break-words leading-tight">{item.name}</div>
													<div className="text-xs text-gray-300 mt-1">Giá: {item.price.toLocaleString()}đ</div>
													<div className="text-sm font-semibold text-orange-400 mt-1">
														{(item.price * item.quantity).toLocaleString()}đ
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Button 
														variant="secondary" 
														size="sm"
														className="w-8 h-8 p-0 text-lg font-bold"
														onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
													>
														-
													</Button>
													<span className="min-w-8 text-center font-semibold">{item.quantity}</span>
													<Button 
														variant="secondary" 
														size="sm"
														className="w-8 h-8 p-0 text-lg font-bold"
														onClick={() => updateQuantity(item.productId, item.quantity + 1)}
													>
														+
													</Button>
												</div>
												<Button 
													variant="destructive" 
													size="sm"
													className="text-xs px-3 py-1"
													onClick={() => removeItem(item.productId)}
												>
													Xóa
												</Button>
											</div>
										</div>

										{/* Desktop Layout */}
										<div className="hidden sm:flex items-center gap-4">
											{item.image ? (
												<Image src={item.image} alt={item.name} width={64} height={64} className="rounded" />
											) : (
												<div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
													<span className="text-gray-400 text-sm">IMG</span>
												</div>
											)}
											<div className="flex-1 min-w-0">
												<div className="font-semibold break-words">{item.name}</div>
												<div className="text-sm text-gray-300">Giá: {item.price.toLocaleString()}đ</div>
											</div>
											<div className="flex items-center gap-2">
												<Button 
													variant="secondary" 
													size="sm"
													onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
												>
													-
												</Button>
												<span className="min-w-8 text-center">{item.quantity}</span>
												<Button 
													variant="secondary" 
													size="sm"
													onClick={() => updateQuantity(item.productId, item.quantity + 1)}
												>
													+
												</Button>
											</div>
											<div className="w-24 text-right font-semibold">{(item.price * item.quantity).toLocaleString()}đ</div>
											<Button 
												variant="destructive" 
												size="sm"
												onClick={() => removeItem(item.productId)}
											>
												Xóa
											</Button>
										</div>
									</div>
								))}
							</div>

							<div className="mt-4 sticky bottom-0 bg-gray-900 p-3 sm:p-4 rounded border border-gray-700">
								{/* Mobile Layout */}
								<div className="block sm:hidden">
									<div className="flex justify-between items-center mb-3">
										<div className="text-sm">
											<div>Tổng số lượng: <b>{totalQuantity}</b></div>
											<div className="text-orange-400 font-semibold">Tổng tiền: <b>{totalPrice.toLocaleString()}đ</b></div>
										</div>
									</div>
									<div className="flex gap-2">
										<Button 
											variant="secondary" 
											size="sm"
											className="flex-1 text-xs"
											onClick={clear}
										>
											Xóa hết
										</Button>
										<Button 
											className="flex-1 bg-orange-600 hover:bg-orange-700 text-xs"
										>
											Thanh toán
										</Button>
									</div>
								</div>

								{/* Desktop Layout */}
								<div className="hidden sm:flex items-center justify-between">
									<div>Tổng số lượng: <b>{totalQuantity}</b></div>
									<div>Tổng tiền: <b>{totalPrice.toLocaleString()}đ</b></div>
									<div className="flex gap-2">
										<Button variant="secondary" onClick={clear}>Xóa hết</Button>
										<Button className="bg-orange-600 hover:bg-orange-700">Thanh toán</Button>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
} 