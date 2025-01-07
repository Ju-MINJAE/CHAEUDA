'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialSignupFormData, SocialSignUpSchema } from '@/app/auth/schemas/SocialSignInSchema';
import FormInput from '@/components/form/SocialSignUpFormInput';
import FormButton from '@/components/form/FormButton';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// import { NextResponse } from 'next/server';
// import { clearAuthCookies } from '@/utils/cookieUtils';

const SocialSignUpPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SocialSignupFormData>({
    resolver: zodResolver(SocialSignUpSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      username: '',
    },
  });

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts === undefined) return;
      if (parts.length === 2) {
        const cookieValue = parts.pop();
        if (cookieValue) {
          return cookieValue.split(';').shift();
        }
      }
      return null;
    };

    const userInfo = getCookie('user');
    if (userInfo) {
      const decodedUserInfo = JSON.parse(decodeURIComponent(userInfo));
      setValue('email', decodedUserInfo.email);
      setValue('username', decodedUserInfo.username);
    } else {
      console.log('사용자 정보가 없습니다.');
    }
  }, [setValue]);

  const inputField = [
    {
      label: '이메일 주소',
      id: 'email',
      type: 'email',
      name: 'email',
      disabled: true,
    },
    {
      label: '이름',
      id: 'username',
      type: 'text',
      name: 'username',
      placeholder: '이름을 입력하세요',
    },
    {
      label: '휴대폰번호',
      id: 'phone_number',
      type: 'phone',
      name: 'phone_number',
      placeholder: '휴대폰번호를 입력하세요',
    },
  ];

  // 최종 회원가입
  const onSubmit = async (data: SocialSignupFormData): Promise<void> => {
    if (data.phone_number === undefined) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.status !== 200) return;

      if (response.status === 200) {
        const data = await response.json();
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        router.push(`${BASE_URL}/auth/signIn`);
      }
    } catch (error) {
      alert(`회원가입 실패: ${error}`);
    }
  };

  return (
    <div className="pt-9 pb-9 w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[80%] sm:w-1/3 space-y-5">
        {inputField.map(item => (
          <FormInput
            key={item.id}
            name={item.name as keyof SocialSignupFormData}
            label={item.label}
            id={item.id}
            type={item.type}
            register={register}
            errorMessage={errors[item.name as keyof SocialSignupFormData]?.message}
            disabled={item.disabled}
            placeholder={item.placeholder}
          />
        ))}
        <FormButton>회원가입</FormButton>
      </form>
    </div>
  );
};

export default SocialSignUpPage;
