import Link from "next/link";
import { Users, Award, Shield, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Providers", value: "500+", icon: Users },
    { label: "Happy Clients", value: "10,000+", icon: Heart },
    { label: "Services Completed", value: "50,000+", icon: Award },
    { label: "Years of Trust", value: "3+", icon: Shield }
  ];

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", description: "Beauty industry veteran with 15+ years experience" },
    { name: "Michael Chen", role: "CTO", description: "Tech leader passionate about connecting beauty professionals" },
    { name: "Emily Rodriguez", role: "Head of Operations", description: "Ensuring seamless experiences for all users" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-rose-light to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6">
            About <span className="text-rose-primary">Glamease</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re revolutionizing the beauty industry by connecting talented service providers 
            with clients who deserve exceptional care and convenience.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark-blue mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At Glamease, we believe everyone deserves to look and feel their best. Our platform 
                makes it easy to discover, book, and enjoy premium beauty services while rewarding 
                loyalty through our innovative points system.
              </p>
              <p className="text-gray-600">
                We&apos;re committed to supporting local beauty professionals by providing them with 
                the tools and platform they need to grow their businesses and reach more clients.
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-light to-gold-light rounded-2xl h-80"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark-blue mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-rose-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-dark-blue mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark-blue mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-rose-light to-gold-light rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-dark-blue mb-2">{member.name}</h3>
                <p className="text-rose-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-dark-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-rose-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trust & Safety</h3>
              <p className="text-gray-300">All providers are verified and rated by our community</p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-rose-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Service</h3>
              <p className="text-gray-300">We maintain high standards for exceptional experiences</p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-rose-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-300">Building connections between providers and clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-primary to-rose-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re looking for beauty services or want to offer them, 
            Glamease is the perfect platform for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-rose-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/services" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-rose-primary transition-colors"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}