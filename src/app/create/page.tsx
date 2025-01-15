'use client';

import ImageUploadForm, { ProductImageData } from '@/containers/forms/ImageUpload';
import LocationInfoForm, { LocationData } from '@/containers/forms/LocationInfo';
import PostDetailForm, { DetailData } from '@/containers/forms/PostDetail';
import useAccessToken from '@/hooks/useAccessToken';
import { HousePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

const CreatePost: React.FC = () => {
  const router = useRouter();
  const [postDetailData, setPostDetailData] = useState<DetailData | null>(null);
  const [imageData, setImageData] = useState<ProductImageData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const accessToken = useAccessToken();

  const handlePostDetailSubmit = (data: DetailData) => {
    setPostDetailData(data);
  };

  const handleImageUploadSubmit = (data: ProductImageData) => {
    setImageData(data);
  };

  const handleLocationSubmit = (data: LocationData) => {
    setLocationData(data);
  };

  const createPost = async () => {
    if (!postDetailData || !imageData || !locationData) {
      alert('모든 폼을 작성해주세요.');
      console.log({ postDetailData, imageData, locationData });
      return;
    }

    if (!imageData.imageFiles.length) {
      alert('최소 1장 이상의 사진을 등록해야 합니다.');
      return;
    }

    try {
      const formData = new FormData();

      imageData.imageFiles.forEach(file => {
        formData.append('images', file);
      });

      if (imageData.videoFile) {
        formData.append('video', imageData.videoFile);
      }

      const productData = {
        ...postDetailData,
        ...locationData,
      };

      formData.append('data', JSON.stringify(productData));

      if (!accessToken) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인 해주세요.');
      }

      console.log('전송할 데이터:', {
        productData,
        imageCount: imageData.imageFiles.length,
        hasVideo: !!imageData.videoFile,
      });

      const response = await fetch(`${BASEURL}/api/product/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || '매물 등록에 실패했습니다.');
      }

      const result = await response.json();
      console.log('API 응답 성공:', result);
      alert('매물이 성공적으로 등록되었습니다!');

      router.push('/search');
    } catch (error) {
      console.error('API 요청 에러:', error);
      alert(
        error instanceof Error
          ? error.message
          : '매물 등록 중 문제가 발생했습니다. 다시 시도해주세요.',
      );
    }
  };

  return (
    <div className="w-[800px] mx-auto p-10 space-y-8">
      <h1 className="text-2xl font-bold text-kick">매물 올리기</h1>
      <ImageUploadForm onSubmitData={handleImageUploadSubmit} />
      <PostDetailForm onSubmitData={handlePostDetailSubmit} />
      <LocationInfoForm onSubmitData={handleLocationSubmit} />
      <div className="flex justify-end">
        <button
          onClick={createPost}
          className="px-4 py-3 bg-kick text-white rounded-lg flex gap-2 hover:transition-transform hover:scale-105"
        >
          <HousePlus />
          매물 등록
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
