import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: PostcodeData) => void }) => { open: () => void };
    };
    naver: any;
  }
}

interface PostcodeData {
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
}

export interface LocationData {
  add_new: string;
  add_old: string;
  latitude: number;
  longitude: number;
}

interface LocationInfoFormProps {
  onSubmitData: (data: LocationData) => void;
}

const LocationInfoForm: React.FC<LocationInfoFormProps> = ({ onSubmitData }) => {
  const addressRef = useRef<HTMLInputElement>(null);
  const zonecodeRef = useRef<HTMLInputElement>(null);
  const [detailAddress, setDetailAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [addOld, setAddOld] = useState<string>('');
  const [addNew, setAddNew] = useState<string>('');
  const [isNaverLoaded, setIsNaverLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Load Daum Postcode script
    const loadDaumPostcode = () => {
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.head.appendChild(script);
      }
    };

    // Load Naver Maps script
    const loadNaverMaps = () => {
      const existingScript = document.querySelector('script[src*="openapi.map.naver.com"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src =
          'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID&submodules=geocoder';
        script.async = true;
        script.onload = () => setIsNaverLoaded(true);
        document.head.appendChild(script);
      } else {
        setIsNaverLoaded(true);
      }
    };

    loadDaumPostcode();
    loadNaverMaps();
  }, []);

  const searchAddressToCoordinate = (address: string) => {
    if (!isNaverLoaded) {
      console.error('Naver Maps API is not loaded yet');
      return;
    }

    window.naver.maps.Service.geocode({ query: address }, (status: any, response: any) => {
      if (status === window.naver.maps.Service.Status.ERROR) {
        console.error('Error while fetching coordinates');
        return;
      }

      if (response.v2.meta.totalCount === 0) {
        console.error('No results found for the address');
        return;
      }

      const item = response.v2.addresses[0];
      const lat = Number(item.y);
      const lng = Number(item.x);

      setLatitude(lat);
      setLongitude(lng);

      const fullNewAddress = detailAddress ? `${addNew} ${detailAddress}` : addNew;
      const fullOldAddress = detailAddress ? `${addOld} ${detailAddress}` : addOld;

      onSubmitData({
        add_new: fullNewAddress,
        add_old: fullOldAddress,
        latitude: lat,
        longitude: lng,
      });

      console.log(`Coordinates: lat=${lat}, lng=${lng}`);
    });
  };

  const openPostcodeSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      console.error('Daum Postcode is not loaded yet');
      return;
    }

    const postcode = new window.daum.Postcode({
      oncomplete: (data: PostcodeData) => {
        if (addressRef.current && zonecodeRef.current) {
          addressRef.current.value = data.roadAddress;
          zonecodeRef.current.value = data.zonecode;
          setAddOld(data.jibunAddress);
          setAddNew(data.roadAddress);
          searchAddressToCoordinate(data.roadAddress);
        }
      },
    });

    postcode.open();
  };

  const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDetailAddress = e.target.value;
    setDetailAddress(newDetailAddress);

    if (addNew && addOld && latitude && longitude) {
      const fullNewAddress = newDetailAddress ? `${addNew} ${newDetailAddress}` : addNew;
      const fullOldAddress = newDetailAddress ? `${addOld} ${newDetailAddress}` : addOld;

      onSubmitData({
        add_new: fullNewAddress,
        add_old: fullOldAddress,
        latitude,
        longitude,
      });
    }
  };

  return (
    <div className="w-[500px]">
      <h2 className="text-lg font-semibold mb-4">위치 정보</h2>
      <div>
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
          />
        </label>
        <label htmlFor="address2" className="text-[0.95rem]">
          상세주소(선택)
          <input
            id="address2"
            type="text"
            placeholder="상세주소를 입력해주세요."
            value={detailAddress}
            onChange={handleDetailAddressChange}
            className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
          />
        </label>
      </div>
    </div>
  );
};

export default LocationInfoForm;
