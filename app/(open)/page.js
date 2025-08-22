import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-rose-light to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-dark-blue mb-6">
              Your Beauty Journey, <br />
              <span className="text-rose-primary">Simplified</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover and book beauty services from trusted providers in your area. 
              Earn points, save money, and look your best with Glamease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="bg-rose-primary text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-rose-dark transition-colors"
              >
                Get Started
              </Link>
              <Link 
                href="/services" 
                className="bg-white text-dark-blue px-8 py-3 rounded-md text-lg font-semibold border-2 border-rose-primary hover:bg-rose-light transition-colors"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark-blue mb-12">
            Why Choose Glamease?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg bg-light-gray">
              <div className="w-16 h-16 bg-rose-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book appointments instantly with our verified beauty service providers
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg bg-light-gray">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dark-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
              <p className="text-gray-600">
                Get rewarded with points for every booking and redeem them for discounts
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg bg-light-gray">
              <div className="w-16 h-16 bg-rose-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Providers</h3>
              <p className="text-gray-600">
                All our beauty service providers are verified and rated by the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Beauty Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered their perfect beauty service providers on Glamease.
          </p>
          <Link 
            href="/signup" 
            className="inline-block bg-rose-primary text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-rose-dark transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
