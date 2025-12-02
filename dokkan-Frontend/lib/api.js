// URL backend:
// - Production: lấy từ biến môi trường NEXT_PUBLIC_API_URL
// - Dev: fallback về http://localhost:4000
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function api(path, options = {}) {
	const method = (options.method || 'GET').toUpperCase();
	const isGet = method === 'GET';
	const headers = options.headers || {};

	// Only send JSON headers when we actually send a body
	const finalHeaders = isGet ? headers : { 'Content-Type': 'application/json', ...headers };

	// For public GETs, omit credentials by default, but allow callers to override
	const credentials = options.credentials ?? (isGet ? 'omit' : 'include');

	const res = await fetch(`${BASE_URL}${path}`,
		{
			credentials,
			headers: finalHeaders,
			...options,
		}
	);
	if (!res.ok) {
		let message = `Request failed with ${res.status}`;
		try {
			const data = await res.json();
			message = data.error || message;
		} catch {}
		throw new Error(message);
	}
	try {
		return await res.json();
	} catch {
		return null;
	}
} 

export async function apiAdmin(path, options = {}) {
    // Always include credentials for admin calls (protected endpoints)
    return api(path, { credentials: 'include', ...options });
}