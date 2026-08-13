import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useUserStore } from '@/stores/user/user.store'
import apiClient from '@/core/api/http/axios-client'
import { toast } from 'react-hot-toast'
import {
  Building2,
  MapPin,
  Palette,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Lock,
  Check,
  Globe,
  DollarSign,
  Clock,
  KeyRound,
  LayoutTemplate,
  Users2,
  FolderTree,
} from 'lucide-react'

export const CompanyOnboardingPage: React.FC = () => {
  const { profile, setProfile } = useUserStore()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [companyInfo, setCompanyInfo] = useState({
    companyName: profile?.name || '',
    legalName: '',
    companyCode: 'EXAM-ORG',
    email: profile?.email || '',
    supportEmail: '',
    phone: '',
    website: '',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'en',
  })

  const [address, setAddress] = useState({
    country: 'India',
    state: 'Delhi',
    district: '',
    city: 'New Delhi',
    pincode: '110001',
    street: '',
  })

  const [branding, setBranding] = useState({
    primaryColor: '#0284c7', // Sky 600
    secondaryColor: '#1e40af', // Blue 800
    theme: 'system' as 'light' | 'dark' | 'system',
    companyLogo: '',
    favicon: '',
    isEnabled: true,
  })

  const [smtp, setSmtp] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    username: '',
    password: '',
    encryption: 'TLS' as 'TLS' | 'SSL' | 'NONE',
    senderName: profile?.name || 'Exam Portal',
    senderEmail: profile?.email || 'noreply@examportal.com',
    isEnabled: false,
  })

  const [systemPreferences, setSystemPreferences] = useState({
    academicYear: '2026-2027',
    financialYear: '2026-2027',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24H' as '12H' | '24H',
    weekStart: 'Monday' as 'Monday' | 'Sunday',
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSpecialChars: true,
      requireUppercase: true,
    },
  })

  // Guard checks
  if (profile?.onboardingCompleted) {
    return <Navigate to='/company/dashboard' replace />
  }
  if (!profile?.subscriptionPlan) {
    return <Navigate to='/company/subscription' replace />
  }

  const planFeatures = profile?.planFeatures || {}
  const hasCustomBranding =
    planFeatures?.customBranding === true || profile?.subscriptionPlan !== 'STARTER'
  const hasCustomSmtp =
    planFeatures?.customSmtp === true || profile?.subscriptionPlan === 'ENTERPRISE'

  const handleComplete = async () => {
    try {
      setIsSubmitting(true)
      const payload = {
        companyInfo,
        address,
        branding,
        smtp,
        systemPreferences,
      }

      const { data } = await apiClient.post('/onboarding/complete', payload)

      if (data && data.success) {
        toast.success('🎉 Platform successfully initialized and ready for deployment!')
        // Re-fetch profile or update store state directly
        if (profile) {
          setProfile({ ...profile, onboardingCompleted: true })
        }
        navigate('/company/dashboard', { replace: true })
      } else {
        toast.error(data?.message || 'Failed to complete onboarding setup.')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error occurred during tenant initialization.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 1, title: 'Identity', icon: Building2, desc: 'Organization details' },
    { id: 2, title: 'HQ Setup', icon: MapPin, desc: 'Headquarters & defaults' },
    { id: 3, title: 'Branding', icon: Palette, desc: 'Theme & White-labeling' },
    { id: 4, title: 'Gateways', icon: Mail, desc: 'Email & SMTP setup' },
    { id: 5, title: 'Policies', icon: ShieldCheck, desc: 'Security & fiscal terms' },
    { id: 6, title: 'Launch', icon: Sparkles, desc: 'Review & Initialize' },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 md:p-8 selection:bg-indigo-500 selection:text-white'>
      {/* Top Header */}
      <header className='max-w-6xl w-full mx-auto flex items-center justify-between mb-8 pb-4 border-b border-white/10'>
        <div className='flex items-center gap-3'>
          <div className='p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'>
            <Sparkles className='w-6 h-6 animate-pulse' />
          </div>
          <div>
            <h1 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent'>
              Tenant Onboarding & Initialization
            </h1>
            <p className='text-xs md:text-sm text-slate-400'>
              Configure your multi-tenant exam cloud in 6 quick steps
            </p>
          </div>
        </div>
        <div className='hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md'>
          <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping' />
          <span className='text-xs font-semibold tracking-wider uppercase text-emerald-300'>
            {profile?.subscriptionPlan || 'ACTIVE'} Plan Activated
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className='max-w-5xl w-full mx-auto flex-1 flex flex-col gap-8'>
        {/* Step Navigation Bar */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 bg-white/5 border border-white/10 p-2 sm:p-4 rounded-2xl backdrop-blur-xl'>
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep

            return (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id <= currentStep) setCurrentStep(step.id)
                }}
                disabled={step.id > currentStep}
                className={`flex flex-col items-start p-3 rounded-xl transition-all duration-300 text-left border ${
                  isCurrent
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-indigo-400/50 shadow-lg shadow-indigo-500/20'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-transparent text-slate-500 border-transparent cursor-not-allowed'
                }`}
              >
                <div className='flex items-center justify-between w-full mb-2'>
                  <Icon className='w-5 h-5' />
                  {isCompleted && <CheckCircle2 className='w-4 h-4 text-emerald-400' />}
                  {isCurrent && (
                    <span className='text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold'>
                      NOW
                    </span>
                  )}
                </div>
                <span className='text-xs font-bold truncate w-full'>
                  {step.id}. {step.title}
                </span>
                <span className='text-[11px] opacity-75 truncate w-full hidden md:block'>
                  {step.desc}
                </span>
              </button>
            )
          })}
        </div>

        {/* Wizard Form Cards */}
        <div className='bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden min-h-[440px] flex flex-col justify-between'>
          {/* Subtle Ambient Glow */}
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none' />
          <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none' />

          {/* Step 1: Organization Identity */}
          {currentStep === 1 && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div>
                <h2 className='text-xl font-bold text-white mb-1'>
                  Organization & Tenant Identity
                </h2>
                <p className='text-sm text-slate-400'>
                  Provide core identification details for your institution or testing enterprise.
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    Company Name *
                  </label>
                  <input
                    type='text'
                    value={companyInfo.companyName}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, companyName: e.target.value })
                    }
                    className='w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                    placeholder='e.g. Apex Global Testing Academy'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    Legal Registered Name
                  </label>
                  <input
                    type='text'
                    value={companyInfo.legalName}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, legalName: e.target.value })}
                    className='w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                    placeholder='e.g. Apex Edutech Pvt Ltd'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    Tenant Code / Slug *
                  </label>
                  <input
                    type='text'
                    value={companyInfo.companyCode}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, companyCode: e.target.value.toUpperCase() })
                    }
                    className='w-full font-mono bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-indigo-300 uppercase placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                    placeholder='EXAM-ORG'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    Primary Contact Email *
                  </label>
                  <input
                    type='email'
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    className='w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1'>
                    <Globe className='w-3.5 h-3.5 text-indigo-400' /> Default Timezone *
                  </label>
                  <select
                    value={companyInfo.timezone}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, timezone: e.target.value })}
                    className='w-full bg-slate-800 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                  >
                    <option value='Asia/Kolkata'>(UTC+05:30) Asia - Kolkata</option>
                    <option value='America/New_York'>(UTC-05:00) America - New York</option>
                    <option value='Europe/London'>(UTC+00:00) Europe - London</option>
                    <option value='UTC'>UTC Universal Coordinated Time</option>
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1'>
                    <DollarSign className='w-3.5 h-3.5 text-emerald-400' /> Base Currency *
                  </label>
                  <select
                    value={companyInfo.currency}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, currency: e.target.value })}
                    className='w-full bg-slate-800 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                  >
                    <option value='INR'>INR (₹) Indian Rupee</option>
                    <option value='USD'>USD ($) US Dollar</option>
                    <option value='EUR'>EUR (€) Euro</option>
                    <option value='GBP'>GBP (£) British Pound</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: HQ Setup */}
          {currentStep === 2 && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div>
                <h2 className='text-xl font-bold text-white mb-1'>
                  Headquarters & Default Center Setup
                </h2>
                <p className='text-sm text-slate-400'>
                  We will automatically generate your default HQ Branch (
                  <span className='text-indigo-300 font-mono'>HQ-001</span>) and initial Exam Center
                  (<span className='text-indigo-300 font-mono'>MAIN-01</span>) based on this
                  address.
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    Country *
                  </label>
                  <input
                    type='text'
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className='w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    State / Province *
                  </label>
                  <input
                    type='text'
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className='w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    City / Town *
                  </label>
                  <input
                    type='text'
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className='w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                <div className='sm:col-span-2'>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    Street Address / Landmark *
                  </label>
                  <input
                    type='text'
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder='e.g. 4th Floor, Tech Park Tower, Sector 62'
                    className='w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2'>
                    Postal / Zip Code *
                  </label>
                  <input
                    type='text'
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className='w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                  />
                </div>
              </div>

              <div className='p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-3'>
                <LayoutTemplate className='w-5 h-5 text-indigo-400 shrink-0 mt-0.5' />
                <div>
                  <span className='font-semibold block text-white mb-1'>
                    Automated Tenant Structuring
                  </span>
                  Upon finalization, the system creates your operational hierarchy: Company Admin
                  &rarr; Head Office Branch &rarr; Main Exam Center &rarr; Default Examination Rooms
                  with seat capacity grids.
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Branding */}
          {currentStep === 3 && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                  <h2 className='text-xl font-bold text-white mb-1'>
                    White-Label & Branding Customizer
                  </h2>
                  <p className='text-sm text-slate-400'>
                    Tailor candidate and staff dashboards with your institution&apos;s color theme
                    and logos.
                  </p>
                </div>
                {!hasCustomBranding ? (
                  <div className='inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold'>
                    <Lock className='w-4 h-4' /> Professional & Enterprise Feature
                  </div>
                ) : (
                  <div className='inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold'>
                    <Check className='w-4 h-4' /> Enabled on Your Plan
                  </div>
                )}
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  !hasCustomBranding ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className='space-y-5 bg-white/5 border border-white/10 p-5 rounded-2xl'>
                  <h3 className='text-sm font-bold text-white flex items-center gap-2'>
                    <Palette className='w-4 h-4 text-indigo-400' /> Theme Palette Selection
                  </h3>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-2'>
                        Primary Accent Color
                      </label>
                      <div className='flex items-center gap-3'>
                        <input
                          type='color'
                          value={branding.primaryColor}
                          onChange={(e) =>
                            setBranding({ ...branding, primaryColor: e.target.value })
                          }
                          className='w-12 h-10 rounded-xl cursor-pointer bg-transparent border-0'
                        />
                        <span className='text-xs font-mono uppercase text-slate-300'>
                          {branding.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-2'>
                        Secondary Header Color
                      </label>
                      <div className='flex items-center gap-3'>
                        <input
                          type='color'
                          value={branding.secondaryColor}
                          onChange={(e) =>
                            setBranding({ ...branding, secondaryColor: e.target.value })
                          }
                          className='w-12 h-10 rounded-xl cursor-pointer bg-transparent border-0'
                        />
                        <span className='text-xs font-mono uppercase text-slate-300'>
                          {branding.secondaryColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-2'>
                      Default Theme Mode
                    </label>
                    <div className='grid grid-cols-3 gap-2'>
                      {['light', 'dark', 'system'].map((m) => (
                        <button
                          key={m}
                          type='button'
                          onClick={() => setBranding({ ...branding, theme: m as any })}
                          className={`py-2 text-xs font-bold rounded-lg uppercase border transition ${
                            branding.theme === m
                              ? 'bg-indigo-600 text-white border-indigo-400'
                              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className='bg-slate-950 border border-white/10 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden'>
                  <div className='text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider'>
                    Dashboard UI Preview
                  </div>
                  <div
                    className='p-4 rounded-xl border border-white/10 shadow-lg text-white space-y-3'
                    style={{ backgroundColor: branding.secondaryColor }}
                  >
                    <div className='flex items-center justify-between border-b border-white/20 pb-2'>
                      <span className='font-bold text-sm tracking-wide'>
                        {companyInfo.companyName || 'Exam Org'} Portal
                      </span>
                      <span className='text-[10px] bg-white/20 px-2 py-0.5 rounded'>ONLINE</span>
                    </div>
                    <p className='text-xs text-white/80'>
                      Welcome to your white-labeled assessment platform.
                    </p>
                    <div className='flex justify-end'>
                      <button
                        type='button'
                        className='px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow'
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        Start Assessment
                      </button>
                    </div>
                  </div>
                  <div className='text-[11px] text-slate-500 mt-3 italic'>
                    {hasCustomBranding
                      ? 'Colors will reflect across candidate login & exam arenas.'
                      : 'Default platform styling will apply for Starter tier.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Gateways & SMTP */}
          {currentStep === 4 && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                  <h2 className='text-xl font-bold text-white mb-1'>
                    Communication Gateways & SMTP
                  </h2>
                  <p className='text-sm text-slate-400'>
                    Configure outbound email delivery for admit cards, OTP verification, and score
                    reports.
                  </p>
                </div>
                {!hasCustomSmtp ? (
                  <div className='inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-xs font-bold'>
                    <span>Using Shared SaaS Gateway</span>
                  </div>
                ) : (
                  <div className='inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold'>
                    <Check className='w-4 h-4' /> Dedicated SMTP Enabled
                  </div>
                )}
              </div>

              <div className='bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5'>
                <div className='flex items-center justify-between border-b border-white/10 pb-4'>
                  <div>
                    <h3 className='text-sm font-bold text-white'>
                      Use Custom Dedicated SMTP Server
                    </h3>
                    <p className='text-xs text-slate-400'>
                      Send notifications from your institution&apos;s custom domain (e.g.
                      exams@youruniversity.edu)
                    </p>
                  </div>
                  <input
                    type='checkbox'
                    checked={smtp.isEnabled && hasCustomSmtp}
                    disabled={!hasCustomSmtp}
                    onChange={(e) => setSmtp({ ...smtp, isEnabled: e.target.checked })}
                    className='w-5 h-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50'
                  />
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                    !smtp.isEnabled || !hasCustomSmtp ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1'>
                      SMTP Host
                    </label>
                    <input
                      type='text'
                      value={smtp.host}
                      onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                      placeholder='smtp.gmail.com'
                      className='w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1'>Port</label>
                    <input
                      type='number'
                      value={smtp.port}
                      onChange={(e) => setSmtp({ ...smtp, port: parseInt(e.target.value) || 587 })}
                      className='w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1'>
                      Sender Name
                    </label>
                    <input
                      type='text'
                      value={smtp.senderName}
                      onChange={(e) => setSmtp({ ...smtp, senderName: e.target.value })}
                      className='w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1'>
                      Sender Email
                    </label>
                    <input
                      type='email'
                      value={smtp.senderEmail}
                      onChange={(e) => setSmtp({ ...smtp, senderEmail: e.target.value })}
                      className='w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Policies */}
          {currentStep === 5 && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div>
                <h2 className='text-xl font-bold text-white mb-1'>
                  System Preferences & Security Policies
                </h2>
                <p className='text-sm text-slate-400'>
                  Set up calendar structures and enforce authentication hardening for staff members.
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4'>
                  <h3 className='text-sm font-bold text-white flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-indigo-400' /> Operational Calendar
                  </h3>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5'>
                      Current Academic / Exam Session
                    </label>
                    <input
                      type='text'
                      value={systemPreferences.academicYear}
                      onChange={(e) =>
                        setSystemPreferences({ ...systemPreferences, academicYear: e.target.value })
                      }
                      className='w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-sm text-white'
                      placeholder='2026-2027'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5'>
                      Time Display Format
                    </label>
                    <div className='grid grid-cols-2 gap-3'>
                      {['12H', '24H'].map((tf) => (
                        <button
                          key={tf}
                          type='button'
                          onClick={() =>
                            setSystemPreferences({ ...systemPreferences, timeFormat: tf as any })
                          }
                          className={`py-2 text-xs font-bold rounded-lg border transition ${
                            systemPreferences.timeFormat === tf
                              ? 'bg-indigo-600 text-white border-indigo-400'
                              : 'bg-white/5 text-slate-400 border-white/10'
                          }`}
                        >
                          {tf} Format
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4'>
                  <h3 className='text-sm font-bold text-white flex items-center gap-2'>
                    <KeyRound className='w-4 h-4 text-emerald-400' /> Password Complexity
                    Enforcement
                  </h3>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5'>
                      Inactivity Session Timeout (Minutes)
                    </label>
                    <input
                      type='number'
                      value={systemPreferences.sessionTimeout}
                      onChange={(e) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          sessionTimeout: parseInt(e.target.value) || 30,
                        })
                      }
                      className='w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-sm text-white'
                    />
                  </div>
                  <div className='space-y-2 pt-1'>
                    {[
                      { key: 'requireUppercase', label: 'Require at least 1 uppercase character' },
                      { key: 'requireNumbers', label: 'Require alphanumeric numbers' },
                      {
                        key: 'requireSpecialChars',
                        label: 'Require symbolic special characters (!@#$%)',
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className='flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer'
                      >
                        <input
                          type='checkbox'
                          checked={(systemPreferences.passwordPolicy as any)[item.key]}
                          onChange={(e) =>
                            setSystemPreferences({
                              ...systemPreferences,
                              passwordPolicy: {
                                ...systemPreferences.passwordPolicy,
                                [item.key]: e.target.checked,
                              },
                            })
                          }
                          className='w-4 h-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500'
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Launch */}
          {currentStep === 6 && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div className='text-center sm:text-left'>
                <h2 className='text-2xl font-bold text-white mb-1'>
                  Ready to Deploy & Initialize Tenant
                </h2>
                <p className='text-sm text-slate-400'>
                  Review your automated bootstrapping summary below before triggering deployment.
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg'>
                  <div>
                    <Users2 className='w-8 h-8 text-indigo-400 mb-3' />
                    <h4 className='text-base font-bold text-white mb-1'>15-Tier Role Hierarchy</h4>
                    <p className='text-xs text-slate-300 leading-relaxed'>
                      Auto-generating granular access profiles: Branch Managers, Exam Proctors, AI
                      Monitors, Paper Setters, and Observers.
                    </p>
                  </div>
                  <div className='mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-indigo-300'>
                    <span>Plan Access Control</span>
                    <CheckCircle2 className='w-4 h-4 text-emerald-400' />
                  </div>
                </div>

                <div className='bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg'>
                  <div>
                    <Building2 className='w-8 h-8 text-blue-400 mb-3' />
                    <h4 className='text-base font-bold text-white mb-1'>HQ & Exam Center Grid</h4>
                    <p className='text-xs text-slate-300 leading-relaxed'>
                      Bootstrapping{' '}
                      <span className='text-white font-semibold'>Head Office (HQ-001)</span> and{' '}
                      <span className='text-white font-semibold'>Main Exam Center (MAIN-01)</span>{' '}
                      ready for scheduling shifts.
                    </p>
                  </div>
                  <div className='mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-blue-300'>
                    <span>Infrastructure Grid</span>
                    <CheckCircle2 className='w-4 h-4 text-emerald-400' />
                  </div>
                </div>

                <div className='bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg'>
                  <div>
                    <FolderTree className='w-8 h-8 text-emerald-400 mb-3' />
                    <h4 className='text-base font-bold text-white mb-1'>Storage & Mail Catalogs</h4>
                    <p className='text-xs text-slate-300 leading-relaxed'>
                      Initializing storage vaults for Admit Cards, Biometrics, Result PDFs, and
                      default notification templates.
                    </p>
                  </div>
                  <div className='mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-300'>
                    <span>{profile?.subscriptionPlan || 'SaaS'} Vault Cap</span>
                    <CheckCircle2 className='w-4 h-4 text-emerald-400' />
                  </div>
                </div>
              </div>

              <div className='bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-sm text-emerald-200'>
                <Sparkles className='w-6 h-6 text-emerald-400 shrink-0' />
                <span>
                  Clicking Complete will commit your configurations to database and redirect you
                  directly to your tailored SaaS Operational Dashboard!
                </span>
              </div>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className='mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4'>
            <button
              type='button'
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1 || isSubmitting}
              className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition'
            >
              <ArrowLeft className='w-4 h-4' /> Previous
            </button>

            <div className='text-xs font-semibold text-slate-500 hidden sm:block'>
              Step {currentStep} of 6
            </div>

            {currentStep < 6 ? (
              <button
                type='button'
                onClick={() => {
                  if (currentStep === 1 && (!companyInfo.companyName || !companyInfo.companyCode)) {
                    toast.error('Please fill in required organization details.')
                    return
                  }
                  setCurrentStep((prev) => Math.min(6, prev + 1))
                }}
                className='flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition transform hover:scale-[1.02]'
              >
                Next Step <ArrowRight className='w-4 h-4' />
              </button>
            ) : (
              <button
                type='button'
                onClick={handleComplete}
                disabled={isSubmitting}
                className='flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 transition transform hover:scale-[1.03] disabled:opacity-50'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' /> Initializing Tenant...
                  </>
                ) : (
                  <>
                    <Sparkles className='w-5 h-5' /> Complete & Launch Platform
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='max-w-6xl w-full mx-auto mt-8 pt-4 border-t border-white/5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2'>
        <span>© 2026 Practice Exam SaaS — Cloud Examination Engine</span>
        <span>Secure Multi-Tenant Infrastructure</span>
      </footer>
    </div>
  )
}
