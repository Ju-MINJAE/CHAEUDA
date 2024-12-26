'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  userId: string;
  password: string;
  confirmPassword: string;
  mobile: number;
  email: string;
}

const LocalSignUpPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    userId: '',
    password: '',
    confirmPassword: '',
    mobile: 0,
    email: '',
  });
  const [authenticateEmail, setAuthenticateEmail] = useState<number>(0);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevData => {
      if (e.target.name === 'mobile') {
        return {
          ...prevData,
          mobile: parseInt(e.target.value), // "mobile"은 정수로 변환
        };
      } else {
        return {
          ...prevData,
          [e.target.name]: e.target.value, // 나머지 값은 그대로
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        router.push('/');
      }
    } catch (error) {
      alert(`회원가입 실패: ${error}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col w-[300px]">
        <label htmlFor="name">이름</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="border border-black"
        />
        <label htmlFor="userId">아이디</label>
        <input
          id="userId"
          name="userId"
          type="text"
          value={formData.userId}
          onChange={handleChange}
          className="border border-black"
        />
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="border border-black"
        />
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border border-black"
        />
        <label htmlFor="mobile">휴대폰번호</label>
        <input
          id="mobile"
          name="mobile"
          type="number"
          value={formData.mobile}
          onChange={handleChange}
          className="border border-black"
        />
        <label htmlFor="email">이메일 주소</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="border border-black"
        />
        <label htmlFor="authenticateEmail">이메일 인증번호</label>
        <input
          id="authenticateEmail"
          name="authenticateEmail"
          type="number"
          value={authenticateEmail}
          onChange={e => setAuthenticateEmail(parseInt(e.target.value))}
          className="border border-black"
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default LocalSignUpPage;
