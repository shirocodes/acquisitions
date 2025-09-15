import {z} from 'zod'

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255, 'Name is too long').trim(),
  email: z.string().email('Invalid email address').max(255, 'Email is too long').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password is too long'),
  role: z.enum(['user', 'admin']).default('user'),
})

export const signinSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email is too long').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password is too long'),
})