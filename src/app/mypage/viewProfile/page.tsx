'use client';

import useAuthStore from '@/stores/authStore';
import FormInput from '@/components/form/SocialSignUpFormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialSignupFormData, SocialSignUpSchema } from '@/app/auth/schemas/SocialSignInSchema';
import { useEffect } from 'react';

interface EditProfileProps {
  handleToggle: () => void;
}

const ViewProfile = ({ handleToggle }: EditProfileProps) => {
  const { user } = useAuthStore();

  const { register, setValue } = useForm<SocialSignupFormData>({
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
      handleToggle();
      return;
    }
  };

  return (
    <div className="flex flex-col w-60 sm:w-96 h-full p-4 space-y-5 justify-center">
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
    </div>
  );
};

export default ViewProfile;
