'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendWithdrawRequest } from '@/api/auth';
import useAuthStore from '@/stores/authStore';
import Profile from '../../components/mypage/Profile';
import LikeProductsPage from './likeproducts/page';
import MyProductsPage from './myproducts/page';
import { Heart, House, Settings } from 'lucide-react';

const MyPage = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [myPageView, setMyPageView] = useState<keyof typeof pageComponents>('Profile');

  const pageComponents = {
    Profile: <Profile />,
    likeproducts: <LikeProductsPage />,
    myProductsPage: <MyProductsPage />,
  };

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
    <div className="flex w-full h-full px-10 py-8">
      <div className="border border-[#e5e7eb] w-[230px] flex justify-center px-3 py-10 rounded-md shadow-md">
        <div className="flex flex-col justify-between items-center">
          <ul className="space-y-6">
            <li
              onClick={() => setMyPageView('Profile')}
              className="cursor-pointer flex gap-4 hover:text-kick"
            >
              <Settings />
              계정 관리
            </li>
            <li
              onClick={() => setMyPageView('likeproducts')}
              className="cursor-pointer flex gap-4 hover:text-kick"
            >
              <Heart />
              찜한 매물
            </li>
            <li
              onClick={() => setMyPageView('myProductsPage')}
              className="cursor-pointer flex gap-4 hover:text-kick"
            >
              <House />
              나의 매물
            </li>
          </ul>
          <span
            onClick={handleWithdraw}
            className="text-gray-400 text-sm cursor-pointer hover:text-kick"
          >
            회원 탈퇴
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center w-full">{pageComponents[myPageView]}</div>
    </div>
  );
};

export default MyPage;
