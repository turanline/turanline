import { redirect } from 'next/navigation'

const PortfolioRedirect = async () => {
	redirect(`/portfolio/all/1`)

	return (
		<div>You are being redirected</div>
	)
}

export default PortfolioRedirect