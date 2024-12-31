import { useEffect, useRef } from 'react';
import { PostDetailInput1 } from './PostDetailInput';

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: PostcodeData) => void }) => { open: () => void };
    };
  }
}

interface PostcodeData {
  roadAddress: string;
  zonecode: string;
}

const LocationInfoForm = () => {
  const addressRef = useRef<HTMLInputElement>(null);
  const zonecodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="postcode.v2.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const openPostcodeSearch = () => {
    if (!window.daum || !window.daum.Postcode) return;

    const postcode = new window.daum.Postcode({
      oncomplete: (data: PostcodeData) => {
        if (addressRef.current && zonecodeRef.current) {
          addressRef.current.value = data.roadAddress;
          zonecodeRef.current.value = data.zonecode;
        }
      },
    });

    postcode.open();
  };

  return (
    <div className="w-[500px]">
      <h2 className="text-lg font-semibold mb-4">위치 정보</h2>
      <div className="">
        <label className="text-[0.95rem] flex-1">
          주소
          <div className="flex items-center space-x-2">
            <input
              ref={zonecodeRef}
              id="address1"
              placeholder="우편번호를 입력해주세요."
              className="w-[250px] border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
              readOnly
            />
            <button
              type="button"
              onClick={openPostcodeSearch}
              className="w-[120px] h-[37px] mb-2 text-[0.8rem] bg-gray-300"
            >
              주소 검색하기
            </button>
          </div>
          <input
            ref={addressRef}
            type="text"
            placeholder="주소를 입력해주세요."
            className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            readOnly
          ></input>
        </label>

        <PostDetailInput1
          label="상세주소(선택)"
          id1="address2"
          type="text"
          placeholder1="상세주소를 입력해주세요."
        />
      </div>
    </div>
  );
};

export default LocationInfoForm;
