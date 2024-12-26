import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      //이름, 아이디, 비번, 비번확인, 휴대폰번호, 이메일 이메일 인증번호
      credentials: {
        userName: { label: '이름', type: 'text', placeholder: '이름을 입력하세요' },
        userId: { label: '아이디', type: 'text', placeholder: '아이디를 입력하세요' },
        userPassword: { label: '비밀번호', type: 'password', placeholder: '비밀번호를 입력하세요' },
        userMobile: { label: '휴대폰번호', type: 'number', placeholder: '휴대폰번호를 입력하세요' },
        userEmail: { label: '이메일', type: 'email', placeholder: '이메일을 입력하세요' },
        // userId: { label: "아이디", type: "text", placeholder: "이메일을 입력하세요"},
        // username: { label: "이메일", type: "text", placeholder: "이메일 입력" },
        // password: { label: "비밀번호", type: "password" },
      },

      // 이메일, 패스워드 부분을 체크해서
      // 맞으면 user 객체 리턴
      // 틀리면 null 리턴
      async authorize(credentials, req) {
        const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
