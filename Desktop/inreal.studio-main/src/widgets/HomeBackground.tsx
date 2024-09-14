'use client'

import { HomeScreen } from '@/entities/HomeScreen'
import { useEffect } from 'react'

export const HomeBackground = () => {

	useEffect(() => {
		const screens = document.querySelectorAll('.screen')
		const html = document.querySelector('#home-screens')! as HTMLElement

		html.style.height = `${150 * screens.length + 1}vh`

		const screenHeight = html.scrollHeight / screens.length / 1.5

		for (let i = screens.length - 1; i >= 0; i--) {
			let screen = screens[i] as HTMLElement

			screen.style.maxHeight = '0px'

			const nextButton = document.querySelector('[data-next]')

			if (nextButton) {
				nextButton.addEventListener('click', () => {
					window.scrollTo({
						top: window.scrollY + screenHeight,
						behavior: 'smooth'
					})
				})
			}

			window.addEventListener('scroll', () => {
				let thisScroll = window.scrollY - screenHeight * i

				if (thisScroll >= 0 && thisScroll <= screenHeight) {
					screen.style.maxHeight = `${screenHeight}px`

					screen.setAttribute('data-before-scrolled', '')
				}
				else if (thisScroll <= screenHeight) {
					screen.style.maxHeight = '0px'

					screen.removeAttribute('data-before-scrolled')
				}
			})
		}
	}, [])


	
	return (
		<div id="home-screens">
			<HomeScreen label="INREAL.STUDIO"  video="/InReal_promo.mp4" first />
			{/* <HomeScreen label="3d моделирование" image="/3d-modeling.png" /> */}
			{/* <HomeScreen label="3d Анимация" image="/-f568-47fb-8760-4a58b00a68ec (1).jpg" video="/-f568-47fb-8760-4a58b00a68ec.mp4" /> */}
			{/* <HomeScreen label="3d визуализация" image="/-73b9-4060-8f38-c5968c6d6043 (1) (2).jpg" video="/-73b9-4060-8f38-c5968c6d6043.mp4" /> */}
			{/* <HomeScreen label="Фотограмметрия" image="/photogrammetry.png" /> */}
		</div>
	)
}