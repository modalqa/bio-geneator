export default function Features() {
  return (
    <section className="py-8 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
        <div className="bg-orange-50/50 rounded-xl p-6 transition-transform hover:scale-105">
          <div className="text-orange-500 text-4xl sm:text-5xl mb-4">⚡</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Fast & Easy</h3>
          <p className="text-sm sm:text-base text-gray-600">Just fill in a few details and let AI craft multiple bio instantly.</p>
        </div>
        <div className="bg-orange-50/50 rounded-xl p-6 transition-transform hover:scale-105">
          <div className="text-orange-500 text-4xl sm:text-5xl mb-4">🎯</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Platform Optimized</h3>
          <p className="text-sm sm:text-base text-gray-600">Bio tailored to LinkedIn, Instagram, Twitter/X, TikTok, Dating Apps, Bumble, and Medium.</p>
        </div>
        <div className="bg-orange-50/50 rounded-xl p-6 transition-transform hover:scale-105">
          <div className="text-orange-500 text-4xl sm:text-5xl mb-4">✨</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Personal Touch</h3>
          <p className="text-sm sm:text-base text-gray-600">Include your interests, traits, and optional emojis for a unique touch.</p>
        </div>
      </div>
    </section>
  );
}
