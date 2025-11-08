import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between pt-5 sm:px-8 md:py-16 dark:bg-gray-900  mx-auto min:h-[600px]">
        <div className="section-container max-w-7xl pt-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 mx-auto min:h-[600px]">
          {/* Left Text */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 dark:text-red-300">
              Every Drop Counts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Join our community of life-savers. Your donation can make a
              difference.
            </p>
            <div className="flex gap-4">
              <Link
                href={`/signup`}
                className="bg-red-600 text-white px-3 py-2 md:px-6 md:py-3 rounded shadow hover:bg-red-700 transition"
              >
                Become a Donor
              </Link>
              <Link
                href={`/donors`}
                className="border border-red-500 text-red-600 dark:text-red-400 px-3 py-2 md:px-6 md:py-3 rounded hover:bg-red-100 hover:dark:bg-gray-700 hover:cursor-pointer transition"
              >
                Find Donors
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 h-full flex p-3 justify-center mb-10 md:mb-0">
            <img
              src="/blood.png"
              alt="blood cells"
              className="rounded-xl shadow-lg h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:px-6 dark:bg-gray-900">
        <div className="section-container max-w-7xl flex flex-col md:flex-row items-center justify-between  mx-auto min:h-[600px]">
          <div className="flex w-full px-4 flex-col md:flex-row justify-center items-center max-w-6xl mx-auto gap-8 text-center">
            <div className="bg-white w-full md:w-auto p-12 rounded shadow-md dark:bg-gray-800">
              <p className="text-3xl font-bold text-red-700 dark:text-gray-200">
                1000+
              </p>
              <p className="text-gray-600 dark:text-gray-300">Lives Saved</p>
            </div>
            <div className="bg-white w-full md:w-auto p-12 rounded shadow-md dark:bg-gray-800">
              <p className="text-3xl font-bold text-red-700 dark:text-gray-200">
                500+
              </p>
              <p className="text-gray-600 dark:text-gray-300">Active Donors</p>
            </div>
            <div className="bg-white w-full md:w-auto p-12 rounded shadow-md dark:bg-gray-800">
              <p className="text-3xl font-bold text-red-700 dark:text-gray-200">
                24/7
              </p>
              <p className="text-gray-600 dark:text-gray-300">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-pink-50 dark:bg-gray-800 py-16 sm:px-6 text-center">
        <div className="section-container max-w-7xl py-16 px-4 sm:px-6 mx-auto text-center">
          <h2 className="text-red-600 dark:text-red-400 font-bold uppercase text-sm mb-2">
            Our Mission
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-red-700 dark:text-red-300 mb-4">
            Connecting Lives Through Blood Donation
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            We're building a community where finding blood donors is quick,
            easy, and reliable. Our platform ensures that help is always within
            reach.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Quick Find',
                desc: 'Instant matching of blood donors by blood type and location.',
                icon: '🔍',
              },
              {
                title: 'Real-time Availability',
                desc: 'Donors can update their availability for emergency situations.',
                icon: '⏱️',
              },
              {
                title: 'Emergency Notification',
                desc: 'Immediate alerts to matching donors via text, email, or mobile apps.',
                icon: '🚨',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded shadow-md text-left flex-1"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-2 text-black">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-100 dark:bg-slate-900 py-16 sm:px-6 text-center">
        <div className="section-container py-16 px-4 sm:px-6 text-center">
          <h2 className="text-red-600 font-bold uppercase text-sm mb-2">
            How it Works
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-red-700 dark:text-red-200 mb-4">
            Start Saving Lives in 4 Easy Steps
          </h3>
          <p className="text-gray-600 dark:text-gray-200 max-w-3xl mx-auto mb-12">
            Our streamlined process makes it easy to become a donor and start
            making a difference in your community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
            {[
              {
                step: '01',
                title: 'Registration',
                desc: 'Fill out a form to register as a donor. Your data is securely stored and used only when necessary.',
                icon: '📝',
              },
              {
                step: '02',
                title: 'Verification',
                desc: 'After registration, verify your information to ensure accuracy.',
                icon: '✅',
              },
              {
                step: '03',
                title: 'Participation in Donation',
                desc: 'Become a donor by registering as a donor.',
                icon: '❤️',
              },
              {
                step: '04',
                title: 'Emergency Request',
                desc: 'Submit urgent blood needs and receive immediate notifications from available donors in your area.',
                icon: '🚑',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded shadow-md relative"
              >
                <div className="absolute top-4 right-4 text-2xl font-bold text-gray-300">
                  {item.step}
                </div>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="text-lg font-semibold mb-2 text-gray-600">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
