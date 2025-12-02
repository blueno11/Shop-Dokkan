"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export type CartItem = {
	productId: string;
	name: string;
	price: number;
	quantity: number;
	image?: string;
};

type CartContextValue = {
	items: CartItem[];
	totalQuantity: number;
	totalPrice: number;
	loading: boolean;
	refresh: () => Promise<void>;
	addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => Promise<void>;
	updateQuantity: (productId: string, quantity: number) => Promise<void>;
	removeItem: (productId: string) => Promise<void>;
	clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(true);

	const refresh = async () => {
		setLoading(true);
		try {
			const data = await api('/api/cart', { credentials: 'include' });
			setItems(data.items || []);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
	}, []);

	const addItem: CartContextValue["addItem"] = async (item) => {
		const data = await api('/api/cart', {
			method: 'POST',
			body: JSON.stringify(item),
			credentials: 'include',
		});
		setItems(data.items || []);
	};

	const updateQuantity: CartContextValue["updateQuantity"] = async (productId, quantity) => {
		const data = await api(`/api/cart/${productId}`, {
			method: 'PATCH',
			body: JSON.stringify({ quantity }),
			credentials: 'include',
		});
		setItems(data.items || []);
	};

	const removeItem: CartContextValue["removeItem"] = async (productId) => {
		const data = await api(`/api/cart/${productId}`, { method: 'DELETE', credentials: 'include' });
		setItems(data.items || []);
	};

	const clear: CartContextValue["clear"] = async () => {
		const data = await api('/api/cart', { method: 'DELETE', credentials: 'include' });
		setItems(data.items || []);
	};

	const value = useMemo<CartContextValue>(() => {
		const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
		const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
		return { items, totalQuantity, totalPrice, loading, refresh, addItem, updateQuantity, removeItem, clear };
	}, [items, loading]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
} 