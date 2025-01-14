'use client';

import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/form/SocialMypageFormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditMypageFormData, EditMypageSchema } from '@/app/auth/schemas/EditMypageSchema';
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
  } = useForm<EditMypageFormData>({
    resolver: zodResolver(EditMypageSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      phone_number: '',
      password: '',
      password_confirm: ''
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

  const passwordField = [
    {
      label: '새 비밀번호',
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
  ];

  useEffect(() => {
    setValue('username', user?.username || '');
    setValue('phone_number', user?.phone_number || '');
  }, [user]);

  // 최종 수정 버튼 클릭
  const onSubmit = async (data: EditMypageFormData): Promise<void> => {
    try {
      console.log(data);
      const result = await updateProfile(data);

      if (result.success) {
        alert('회원 정보를 수정하시겠습니까?');
        const result = await getUpdateProfile();
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
            name={item.name as keyof EditMypageFormData}
            label={item.label}
            id={item.id}
            type={item.type}
            register={register}
            errorMessage={errors[item.name as keyof EditMypageFormData]?.message}
            placeholder={item.placeholder}
          />
        ))}
        {user?.isSocialUser ? null : (
          <>
            {passwordField.map(item => (
              <FormInput
                key={item.id}
                name={item.name as keyof EditMypageFormData}
                label={item.label}
                id={item.id}
                type={item.type}
                register={register}
                errorMessage={errors[item.name as keyof EditMypageFormData]?.message}
                placeholder={item.placeholder}
              />
            ))}
          </>
        )}
        <FormButton>정보 수정 완료</FormButton>
      </form>
    </div>
  );
};

export default MyPage;
