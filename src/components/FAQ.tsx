export default function FAQ() {
  return (
    <section className="py-8 sm:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-orange-50/50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">Is this AI Bio Generator free to use?</h3>
            <p className="text-gray-700 text-sm sm:text-base">Yes, it's completely free for personal use.</p>
          </div>
          <div className="bg-orange-50/50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">Can I generate bio for multiple platforms?</h3>
            <p className="text-gray-700 text-sm sm:text-base">Absolutely! You can select different platforms like LinkedIn, Instagram, Medium, and more.</p>
          </div>
          <div className="bg-orange-50/50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">Do I need to provide my real name?</h3>
            <p className="text-gray-700 text-sm sm:text-base">No, the name field is optional — you can leave it blank if you prefer.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
