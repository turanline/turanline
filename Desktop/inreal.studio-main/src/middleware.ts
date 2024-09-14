import { NextRequest, NextResponse } from 'next/server'

export const middleware = async (request: NextRequest) => {

	if (request.nextUrl.pathname === '/portfolio/3d-vizualizacziya') {
		return NextResponse.rewrite(new URL('/portfolio/3d-modelirovanie/1', request.url))
	}

	if (request.nextUrl.pathname === '/portfolio/fotogrammetriya') {
		return NextResponse.rewrite(new URL('/portfolio/3d-modelirovanie/1', request.url))
	}
}