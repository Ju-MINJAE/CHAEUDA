'use client';

import useAccessToken from '@/hooks/useAccessToken';

interface ProfileData {
  username: string;
  phone_number: string;
  password?: string;
}

const useUpdateProfile = () => {
  const accessToken = useAccessToken();

  const updateProfile = async (data: ProfileData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/update-profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error('회원 정보 수정 실패');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { updateProfile };
};

export default useUpdateProfile;