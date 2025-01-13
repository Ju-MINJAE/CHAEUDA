'use client';

import useAccessToken from '@/hooks/useAccessToken';

const useFetchProfile = () => {
  const accessToken = useAccessToken();

  const getUpdateProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('회원 정보 수정 실패');
      }

      const updatedProfile = await response.json();
      return updatedProfile;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { getUpdateProfile };
};

export default useFetchProfile;
