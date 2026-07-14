import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['ka', 'en', 'ru']
let defaultLocale = 'ka'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Check if there's a saved language cookie
    const savedLang = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale
    const locale = locales.includes(savedLang) ? savedLang : defaultLocale

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`,
        request.url
      )
    )
  }
}

export const config = {
  matcher: [
    // Skip all internal paths and assets
    '/((?!_next|api|admin|uploads|favicon.ico|manifest.json|.*\\..*).*)',
  ],
}
