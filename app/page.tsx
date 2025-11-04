export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Study Map
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          Explore Masters in Finance Worldwide
        </p>
        <p className="text-lg text-gray-500 mb-12">
          Discover and compare top Masters in Finance programs from universities around the globe.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
            <div className="text-gray-600">Programs</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Countries</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600">Universities</div>
          </div>
        </div>

        <div className="space-y-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            Start Exploring (Coming Soon)
          </button>
          <p className="text-sm text-gray-500">
            🚀 Site successfully deployed on Vercel!
          </p>
        </div>
      </div>
    </div>
  )
}