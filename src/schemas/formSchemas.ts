import { z } from 'zod';

export const FormSchema = z
  .object({
    username: z
      .string()
      .min(2, '이름은 최소 2자 이상이어야 합니다.')
      .max(30, '이름은 최대 30자까지만 허용됩니다.'),

    user_id: z
      .string()
      .min(6, '아이디는 최소 6자 이상이어야 합니다.')
      .max(20, '아이디는 최대 20자까지만 허용됩니다.')
      .regex(/^[a-zA-Z]+$/, '아이디는 영어만 포함할 수 있습니다.'),

    password: z
      .string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .max(20, '비밀번호는 최대 20자까지만 허용됩니다.')
      .refine(
        (password) => {
          const hasUpperCase = /[A-Z]/.test(password);
          const hasNumber = /\d/.test(password);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          return [hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length >= 2;
        },
        {
          message: '비밀번호는 대문자, 숫자, 특수문자 중 2가지를 포함해야 합니다.',
        }
      ),

    password_confirm: z
      .string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .max(20, '비밀번호는 최대 20자까지만 허용됩니다.'),

    phone_number: z
      .string()
      .regex(/^\d{10,11}$/, '휴대폰 번호는 10~11자리 숫자로 입력해주세요.'),

    email: z
      .string()
      .email('유효한 이메일 주소를 입력해주세요.')
      .nonempty('이메일을 입력해주세요.'),

    email_verificationCode: z.string().length(6, '인증번호를 정확히 입력해주세요.'),
  })
  .refine(data => data.password === data.password_confirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['password_confirm'],
  })
  .refine((data) => data.user_id !== data.password, {
    message: '아이디와 비밀번호는 동일할 수 없습니다.',
    path: ['password'],
  });

export type SignupFormData = z.infer<typeof FormSchema>;
