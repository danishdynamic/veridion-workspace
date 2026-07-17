'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from '../components/Sidebar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-screen">

            <Sidebar />

            <div className="ml-64 flex min-h-screen flex-1 flex-col">

              <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-10">
                {children}
              </main>

            </div>

          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}