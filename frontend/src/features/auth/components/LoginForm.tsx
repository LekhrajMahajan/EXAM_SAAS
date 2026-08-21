import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/auth.schema'
import { useLoginMutation } from '../hooks'
import { Button } from '@/shared/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        // Redirect based on role
        if (response.data.user.role === 'Master Admin' || response.data.user.role === 'MASTER_ADMIN') {
          navigate('/master-admin/dashboard')
        } else if (response.data.user.role === 'Branch Manager') {
          navigate('/dashboard/branch-manager')
        } else {
          navigate('/dashboard')
        }
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {loginMutation.isError && (
        <div className='p-3 text-sm text-red-600 bg-red-50 rounded-md'>
          {loginMutation.error.message || 'Login failed. Please check your credentials.'}
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-slate-700'>Email Address</label>
        <input
          {...register('email')}
          type='email'
          className='mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          placeholder='admin@examguard.com'
        />
        {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-slate-700'>Password</label>
        <input
          {...register('password')}
          type='password'
          className='mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
        />
        {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
      </div>

      <Button
        type='submit'
        variant='default'
        className='w-full justify-center'
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
        Sign In
      </Button>
    </form>
  )
}
