import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/auth.schema'
import { useForgotPasswordMutation } from '../hooks'
import { Button } from '@/shared/components/ui/button'
import { Loader2 } from 'lucide-react'

export const ForgotPasswordForm: React.FC = () => {
  const mutation = useForgotPasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutation.mutate(data)
  }

  if (mutation.isSuccess) {
    return (
      <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200'>
        <h3 className='text-green-800 font-medium'>Check your email</h3>
        <p className='text-green-700 text-sm mt-2'>
          If an account exists with that email, we have sent instructions to reset your password.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {mutation.isError && (
        <div className='p-3 text-sm text-red-600 bg-red-50 rounded-md'>
          {mutation.error.message || 'Failed to process request.'}
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-slate-700'>Email Address</label>
        <input
          {...register('email')}
          type='email'
          className='mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
        />
        {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
      </div>

      <Button
        type='submit'
        variant='default'
        className='w-full justify-center'
        disabled={mutation.isPending}
      >
        {mutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
        Send Reset Link
      </Button>
    </form>
  )
}
