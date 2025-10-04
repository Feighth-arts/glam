"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@glamease.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+254 700 123 456",
      description: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Nairobi, Kenya",
      description: "Come say hello at our office"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Mon-Fri: 8am-6pm",
      description: "Weekend support available"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-b from-rose-light to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6">
            Get in <span className="text-rose-primary">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-12 h-12 bg-rose-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-blue mb-2">{info.title}</h3>
                  <p className="text-rose-primary font-medium mb-1">{info.details}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-dark-blue mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-primary text-white py-3 rounded-lg font-medium hover:bg-rose-dark transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-dark-blue mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-dark-blue mb-2">How do I book a service?</h3>
                    <p className="text-gray-600 text-sm">Simply browse our services, select your preferred provider, and book directly through our platform.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-dark-blue mb-2">How does the points system work?</h3>
                    <p className="text-gray-600 text-sm">Earn 1 point for every KES 100 spent. Redeem points for discounts on future bookings.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-dark-blue mb-2">Can I cancel my booking?</h3>
                    <p className="text-gray-600 text-sm">Yes, you can cancel bookings up to 24 hours before your appointment for a full refund.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-dark-blue mb-2">How do I become a provider?</h3>
                    <p className="text-gray-600 text-sm">Sign up as a provider during registration and complete our verification process to start offering services.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}