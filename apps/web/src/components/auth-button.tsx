'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@nexus/ui'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button disabled variant="outline">
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          Welcome, {session.user?.name || session.user?.email}
        </span>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => signIn()} className="bg-blue-600 hover:bg-blue-700 text-white">
      Sign In
    </Button>
  )
}
