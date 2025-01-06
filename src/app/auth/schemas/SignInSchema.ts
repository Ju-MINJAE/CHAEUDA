import { z } from 'zod';

export const SigninSchema = z.object({
  email: z
    .string()
    .email('유효한 이메일 주소를 입력해주세요.')
    .nonempty('이메일을 입력해주세요.'),

  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
    .max(20, '비밀번호는 최대 20자까지만 허용됩니다.'),
});

export type SigninForm = z.infer<typeof SigninSchema>;
