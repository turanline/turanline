import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import BurgerMenu from "@/components/BurgerMenu/BurgerMenu";
//styles
import "./globals.scss";
import "normalize.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport ={
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  
  const messages = await getMessages();
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true} className={inter.className}>
        <main
          style={{
            maxWidth: "100vw",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            position: "relative",
            backgroundColor: "rgb(250, 251, 254)",
          }}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            <BurgerMenu/>
            {children}
            <Footer />
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
