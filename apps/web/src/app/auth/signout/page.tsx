'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from '@nexus/ui'

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Signing you out...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Please wait while we sign you out safely.</div>
        </CardContent>
      </Card>
    </div>
  )
}
