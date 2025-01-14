import { z } from 'zod';

export const EditPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .max(20, '비밀번호는 최대 20자까지만 허용됩니다.')
      .refine(
        password => {
          const hasUpperCase = /[A-Z]/.test(password);
          const hasLowerCase = /[a-z]/.test(password);
          const hasNumber = /\d/.test(password);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          return hasUpperCase && hasLowerCase && (hasNumber || hasSpecialChar);
        },
        {
          message: '비밀번호는 대문자, 소문자, 숫자 또는 특수문자를 반드시 포함해야 합니다.',
        },
      ),

    password_confirm: z
      .string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .max(20, '비밀번호는 최대 20자까지만 허용됩니다.'),
  })
  .refine(data => data.password === data.password_confirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['password_confirm'],
  });

export type EditPasswordFormData = z.infer<typeof EditPasswordSchema>;
