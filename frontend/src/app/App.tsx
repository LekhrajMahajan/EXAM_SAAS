// src/app/App.tsx
// Application root — composes all providers and the router.
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/lib/query/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/features/auth/providers/AuthProvider'
import { ConfirmProvider } from '@/providers/ConfirmProvider'
import { DynamicMetadataProvider } from '@/providers/DynamicMetadataProvider'
import { router } from '@/routes/router'
import { Toaster as ShadcnToaster } from '@/shared/components/ui/toaster'
import { Toaster as HotToaster } from 'react-hot-toast'

export const App = () => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ConfirmProvider>
            <DynamicMetadataProvider>
              <RouterProvider router={router} />
              <ShadcnToaster />
              <HotToaster position="top-right" />
            </DynamicMetadataProvider>
          </ConfirmProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
