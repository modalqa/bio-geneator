export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-orange-400 to-pink-500 text-white py-12 sm:py-20">
      <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Craft Your Perfect Bio with AI</h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 px-2">Generate engaging and platform-optimized bio in seconds — now with support for Medium!</p>
        <button
          onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-orange-600 font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow hover:bg-gray-100 transition-colors"
        >
          🚀 Generate Your Bio
        </button>
      </div>
    </section>
  );
}
