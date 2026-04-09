export const dynamic = 'force-dynamic'

export default function AdminAnalytics() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-driftwood mb-1">Analytics</h1>
      <p className="text-gray-500 mb-8">Website visitor stats powered by Vercel Analytics.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <p className="text-gray-500 text-sm leading-relaxed">
          Analytics data is available directly in your{' '}
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ocean font-semibold hover:underline"
          >
            Vercel Dashboard
          </a>{' '}
          under the Analytics tab for this project.
        </p>
        <p className="text-gray-400 text-xs mt-4">
          Once the site is deployed, Vercel Analytics will automatically track page views,
          unique visitors, top pages, and referrer sources — no additional setup required.
        </p>
      </div>
    </div>
  )
}
