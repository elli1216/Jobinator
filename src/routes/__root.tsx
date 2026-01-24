import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect, useState } from 'react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import ClerkProvider from '../integrations/clerk/provider'

import appCss from '../styles.css?url'

import { ThemeProvider } from '../features/common/components/theme-provider'
import { UserSync } from '../features/auth/components/UserSync'
import type { QueryClient } from '@tanstack/react-query'
import { Loading } from '@/features/common/components/Loading'
import { HomeLayout } from '@/features/common/components/HomeLayout'
import NotFound from '@/features/common/components/NotFound'
import ErrorComponent from '@/features/common/components/Error'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
  auth: {
    userId: string | null
  }
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Jobinator',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: () => {
    return <NotFound />
  },
  errorComponent: ({ error }) => {
    return <ErrorComponent error={error} />
  },
})

function RootDocument() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className='max-w-screen' suppressHydrationWarning>
        {mounted ? (
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <ClerkProvider>
              <HomeLayout>
                <Toaster position="top-center" />
                <UserSync />
                <div className="flex-1 overflow-hidden">
                  <Outlet />
                </div>
                <TanStackDevtools
                  config={{
                    position: 'bottom-right',
                  }}
                  plugins={[
                    {
                      name: 'Tanstack Router',
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                    TanStackQueryDevtools,
                  ]}
                />
              </HomeLayout>
            </ClerkProvider>
          </ThemeProvider>
        ) : (
          <div className="h-screen">
            <Loading />
          </div>
        )}
        <Scripts />
      </body>
    </html>
  )
}
