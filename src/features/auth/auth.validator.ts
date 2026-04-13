import z from 'zod';

export const GoogleAuthSchema = z.object({
  idToken: z.string().nonempty('Google token is required'),
});

export const AppleAuthSchema = z.object({
  identityToken: z.string().min(1, 'Apple token is required'),
  fullName: z
    .object({
      givenName: z.string().optional(),
      familyName: z.string().optional(),
    })
    .optional(),
  email: z.email('Valid email is required'),
});
