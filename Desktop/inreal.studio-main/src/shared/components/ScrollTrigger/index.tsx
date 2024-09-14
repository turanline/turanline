'use client'

import { useEffect } from 'react'

export const ScrollTrigger = () => {
	useEffect(() => {
		window.addEventListener('scroll', () => {
			if (window.scrollY > 0) {
				document.documentElement.setAttribute('data-scroll', '')
			}
			else {
				document.documentElement.removeAttribute('data-scroll')
			}
		})
	}, [])

	return (
		<></>
	)
}