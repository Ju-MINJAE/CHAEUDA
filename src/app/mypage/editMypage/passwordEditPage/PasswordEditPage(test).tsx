'use client';

import { useRouter } from 'next/navigation';
import FormInput from '@/components/form/SocialMypageFormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditPasswordFormData, EditPasswordSchema } from '@/app/auth/schemas/EditPasswordSchema';
import FormButton from '@/components/form/FormButton';
import useUpdateProfile from '@/hooks/useUpdateProfile';

const passwordEditPage = () => {
  const router = useRouter();
  const { updateProfile } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPasswordFormData>({
    resolver: zodResolver(EditPasswordSchema),
    mode: 'onBlur',
  });

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

  // 최종 수정 버튼 클릭
  const onSubmit = async (data: EditPasswordFormData): Promise<void> => {
    try {
      const result = await updateProfile(data);

      if (result.success) {
        alert('비밀번호를 수정하시겠습니까?');
        router.back();
      }
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
    }
  };

  return (
    <div className="pt-9 pb-9 w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[80%] sm:w-1/3 space-y-5">
        {passwordField.map(item => (
          <FormInput
            key={item.id}
            name={item.name as keyof EditPasswordFormData}
            label={item.label}
            id={item.id}
            type={item.type}
            register={register}
            errorMessage={errors[item.name as keyof EditPasswordFormData]?.message}
            placeholder={item.placeholder}
          />
        ))}
        <FormButton>정보 수정 완료</FormButton>
      </form>
    </div>
  );
};

export default passwordEditPage;
