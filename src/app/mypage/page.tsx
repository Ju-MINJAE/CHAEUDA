'use client';

import { sendWithdrawRequest } from '@/api/auth';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/form/SocialSignUpFormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialSignupFormData, SocialSignUpSchema } from '@/app/auth/schemas/SocialSignInSchema';
import { useEffect } from 'react';

const MyPage = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<SocialSignupFormData>({
    resolver: zodResolver(SocialSignUpSchema),
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
      disabled: true,
    },
    {
      label: '휴대폰번호',
      id: 'phone_number',
      type: 'phone',
      name: 'phone_number',
      disabled: true,
    },
  ];

  useEffect(() => {
    setValue('email', user?.email || '');
    setValue('username', user?.username || '');
    setValue('phone_number', user?.phone_number || '');
  }, [user, setValue]);

  const handleMyPageClick = () => {
    if (user) {
      router.push('/mypage/editMypage');
      return;
    }
  };

  const handleMyPostClick = () => {
    router.push('/mypage/myproducts');
  };

  // 회원 탈퇴 요청 함수
  const handleWithdraw = async () => {
    const confirmed = confirm('정말로 회원 탈퇴를 진행하시겠습니까?');
    if (!confirmed) return;
    try {
      const withdrawResponse = await sendWithdrawRequest();

      if (!withdrawResponse) {
        console.log('탈퇴 에러');
      }

      const logoutResponse = await fetch(`/auth/logout/api`);

      if (!logoutResponse.ok) {
        console.log('에러');
      }

      logout();
      router.push('/');
      console.log('회원 탈퇴 성공');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-9 pb-9 w-full h-full flex justify-center items-center ">
      <div className="flex flex-col w-[80%] sm:w-1/3 space-y-5">
        <div>
          <h1 className="text-2xl font-normal text-kick">마이페이지</h1>
        </div>
        {inputField.map(item => (
          <FormInput
            key={item.id}
            name={item.name as keyof SocialSignupFormData}
            label={item.label}
            id={item.id}
            type={item.type}
            register={register}
            disabled={item.disabled}
          />
        ))}
        <button onClick={handleMyPageClick} className="bg-kick w-full h-10 text-4 text-white">
          정보 수정
        </button>
        <button className="float-end text-kick" onClick={handleWithdraw}>
          회원 탈퇴
        </button>
        <button onClick={handleMyPostClick}>내 매물</button>
      </div>
    </div>
  );
};

export default MyPage;
