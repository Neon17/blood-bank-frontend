import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between pt-5 sm:px-8 md:py-16 mx-auto min-h-[600px]">
        <div className="section-container max-w-7xl pt-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 mx-auto min-h-[600px]">
          {/* Left Text */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 dark:text-red-300">
              Every Drop Counts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Connect with blood donors and recipients in your community. Your
              registration can save lives.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/donors/register"
                className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition duration-200"
              >
                Register as Donor
              </Link>
              <Link
                href="/requests/create"
                className="border border-red-500 text-red-600 dark:text-red-400 px-6 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition duration-200"
              >
                Create Request
              </Link>
              <Link
                href="/donors"
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
              >
                Find Donors
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 h-full flex p-3 justify-center mb-10 md:mb-0">
            <img
              src="/blood.png"
              alt="blood donation"
              className="rounded-xl shadow-lg h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-red-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <p className="text-4xl font-bold text-red-700 dark:text-red-300 mb-2">
                50+
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-semibold">
                Registered Donors
              </p>
            </div>
            <div className="bg-red-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <p className="text-4xl font-bold text-red-700 dark:text-red-300 mb-2">
                25+
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-semibold">
                Blood Requests
              </p>
            </div>
            <div className="bg-red-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <p className="text-4xl font-bold text-red-700 dark:text-red-300 mb-2">
                24/7
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-semibold">
                Admin Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-red-600 dark:text-red-400 font-bold uppercase text-sm mb-2">
              What We Offer
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple & Effective Blood Donation Platform
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform connects blood donors with those in need through a
              straightforward process with admin verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Donor Registration',
                desc: 'Register as a blood donor with your details and availability. Admin approval ensures authenticity.',
                icon: '👤',
                link: '/donors/register',
                linkText: 'Register Now',
              },
              {
                title: 'Blood Requests',
                desc: 'Create blood requests when in need. Your request will be visible to potential donors in your area.',
                icon: '🩸',
                link: '/requests/create',
                linkText: 'Create Request',
              },
              {
                title: 'Donor Search',
                desc: 'Find registered blood donors by location and blood type. Connect directly with potential donors.',
                icon: '🔍',
                link: '/donors',
                linkText: 'Search Donors',
              },
              {
                title: 'Admin Verification',
                desc: 'All donor registrations and requests are verified by admins to ensure safety and reliability.',
                icon: '✅',
                link: '/about',
                linkText: 'Learn More',
              },
              {
                title: 'Request Management',
                desc: 'View and manage all blood requests in one place. Track the status of your requests.',
                icon: '📋',
                link: '/requests',
                linkText: 'View Requests',
              },
              {
                title: 'Community Driven',
                desc: 'Join a community of verified donors and recipients working together to save lives.',
                icon: '🤝',
                link: '/signup',
                linkText: 'Join Community',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.desc}
                </p>
                <Link
                  href={feature.link}
                  className="text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                >
                  {feature.linkText} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-red-600 dark:text-red-400 font-bold uppercase text-sm mb-2">
              Simple Process
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Our Platform Works
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A straightforward process to connect blood donors with those in
              need through admin-verified matches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: '1',
                title: 'Register',
                desc: 'Sign up and register as a donor or create a blood request',
                icon: '📝',
              },
              {
                step: '2',
                title: 'Admin Approval',
                desc: 'Our team verifies all registrations and requests for safety',
                icon: '✅',
              },
              {
                step: '3',
                title: 'Connect',
                desc: 'Find donors or requests based on your needs and location',
                icon: '🔗',
              },
              {
                step: '4',
                title: 'Save Lives',
                desc: 'Make connections that lead to life-saving blood donations',
                icon: '❤️',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-red-50 dark:bg-gray-700 p-6 rounded-lg text-center relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Join our community today and be part of the life-saving network.
            Register as a donor or create your first blood request.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donors/register"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Become a Donor
            </Link>
            <Link
              href="/requests/create"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200"
            >
              Create Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
