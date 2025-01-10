import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableMedia from './DraggableMedia';

const MAX_IMG_COUNT = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
const allowedVideoTypes = ['video/mp4', 'video/quicktime'];

interface FileData {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

export interface ProductImageData {
  imageFiles: File[];
  videoFile: File | null;
}

const ImageUploadForm: React.FC<{ onSubmitData: (data: ProductImageData) => void }> = ({
  onSubmitData,
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('파일 크기는 10MB 이하여야 합니다.');
    }

    if (file.type.startsWith('image/') && !allowedImageTypes.includes(file.type)) {
      throw new Error('지원하지 않는 이미지 형식입니다.');
    }

    if (file.type.startsWith('video/') && !allowedVideoTypes.includes(file.type)) {
      throw new Error('지원하지 않는 비디오 형식입니다.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      let imgCount = files.length;
      const newFiles: FileData[] = [...files];

      Array.from(selectedFiles).forEach(file => {
        try {
          if (imgCount >= MAX_IMG_COUNT) {
            throw new Error('사진은 최대 10장까지 등록 가능합니다.');
          }

          validateFile(file);

          const id = crypto.randomUUID();
          const reader = new FileReader();

          if (file.type.startsWith('image/')) {
            const isDuplicate = files.some(fileData => fileData.file.name === file.name);
            if (isDuplicate) {
              throw new Error('이미 같은 파일이 존재합니다.');
            }

            reader.onloadend = () => {
              const url = reader.result as string;
              newFiles.push({ id, file, url, type: 'image' });
              setFiles(newFiles);
              updateParentData(newFiles);
            };
            reader.readAsDataURL(file);
            imgCount++;
          } else if (file.type.startsWith('video/')) {
            if (files.some(f => f.type === 'video')) {
              throw new Error('영상은 1개만 등록 가능합니다.');
            }

            reader.onloadend = () => {
              const url = reader.result as string;
              newFiles.push({ id, file, url, type: 'video' });
              setFiles(newFiles);
              updateParentData(newFiles);
            };
            reader.readAsDataURL(file);
          }
        } catch (error) {
          if (error instanceof Error) {
            setErrorMessage(error.message);
          }
          return;
        }
      });

      if (imgCount === 0) {
        setErrorMessage('최소 1장 이상의 사진을 등록해야 합니다.');
      } else {
        setErrorMessage('');
      }
    }
  };

  const updateParentData = (currentFiles: FileData[]) => {
    const imageFiles = currentFiles.filter(f => f.type === 'image').map(f => f.file);

    const videoFile = currentFiles.find(f => f.type === 'video')?.file || null;

    onSubmitData({
      imageFiles,
      videoFile,
    });
  };

  const handleDelete = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    updateParentData(updatedFiles);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedFiles = [...files];
    const [movedFile] = updatedFiles.splice(fromIndex, 1);
    updatedFiles.splice(toIndex, 0, movedFile);
    setFiles(updatedFiles);
    updateParentData(updatedFiles);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2 className="text-lg font-semibold mb-2">이미지, 영상</h2>
        <p className="text-sm text-gray-500 mb-4">
          - 최소 1장 이상의 사진을 등록해야 하며, 최대 10장까지 등록이 가능합니다. (한 장당 10MB
          이하)
          <br />
          - 첫번째 사진이 대표 이미지로 보여지며, 순서를 변경할 수 있습니다.
          <br />
          - 영상은 1개 이하로 등록하실 수 있습니다.
          <br />- 매물과 관련없는 이미지, 홍보성 이미지, 워터마크 이미지는 등록하실 수 없습니다.
        </p>
        {!files.length ? (
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
            <div className="grid grid-cols-3 gap-4 mt-4">
              {files.map((fileData, index) => (
                <DraggableMedia
                  key={fileData.id}
                  id={fileData.id}
                  preview={fileData.url}
                  index={index}
                  moveItem={moveItem}
                  handleDelete={() => handleDelete(fileData.id)}
                />
              ))}
            </div>
          </div>
        )}
        {errorMessage && <p className="text-kick text-sm">{errorMessage}</p>}
      </div>
    </DndProvider>
  );
};

export default ImageUploadForm;
