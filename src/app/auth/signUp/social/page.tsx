'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialSignupFormData, SocialSignUpSchema } from '@/app/auth/schemas/SocialSignInSchema';
import FormInput from '@/components/form/SocialSignUpFormInput';
import FormButton from '@/components/form/FormButton';
import { jwtDecrypt } from '@/utils/jwtDecrypt';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DEV_API_URL = process.env.NEXT_PUBLIC_FRONT_URL;

const SocialSignUpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userData = searchParams.get('user');

  useEffect(() => {
    const fetchDecryptedUser = async () => {
      if (userData) {
        const decryptedUserData = await jwtDecrypt(userData);
        if (decryptedUserData) {
          setValue('email', decryptedUserData.email);
          setValue('username', decryptedUserData.username);
        } else {
          console.error('사용자 정보를 복호화할 수 없습니다.');
        }
      }
    };
    fetchDecryptedUser();
  }, [userData]);

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
    try {
      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.status !== 200) return;

      if (response.status === 200) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        router.push(`${DEV_API_URL}/auth/signIn`);
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
