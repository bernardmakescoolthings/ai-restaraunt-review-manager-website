'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { FormEvent, useState, useRef } from 'react'

interface Feature {
  name: string;
  description: string;
}

const features: Feature[] = [
  {
    name: 'Automated Data Ingestion',
    description: 'Integrates with platforms like Google via secure APIs to fetch review data in real time, ensuring you always have the latest customer feedback.',
  },
  {
    name: 'Personalized LLM-Based Response Generation',
    description: 'Craft personalized, genuine responses that mirror your brand\'s identity to ensure customer satisfaction.',
  },
  {
    name: 'Timely Response Notifications',
    description: 'Quick response times are crucial, get notified with every new review or when a review is under a threshold, to ensure top-notch service and keep your customers happy.',
  },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        "project_name": "ai-resteraunt-review-manager",
        "email": email,
      };
      
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch('/api/add_emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit email. Please try again.')
      }

      setSuccess(true)
      formRef.current?.reset() // Clear the form using the ref
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation - Apple-style minimal nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-6 py-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-medium tracking-tight text-slate-800">Replixe AI</span>
            </motion.div>
            <motion.div 
              className="flex gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                How it works
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hero Section - Apple-style large typography */}
      <div className="relative isolate pt-40 pb-24 sm:pt-48 sm:pb-32">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-100 to-indigo-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1 
              className="text-5xl font-bold tracking-tight text-slate-800 sm:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Transform Your Restaurant Reviews with AI
            </motion.h1>
            <motion.p 
              className="mt-12 text-2xl leading-9 text-slate-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Harness the power of artificial intelligence to manage, analyze, and improve your restaurant&apos;s online presence.
            </motion.p>
            
            {/* Email Capture Form - Apple-style minimal form */}
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} ref={formRef} className="mx-auto flex max-w-xl gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="min-w-0 flex-auto rounded-full border-0 px-8 py-4 text-lg text-slate-800 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-base sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-none rounded-full bg-indigo-500 px-8 py-4 text-lg font-medium text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Joining...' : 'Join Waitlist'}
                  {!isLoading && <ArrowRightIcon className="ml-2 -mr-1 h-6 w-6 inline-block" aria-hidden="true" />}
                </button>
              </form>
              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
              {success && (
                <p className="mt-4 text-sm text-green-600">Thank you for joining our waitlist!</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key Features - Apple-style feature showcase */}
      <div className="py-32 sm:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center">
            <p className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
              Everything you need to manage reviews
            </p>
          </div>
          <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div 
                  key={feature.name}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <dt className="text-2xl font-semibold leading-7 text-slate-800">
                    {feature.name}
                  </dt>
                  <dd className="mt-6 flex flex-auto flex-col text-lg leading-7 text-slate-500">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white py-32 sm:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center mb-16">
            <motion.p 
              className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              The Impact of Review Management
            </motion.p>
          </div>
          
          {/* Main Statistic */}
          <div className="relative isolate">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-100 to-blue-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
            </div>
            
            <motion.div 
              className="mx-auto max-w-4xl text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl font-bold text-indigo-500 mb-4">85%</div>
              <p className="text-2xl font-semibold text-slate-800 mb-6">of restaurants don't respond to reviews</p>
              <p className="text-lg text-slate-500">Stand out from the competition by actively engaging with your customers through timely and thoughtful responses.</p>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div 
                className="bg-slate-50 p-8 rounded-2xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Business Impact</h3>
                <p className="text-slate-500">Enhance your online presence with timely responses that boost customer satisfaction and improve local search rankings.</p>
              </motion.div>
              <motion.div 
                className="bg-slate-50 p-8 rounded-2xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Prompt Engagement</h3>
                <p className="text-slate-500">Fast responses demonstrate your business's attentiveness and commitment to customer satisfaction, building trust and reliability.</p>
              </motion.div>

              <motion.div 
                className="bg-slate-50 p-8 rounded-2xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Brand Protection</h3>
                <p className="text-slate-500">Take control of your narrative by actively monitoring and addressing feedback, safeguarding your brand's reputation in the digital space.</p>
              </motion.div>

              <motion.div 
                className="bg-slate-50 p-8 rounded-2xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Customer Trust</h3>
                <p className="text-slate-500">Build lasting relationships by showing empathy, addressing concerns promptly, and acknowledging customer feedback with genuine appreciation.</p>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* How It Works - Timeline-style process visualization */}
      <div id="how-it-works" className="bg-slate-50 py-32 sm:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center mb-20">
            <motion.p 
              className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How Our AI Review Manager Works
            </motion.p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 transform h-full w-0.5 bg-indigo-200"></div>

            {/* Step 1 */}
            <motion.div 
              className="relative mb-20"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="w-full pl-16">
                  <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800">Data Collection</h3>
                    </div>
                    <p className="text-slate-500">Automatically gather reviews from major platforms like Yelp, Google, and TripAdvisor in real-time.</p>
                  </div>
                </div>
                <div className="absolute left-8 transform -translate-x-1/2 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white"></div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="relative mb-20"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center">
                <div className="w-full pl-16">
                  <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800">AI Analysis</h3>
                    </div>
                    <p className="text-slate-500">Our AI analyzes sentiment, identifies trends, and extracts key insights from customer feedback.</p>
                  </div>
                </div>
                <div className="absolute left-8 transform -translate-x-1/2 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white"></div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center">
                <div className="w-full pl-16">
                  <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800">Actionable Insights</h3>
                    </div>
                    <p className="text-slate-500">Get detailed reports and recommendations to improve your restaurant's performance and customer satisfaction.</p>
                  </div>
                </div>
                <div className="absolute left-8 transform -translate-x-1/2 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Testimonials - Apple-style customer stories */}
      {/*
      <div className="py-32 sm:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
              Loved by Restaurant Owners
            </p>
          </div>
          <div className="mx-auto mt-20 flow-root max-w-2xl sm:mt-24 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div 
                className="flex flex-col justify-between bg-white p-10 ring-1 ring-slate-200 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <p className="text-xl leading-8 text-slate-500">
                    "Judy has transformed how we handle customer reviews. The automated responses are spot-on and save us hours every week."
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                    <span className="text-xl font-semibold text-indigo-600">JD</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-6 text-slate-800">John Doe</h4>
                    <p className="text-sm leading-6 text-slate-500">Owner, The Golden Plate</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col justify-between bg-white p-10 ring-1 ring-slate-200 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div>
                  <p className="text-xl leading-8 text-slate-500">
                    "The analytics dashboard gives us incredible insights into customer sentiment. It's like having a data scientist on our team."
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                    <span className="text-xl font-semibold text-indigo-600">AS</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-6 text-slate-800">Alice Smith</h4>
                    <p className="text-sm leading-6 text-slate-500">Manager, Taste of Italy</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col justify-between bg-white p-10 ring-1 ring-slate-200 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div>
                  <p className="text-xl leading-8 text-slate-500">
                    "The real-time notifications help us respond to negative reviews quickly, turning potential issues into opportunities."
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                    <span className="text-xl font-semibold text-indigo-600">MJ</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-6 text-slate-800">Mike Johnson</h4>
                    <p className="text-sm leading-6 text-slate-500">Executive Chef, Fusion Kitchen</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      */}
      {/* FAQ - Apple-style minimal FAQ */}
      <div className="bg-white py-32 sm:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center">
            <p className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
              Frequently Asked Questions
            </p>
          </div>
          <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <dt className="text-2xl font-semibold leading-7 text-slate-800">
                  How does the automated response system work?
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-lg leading-7 text-slate-500">
                  <p className="flex-auto">
                    Our AI analyzes the sentiment and content of each review, then generates contextually appropriate responses that match your brand's tone and style. You can review and customize these responses before sending them.
                  </p>
                </dd>
              </motion.div>

              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <dt className="text-2xl font-semibold leading-7 text-slate-800">
                  Which review platforms do you support?
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-lg leading-7 text-slate-500">
                  <p className="flex-auto">
                    We are currently providing support for Google Reviews. We have plans to continue adding support for more platforms (Yelp, TripAdvisor, etc.) based on our customers' needs.
                  </p>
                </dd>
              </motion.div>

              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <dt className="text-2xl font-semibold leading-7 text-slate-800">
                  How secure is my data?
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-lg leading-7 text-slate-500">
                  <p className="flex-auto">
                    We use industry-standard encryption and security measures to protect your data. All API integrations are secure and compliant with relevant data protection regulations.
                  </p>
                </dd>
              </motion.div>

              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <dt className="text-2xl font-semibold leading-7 text-slate-800">
                  Can I customize the AI responses?
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-lg leading-7 text-slate-500">
                  <p className="flex-auto">
                    Yes! You can set your brand's tone, style, and key phrases. The AI will incorporate these preferences into all generated responses while maintaining authenticity.
                  </p>
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  )
}
