import { z } from 'zod';

/**
 * Validation schema for staff registration form.
 */
export const registerNewStaffFormSchema = z.object({
  surname: z.string().min(1, 'Surname is required'),
  otherNames: z.string().min(1, 'Other names is required.'),
  dateOfBirth: z.date({
    required_error: 'A date of birth is required.',
  }),
  idPhoto: z.any().optional(),
  uniqueCode: z
    .string()
    .length(10, 'Unique code must be exactly 10 digits.')
    .regex(/^\d+$/, 'Unique code must contain only digits.'),
});

/** Validation schema for admin login form */
export const adminLoginFormSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});
