import type { Metadata } from 'next'
import { type ReactNode, Suspense } from 'react'
import { Footer } from '@/widgets/Footer'
import { Header } from '@/widgets/Header'

export const metadata: Metadata = {
  title: "Inreal Studio",
  description: "Inreal Studio seo description",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>
        <Suspense>
          {children}
        </Suspense>
      </main>
      <Footer />
    </>
  )
}