'use client';

import ImageUploadForm from '@/containers/forms/ImageUpload';
import LocationInfoForm from '@/containers/forms/LocationInfo';
import PostDetailForm from '@/containers/forms/PostDetail';

const CreatePage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form className="w-[800px] mx-auto p-10 space-y-8" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-kick">매물 올리기</h1>
      <ImageUploadForm />
      <PostDetailForm />
      <LocationInfoForm />
      <div className="flex justify-end space-x-4">
        <button type="submit" className="px-4 py-2 bg-kick text-white">
          매물 등록
        </button>
      </div>
    </form>
  );
};

export default CreatePage;
