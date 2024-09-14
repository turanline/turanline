import { useEffect, useState } from 'react'

export const useMedia = (breakpoint: string) => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const media = window.matchMedia(breakpoint)

		const updateMedia = (media: MediaQueryList, setFn: (arg0: boolean) => void) => {
			setFn(media.matches)
		}

		updateMedia(media, setMatches)

		media.addEventListener('change', () => updateMedia(media, setMatches))

		return () => {
			media.removeEventListener('change', () => updateMedia(media, setMatches))
		}
	}, [breakpoint])

	return matches
}