import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
          <main className="p-4">
             {children} 
          </main>
    </div>
  )
}