import Image from 'next/image';

const GoogleBtn = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/login/dev`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full p-2 mt-4 bg-google text-black "
    >
      <Image src="/socialLogo/Google.png" alt="Google" width={26} height={26} className="mr-2" />
      <span>구글로 시작하기</span>
    </button>
  );
};

export default GoogleBtn;
