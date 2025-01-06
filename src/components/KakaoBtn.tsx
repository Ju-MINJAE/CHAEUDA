import Image from 'next/image';

const KakaoBtn = () => {

  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/kakao/login/dev`;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="flex items-center justify-center w-full p-2 mt-4 bg-kakao text-black"
    >
      <Image src="/socialLogo/Kakao.png" alt="Kakao" width={24} height={24} className="mr-2" />
      <span>카카오로 시작하기</span>
    </button>
  );
};

export default KakaoBtn;
