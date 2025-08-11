import { AuthButton } from '../components/auth-button'
import { Card, CardHeader, CardTitle, CardContent } from '@nexus/ui'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900">Nexus Bots</h1>
          <AuthButton />
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">
            Visual Bot Development Platform
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Build, deploy, and scale advanced bots for Telegram, Discord, and other platforms
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">🎨 Visual Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Drag and drop interface to create complex bot workflows without coding
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">🚀 Multi-Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Deploy your bots to Telegram, Discord, Slack, and more platforms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">🔌 Extensible</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Build custom plugins and integrations with our developer SDK
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
