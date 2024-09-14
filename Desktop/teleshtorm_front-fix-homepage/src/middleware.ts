import { localePrefix } from "@/navigation";
import createIntlMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import setCookie from "set-cookie-parser";

export default async function middleware(request: NextRequest) {

  const handleI18nRouting = createIntlMiddleware({
    locales: ["ru", "en", "es", "fr", "de", "it", "pt"],
    localePrefix,
    defaultLocale: "ru",
  });
  const response = handleI18nRouting(request);

  return response;
}
export const config = {
  matcher: ["/", "/(ru|en|es|fr|de|it|pt)/:path*"],
};
