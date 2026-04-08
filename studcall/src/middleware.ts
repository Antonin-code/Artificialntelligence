import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Permet de contourner les middlewares si les variables ne sont pas définies en environnement de dev sans DB.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  
  // Si non connecté et tente d'accéder à l'appli
  if (!user && (pathname.startsWith('/admin') || pathname.startsWith('/teacher') || pathname.startsWith('/student') || pathname.startsWith('/pending'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const { data: userData } = await supabase
        .from('users')
        .select('status, role')
        .eq('id', user.id)
        .single();
        
    const status = userData?.status || 'pending';
    const role = userData?.role || user.user_metadata?.role || 'student';
    
    if (status === 'pending' || status === 'rejected') {
        if (!pathname.startsWith('/pending') && pathname !== '/login') {
            const url = request.nextUrl.clone()
            url.pathname = '/pending'
            url.searchParams.set('status', status)
            return NextResponse.redirect(url)
        }
    } else if (status === 'approved') {
        if (pathname === '/login' || pathname === '/register' || pathname === '/pending') {
            const url = request.nextUrl.clone()
            url.pathname = `/${role}`
            return NextResponse.redirect(url)
        }

        // RBAC enforcement
        if (role === 'teacher' && (pathname.startsWith('/admin') || pathname.startsWith('/student'))) {
             const url = request.nextUrl.clone()
             url.pathname = '/teacher'
             return NextResponse.redirect(url)
        }
        
        if (role === 'student' && (pathname.startsWith('/admin') || pathname.startsWith('/teacher'))) {
             const url = request.nextUrl.clone()
             url.pathname = '/student'
             return NextResponse.redirect(url)
        }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
