import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

const ProjectPage = async ({ params }: { params: { slug: string } }): Promise<ReactNode> => {
	redirect(`/portfolio/${params.slug}/1`)

	return (
		<div>You are being redirected</div>
	)
}

export default ProjectPage