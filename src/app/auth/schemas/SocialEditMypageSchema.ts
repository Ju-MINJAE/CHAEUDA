import { z } from 'zod';

export const SocialEditMypageSchema = z
  .object({
    username: z
      .string()
      .min(2, '이름은 최소 2자 이상이어야 합니다.')
      .max(30, '이름은 최대 30자까지만 허용됩니다.')
      .regex(/^[^\p{Emoji_Presentation}\p{Symbol}\p{Punctuation}\s]*$/u, '이름에는 이모티콘, 기호, 공백이 포함될 수 없습니다.'),

    phone_number: z
      .string()
      .regex(/^01[0-9]\d{7,8}$/, '휴대폰 번호를 다시 입력해주세요.'),
  })

export type SocialEditMypageFormData = z.infer<typeof SocialEditMypageSchema>;