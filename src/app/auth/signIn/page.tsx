'use client';

import React, { useState } from 'react';
import { sendLoginRequest } from '@/api/auth';
import FormButton from '@/components/form/FormButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { setAuthCookie } from '@/utils/cookieUtils';
import SocialBtnContainer from '@/containers/SocialBtnContainer/SocialBtnContainer';

const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuthStore();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessages(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await sendLoginRequest(email, password);

    if (response.success) {
      setAuthCookie('accessToken', response.tokens?.access || '');
      setAuthCookie('refreshToken', response.tokens?.refresh || '');

      if (response.user) {
        login(response.user);
      }
      router.push('/');
    } else {
      setErrorMessages(response.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">로그인</h1>
        <form className="mt-6" onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-2 mt-2 border focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2 mt-2 border focus:outline-none"
            />
          </div>
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
        <hr className="my-4 border-gray-300" />
        <SocialBtnContainer />
      </div>
    </div>
  );
};

export default SignIn;
