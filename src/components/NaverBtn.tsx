import Image from 'next/image';

// const NaverBtn = () => {
//   const handleNaverLogin = () => {
//     const scope = 'name,email,phone'; // 요청할 정보에 mobile 추가
//     window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/naver/login?scope=${encodeURIComponent(scope)}`;
//   };

const NaverBtn = () => {
  const handleNaverLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/naver/login`;
  };

  return (
    <button
      onClick={handleNaverLogin}
      className="flex items-center justify-center w-full p-2 mt-4 bg-naver text-white"
    >
      <Image src="/socialLogo/Naver.png" alt="Naver" width={26} height={26} className="mr-2" />
      <span>네이버로 시작하기</span>
    </button>
  );
};

export default NaverBtn;
