'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@nexus/ui'
import Link from 'next/link'

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'Access denied. You do not have permission to sign in.',
  Verification: 'The verification link has expired or has already been used.',
  Default: 'An error occurred during authentication.',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMessages

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            {errorMessages[error] || errorMessages.Default}
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/auth/signin">Try Again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
