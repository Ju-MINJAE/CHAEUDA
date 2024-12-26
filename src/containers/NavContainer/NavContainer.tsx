import Link from 'next/link';
import React from 'react';

const NavContainer: React.FC = () => {
  return (
    <header className="fixed w-full bg-white z-10 shadow-md">
      <nav className="flex items-center justify-between h-[80px] px-10">
        <div className="mr-10 text-kick text-2xl font-bold">
          <Link href={'/'}>채우다 로고</Link>
        </div>
        <ul className="flex space-x-8">
          <li className="hover:text-kick">
            <a href="#">지도 보기</a>
          </li>
          <li className="hover:text-kick">
            <a href="#">매물 보기</a>
          </li>
          <li className="hover:text-kick">
            <a href="#">매물 올리기</a>
          </li>
        </ul>

        <div className="flex items-center space-x-4 ml-auto">
          <button className="hover:text-kick">
            <Link href="/chat">채팅</Link>
          </button>
          <span className="text-gray-500">|</span>
          <button className="hover:text-kick">
            <Link href={'/auth/signUp'}>로그인/회원가입</Link>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavContainer;
