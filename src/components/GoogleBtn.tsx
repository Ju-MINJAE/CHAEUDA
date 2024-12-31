const GoogleBtn = () => {
  
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/login/dev`;
  };

  return (
    <>
      <button onClick={handleGoogleLogin}>구글로 시작하기</button>
    </>
  );
};

export default GoogleBtn;
