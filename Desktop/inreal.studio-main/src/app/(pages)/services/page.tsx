import { wordpress } from '@/shared/api/wordpress'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

const metadata: Metadata = {
	title: 'Услуги - inReal.studio'
}

const ServicesPage = async () => {
	const [firstService] = await wordpress.getServices({
		per_page: '1'
	})

	redirect(`/services/${firstService.slug}`)

	return (
		<>
			Переадресация...
		</>
	)
}

export default ServicesPage