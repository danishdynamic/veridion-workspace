'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2 7-7 7 7M5 10v10h3v-6h8v6h3V10" />
        </svg>
      ),
    },
    {
      name: 'Workspace',
      href: '/agents',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
        </svg>
      ),
    },
    {
      name: 'Compliance',
      href: '/compliance',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
        </svg>
      ),
    },
    {
      name: 'HITL Review',
      href: '/hitl-review',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-neutral-200 bg-white">

      {/* Logo */}

      <div className="border-b border-neutral-200 px-6 py-6">

        <Link
          href="/"
          className="border-b border-neutral-200 px-6 py-6 transition-colors hover:bg-neutral-50"
        >

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
            V
          </div>

          <div>
            <h1 className="font-semibold tracking-tight text-neutral-900">
              Veridion
            </h1>

            <p className="text-xs text-neutral-500">
              Multi-Agent RAG
            </p>
          </div>
        
        </div>
      </Link>
      </div>
      

      {/* Navigation */}

      <div className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Platform
        </p>

        <nav className="space-y-1">

          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200

                  ${
                    active
                      ? 'bg-neutral-100 text-black'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                  }
                `}
              >
                {active && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-black" />
                )}

                <span
                  className={`
                    transition-colors

                    ${
                      active
                        ? 'text-black'
                        : 'text-neutral-400 group-hover:text-black'
                    }
                  `}
                >
                  {item.icon}
                </span>

                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}

      <div className="border-t border-neutral-200 p-5">

        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">

          <div className="relative">

            <div className="h-10 w-10 rounded-full bg-neutral-900" />

            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />

          </div>

          <div>

            <p className="text-sm font-medium text-neutral-900">
              System Online
            </p>

            <p className="text-xs text-neutral-500">
              Version 2026.4.1
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}