'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormData, FormSchema } from '../schemas/SignUpSchema';
import FormInput from '@/components/form/SignUpFormInput';
import FormButton from '@/components/form/FormButton';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DEV_API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

const LocalSignUpPage = () => {
  const router = useRouter();
  // 이메일 인증버튼 비활성화
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  // 인증코드 검증버튼 비활성화
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  // 이메일 인증 버튼 클릭 후 문구
  const [verificationEmailMessage, setVerificationEmailMessage] = useState('');
  // 인증버튼 확인 클릭 후 문구
  const [verificationCodeMessage, setVerificationCodeMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onBlur',
  });

  const inputField = [
    {
      label: '이름',
      id: 'username',
      type: 'text',
      name: 'username',
      placeholder: '이름을 입력하세요',
    },
    {
      label: '비밀번호',
      id: 'password',
      type: 'password',
      name: 'password',
      placeholder: '비밀번호를 입력하세요',
    },
    {
      label: '비밀번호 확인',
      id: 'password_confirm',
      type: 'password',
      name: 'password_confirm',
      placeholder: '비밀번호를 한번 더 입력하세요',
    },
    {
      label: '휴대폰번호',
      id: 'phone_number',
      type: 'phone',
      name: 'phone_number',
      placeholder: '휴대폰번호를 입력하세요',
    },
  ];

  // 이메일 인증코드 전송
  const sendEmailVerificationCode = async (): Promise<void> => {
    const email = getValues('email');

    try {
      const response = await fetch(`${BASE_URL}/api/users/request-email-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.status !== 200) return;

      if (response.status === 200) {
        const { message } = await response.json();
        setVerificationEmailMessage(message);

        if (message === '인증번호가 이메일로 발송되었습니다. 이메일을 확인해주세요.') {
          setEmailVerificationSent(true);
          return;
        }
        return;
      }
      
    } catch (error) {
      alert(`인증번호 전송 실패: ${error}`);
    }
  };

  // 이메일 인증코드 검증
  const verifyEmailVerificationCode = async (): Promise<void> => {
    const email = getValues('email');
    const verificationCode = getValues('email_verificationCode');

    try {
      const response = await fetch(`${BASE_URL}/api/users/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (response.status !== 200) return;

      if (response.status === 200) {
        const { message } = await response.json();
        setVerificationCodeMessage(message);

        if (message === '이메일 인증이 완료되었습니다.') {
          setVerificationEmailMessage('');
          setIsEmailVerified(true);
          return;
        }
      }
    } catch (error) {
      alert(`이메일 인증 실패: ${error}`);
    }
  };

  // 최종 회원가입
  const onSubmit = async (data: SignupFormData): Promise<void> => {
    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
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

        {/* 이메일 주소 인풋 */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="email">이메일 주소</label>
          <div className="flex flex-col sm:flex-row sm:space-x-2 w-full">
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="이메일을 입력하세요"
              className="border border-gray-400 w-full h-9 text-4 p-2"
            />
            <button
              type="button"
              onClick={sendEmailVerificationCode}
              disabled={!watch('email') || emailVerificationSent}
              className={`w-full sm:w-28 h-9 text-[14px] cursor-pointer ${emailVerificationSent ? 'bg-gray-200 text-gray-500' : 'border border-gray-900'}`}
            >
              이메일 인증
            </button>
          </div>
          {verificationEmailMessage && (
            <p className="text-green-600 text-sm">{verificationEmailMessage}</p>
          )}
          {errors.email && <p className="text-kick text-sm">{errors.email.message}</p>}
        </div>

        {/* 이메일 인증번호 인풋 */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="authenticateEmail">이메일 인증번호</label>
          <div className="flex flex-col sm:flex-row sm:space-x-2">
            <input
              id="authenticateEmail"
              type="number"
              {...register('email_verificationCode')}
              className="border border-gray-400 w-full h-9 text-4 p-2"
              disabled={!emailVerificationSent}
              placeholder="이메일 인증번호를 입력하세요"
            />
            <button
              type="button"
              onClick={verifyEmailVerificationCode}
              disabled={isEmailVerified}
              className={`w-full sm:w-28 h-9 text-[14px] cursor-pointer ${isEmailVerified ? 'bg-gray-200 text-gray-500' : 'border border-gray-900'}`}
            >
              인증번호 확인
            </button>
          </div>
          {verificationCodeMessage && (
            <p className="text-green-600 text-sm">{verificationCodeMessage}</p>
          )}
          {errors.email_verificationCode && (
            <p className="text-kick text-sm">{errors.email_verificationCode.message}</p>
          )}
        </div>
        
        {/* 이메일, 인증번호 제외 인풋들 */}
        {inputField.map(item => (
          <FormInput
            key={item.id}
            name={item.name as keyof SignupFormData}
            label={item.label}
            id={item.id}
            type={item.type}
            register={register}
            errorMessage={errors[item.name as keyof SignupFormData]?.message}
            placeholder={item.placeholder}
          />
        ))}

        <FormButton>회원가입</FormButton>
      </form>
    </div>
  );
};

export default LocalSignUpPage;
