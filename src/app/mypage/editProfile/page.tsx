'use client';

import useAuthStore from '@/stores/authStore';
import FormInput from '@/components/form/SocialMypageFormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditMypageFormData, EditMypageSchema } from '@/app/auth/schemas/EditMypageSchema';
import { useEffect, useState } from 'react';
import FormButton from '@/components/form/FormButton';
import useUpdateProfile from '@/hooks/useUpdateProfile';
import useFetchProfile from '@/hooks/useFetchProfile';

interface EditProfileProps {
  handleToggle: () => void;
}

const EditProfile = ({ handleToggle }: EditProfileProps) => {
  const { login, user } = useAuthStore();
  const { updateProfile } = useUpdateProfile();
  const { getUpdateProfile } = useFetchProfile();
  const [isEditing, setIsEditing] = useState<boolean>(true);

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
      password_confirm: '',
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
  }, [user, setValue]);

  const onSubmit = async (data: EditMypageFormData): Promise<void> => {
    try {
      const confirmed = confirm('회원 정보를 수정하시겠습니까?');
      if (!confirmed) return;

      const result = await updateProfile(data);
      if (result.success) {
        const result = await getUpdateProfile();
        login(
          user?.isSocialUser
            ? { ...result.user, isSocialUser: true }
            : { ...result.user, isSocialUser: false },
        );
        // handleToggle();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
    }
  };

  // const handleToggle = () => {
  //   setIsEditing(!isEditing);
  // };

  if (!isEditing) {
    return (
      <div className="flex flex-col w-60 sm:w-96 h-full p-4 space-y-5 justify-center">
        <h1 className="text-2xl font-normal text-kick">마이페이지</h1>
        <p>회원 정보가 성공적으로 수정되었습니다.</p>
        <FormButton onClick={handleToggle}>다시 수정하기</FormButton>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-60 sm:w-96 h-full p-4 space-y-5 justify-center"
    >
      <div>
        <h1 className="text-2xl font-normal text-kick">마이페이지 수정</h1>
      </div>
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
      <FormButton type="submit">정보 수정 완료</FormButton>
    </form>
  );
};

export default EditProfile;
