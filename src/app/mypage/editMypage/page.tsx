'use client';

import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/form/SocialMypageFormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SocialEditMypageFormData,
  SocialEditMypageSchema,
} from '@/app/auth/schemas/SocialEditMypageSchema';
import { useEffect } from 'react';
import FormButton from '@/components/form/FormButton';
import useUpdateProfile from '@/hooks/useUpdateProfile';
import useFetchProfile from '@/hooks/useFetchProfile';

const MyPage = () => {
  const { login, user } = useAuthStore();
  const router = useRouter();
  const { updateProfile } = useUpdateProfile();
  const { getUpdateProfile } = useFetchProfile();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SocialEditMypageFormData>({
    resolver: zodResolver(SocialEditMypageSchema),
    mode: 'onBlur',
    defaultValues: {
      //   email: '',
      username: '',
      phone_number: '',
    },
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
      label: '휴대폰번호',
      id: 'phone_number',
      type: 'phone',
      name: 'phone_number',
      placeholder: '휴대폰번호를 입력하세요',
    },
  ];

  useEffect(() => {
    setValue('username', user?.username || '');
    setValue('phone_number', user?.phone_number || '');
  }, [user]);

  // 최종 수정 버튼 클릭
  const onSubmit = async (data: SocialEditMypageFormData): Promise<void> => {
    try {
      const result = await updateProfile(data);

      if (result.success) {
        const result = await getUpdateProfile();
        console.log(result);
        router.back();
        login(result.user);
      }
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
    }
  };

  return (
    <div className="pt-9 pb-9 w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[80%] sm:w-1/3 space-y-5">
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="email">이메일 주소</label>
          <input
            id="email"
            type="email"
            defaultValue={(user && user.email) || ''}
            className="border border-gray-400 w-full h-9 text-4 p-2"
            disabled={true}
          />
        </div>

        {inputField.map(item => (
          <FormInput
            key={item.id}
            name={item.name as keyof SocialEditMypageFormData}
            label={item.label}
            id={item.id}
            type={item.type}
            register={register}
            errorMessage={errors[item.name as keyof SocialEditMypageFormData]?.message}
            placeholder={item.placeholder}
          />
        ))}
        <FormButton>정보 수정 완료</FormButton>
      </form>
    </div>
  );
};

export default MyPage;
