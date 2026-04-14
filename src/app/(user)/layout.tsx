import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { signOut } from 'next-auth/react'
import UserNav from '@/components/user/UserNav'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role === 'admin') redirect('/admin/dashboard')

  return (
    <div className="min-h-screen bg-slate-50">
      <UserNav user={session.user} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
