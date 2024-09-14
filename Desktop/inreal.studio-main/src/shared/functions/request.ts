export const request = async<T>(url: URL | string, tags: string[], init?: RequestInit): Promise<T> => {
	const response = await fetch(url, { ...init, next: { revalidate: 600, tags } })
	const json: T = await response.json()

	return json
}