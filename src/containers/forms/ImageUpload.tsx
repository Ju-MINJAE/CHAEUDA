import { useState } from 'react';

const ImageUploadForm = () => {
  const [previews, setPreviews] = useState<(string | File)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: (string | File)[] = [];
      let imgCount = 0;

      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result as string);
            setPreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
          imgCount++;
          if (imgCount > 15) {
            setErrorMessage('사진은 최대 15장까지 등록 가능합니다.');
            return;
          }
        } else if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result as string);
            setPreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
          imgCount++;
        }
      });

      if (imgCount === 0 || previews.length === 0) {
        setErrorMessage('최소 1장 이상의 사진을 등록해야 합니다.');
      } else {
        setErrorMessage('');
      }
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">이미지, 영상</h2>
      <p className="text-sm text-gray-500 mb-4">
        - 최소 1장 이상의 사진을 등록해야 하며, 최대 10장까지 등록이 가능합니다. (한 장당 10MB 이하)
        <br />
        - 첫번째 사진이 대표 이미지로 보여지며, 순서를 변경할 수 있습니다.
        <br />
        - 영상은 1개 이하로 등록하실 수 있습니다.
        <br />- 매물과 관련없는 이미지, 홍보성 이미지, 워터마크 이미지는 등록하실 수 없습니다.
      </p>
      {!previews.length ? (
        <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 p-4 text-center">
          <label className="cursor-pointer">
            <span className="block text-gray-500">Upload Additional File</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
          </label>
        </div>
      ) : (
        <div className="mt-4 border-2 border-gray-300 space-y-3 p-4">
          <label className="cursor-pointer">
            <span className="block border w-[90px] bg-gray-300 hover:bg-gray-400 text-white text-[0.9rem] text-center rounded-md">
              Add File
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
          </label>
          <div className="grid grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="w-full">
                {typeof preview === 'string' ? (
                  preview.startsWith('data:image/') ? (
                    <img src={preview} alt={`Preview ${index}`} className="h-[140px]" />
                  ) : (
                    <video controls className="h-[135px]">
                      <source src={preview} type="video/mp4" />
                    </video>
                  )
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
      {errorMessage && <p className="text-kick text-sm">{errorMessage}</p>}
    </div>
  );
};

export default ImageUploadForm;
