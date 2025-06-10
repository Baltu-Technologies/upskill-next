import Link from 'next/link'

export default function DemoIndex() {
  const demos = [
    {
      title: 'My Pathways (Complete)',
      description: 'Full implementation with analytics, progress tracking, and management',
      href: '/demo/my-pathways-dynamic',
      status: 'Complete'
    },
    {
      title: 'Interest Analytics',
      description: 'Smart insights and analytics for user interests',
      href: '/demo/interest-analytics',
      status: 'Complete'
    },
    {
      title: 'Pathway Progress',
      description: 'Visual progress tracking and achievements',
      href: '/demo/pathway-progress',
      status: 'Complete'
    },
    {
      title: 'Pathway Management',
      description: 'Manage saved pathways with controls and filtering',
      href: '/demo/pathway-management',
      status: 'Complete'
    },
    {
      title: 'My Pathways (Basic)',
      description: 'Basic implementation without advanced features',
      href: '/demo/my-pathways',
      status: 'Basic'
    },
    {
      title: 'Career Exploration',
      description: 'Career exploration demo',
      href: '/demo/career-exploration',
      status: 'Available'
    },
    {
      title: 'User Profile Management',
      description: 'Comprehensive profile system with skills inventory and management',
      href: '/task18-demo',
      status: 'Complete'
    },
    {
      title: 'Emoji Slider',
      description: 'Interactive emoji slider component',
      href: '/demo/emoji-slider',
      status: 'Available'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Upskill Next Demos
          </h1>
          <p className="text-lg text-gray-600">
            Explore all the implemented features and components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {demo.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  demo.status === 'Complete' 
                    ? 'bg-green-100 text-green-800'
                    : demo.status === 'Basic'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {demo.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {demo.description}
              </p>
              <div className="mt-4 text-blue-600 text-sm font-medium">
                View Demo →
              </div>
            </Link>
          ))}
        </div>

        {/* Profile Demo Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            🚀 Profile Management Demo
          </h2>
          <p className="text-gray-600 text-center mb-6">
            The comprehensive profile management system is available here!
          </p>
          <div className="text-center">
            <button 
              onClick={() => window.location.href = '/task18-demo'} 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Launch Profile Demo
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              ✅ Skills Inventory • ✅ Career Preferences • ✅ Learning History • ✅ Privacy Settings • ✅ Profile Customization
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Built with Next.js, React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
} 