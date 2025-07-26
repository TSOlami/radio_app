"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ChartBarIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: ChartBarIcon,
    title: "Advanced Analytics",
    description: "Get detailed insights into your investment performance with real-time analytics and reporting."
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Platform",
    description: "Bank-level security with multi-factor authentication and encrypted data protection."
  },
  {
    icon: CurrencyDollarIcon,
    title: "Diverse Investments",
    description: "Access a wide range of investment opportunities with different risk levels and returns."
  },
  {
    icon: UserGroupIcon,
    title: "Expert Support",
    description: "Get guidance from our team of investment professionals and dedicated support staff."
  }
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "Forever",
    description: "Perfect for beginners",
    features: [
      "Basic investment tracking",
      "Market insights",
      "Email support",
      "Mobile app access"
    ]
  },
  {
    name: "Professional",
    price: "$29",
    period: "per month",
    description: "For serious investors",
    features: [
      "Advanced analytics",
      "Priority support",
      "Custom reports",
      "API access",
      "Portfolio optimization"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "Contact us",
    description: "For institutions",
    features: [
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Advanced compliance tools"
    ]
  }
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Freeman Firms</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Professional Investment
              <span className="text-gradient block">Platform</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Manage your investments with confidence using our advanced platform designed for 
              individual investors, advisors, and institutions.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/register" className="btn-primary text-lg px-8 py-3">
                Start Investing Today
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/login" className="btn-outline text-lg px-8 py-3">
                Sign In to Your Account
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Freeman Firms?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the tools and expertise you need to make informed investment decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your investment needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/register" 
                  className={`w-full text-center ${
                    plan.popular ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust Freeman Firms with their financial future
          </p>
          <Link href="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
            Create Your Account
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Freeman Firms</h3>
            <p className="text-gray-400 mb-8">
              Professional investment platform for the modern investor
            </p>
            <div className="flex justify-center space-x-8">
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400">
                © 2024 Freeman Firms. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}