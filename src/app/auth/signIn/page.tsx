'use client';

import React, { useState } from 'react';
import { sendLoginRequest } from '@/api/auth';
import FormButton from '@/components/form/FormButton';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigninForm, SigninSchema } from '../schemas/SignInSchema';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { setAuthCookie } from '@/utils/cookieUtils';
import GoogleBtn from '@/components/GoogleBtn';

const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(SigninSchema),
  });

  const onSubmit = async (data: SigninForm) => {
    setLoading(true);
    setErrorMessages(null);

    const { email, password } = data;
    const response = await sendLoginRequest(email, password);

    if (response.success) {
      setAuthCookie('accessToken', response.tokens?.access || '');
      setAuthCookie('refreshToken', response.tokens?.refresh || '');

      if (response.user) {
        login(response.user, {
          access: response.tokens?.access || '',
          refresh: response.tokens?.refresh || '',
        });
      }
      router.push('/');
    } else {
      console.error('로그인 실패:', data);
      setErrorMessages(response.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">로그인</h1>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              이메일
            </label>
            <input
              type="email"
              id="email"
              placeholder="이메일을 입력하세요"
              {...register('email')}
              className="w-full px-4 py-2 mt-2 border focus:outline-none"
            />
          </div>
          {errors.email && <p className="mb-2 text-sm text-red-500">{errors.email.message}</p>}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              {...register('password')}
              className="w-full px-4 py-2 mt-2 border focus:outline-none"
            />
          </div>
          {errors.password && (
            <p className="mb-2 text-sm text-red-500">{errors.password.message}</p>
          )}
          {errorMessages && <p className="mb-2 text-sm text-red-500">{errorMessages}</p>}
          <FormButton>{loading ? '로그인 중...' : '로그인'}</FormButton>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            회원이 아니신가요?{' '}
            <Link href="/auth/signUp" className="border-b-2 border-gray-600">
              회원가입
            </Link>
          </p>
        </div>
        <GoogleBtn />
      </div>
    </div>
  );
};

export default SignIn;
