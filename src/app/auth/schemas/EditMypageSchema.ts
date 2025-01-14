import { z } from 'zod';

export const EditMypageSchema = z
  .object({
    username: z
      .string()
      .min(2, '이름은 최소 2자 이상이어야 합니다.')
      .max(30, '이름은 최대 30자까지만 허용됩니다.')
      .regex(
        /^[^\p{Emoji_Presentation}\p{Symbol}\p{Punctuation}\s]*$/u,
        '이름에는 이모티콘, 기호, 공백이 포함될 수 없습니다.',
      ),

    phone_number: z.string().regex(/^01[0-9]\d{7,8}$/, '휴대폰 번호를 다시 입력해주세요.'),

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
      )
      .optional()
      .or(z.literal('')),

    password_confirm: z
      .string()
      .optional()
      .or(z.literal('')),
  })
  .refine(
    data => {
      if (!data.password && !data.password_confirm) {
        return true;
      }
      return data.password === data.password_confirm;
    },
    {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['password_confirm'],
    },
  );

export type EditMypageFormData = z.infer<typeof EditMypageSchema>;
