import { PostDetailInput1, PostDetailInput2 } from './PostDetailInput';

const PostDetailForm: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">매물 정보</h2>
      <div className="space-y-5 text-[0.9rem]">
        <PostDetailInput1
          label="제목"
          id1="title"
          type="text"
          placeholder1="제목을 입력해주세요."
        />
        <PostDetailInput2
          label="매매 ∙ 관리비(선택)"
          id1="price"
          id2="management_fee"
          type="text"
          placeholder1="매매 가격을 입력해주세요."
          placeholder2="관리비용을 입력해주세요."
        />
        <label className="text-[0.95rem]">
          건물 유형
          <div className="flex gap-4 mt-2 text-[0.8rem]">
            <button value="단독주택" className="w-[100px] border border-gray-300 py-2">
              단독주택
            </button>
            <button value="다세대주택" className="w-[100px] border border-gray-300 py-2">
              다세대주택
            </button>
          </div>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <PostDetailInput1
            label="평수(공급면적)"
            id1="size"
            type="number"
            placeholder1="평수를 입력해주세요."
          />
          <PostDetailInput1
            label="부지면적"
            id1="lotSize"
            type="number"
            placeholder1="평수를 입력해주세요."
          />
        </div>
        <div className="grid grid-cols-3 gap-4 m-0">
          <PostDetailInput1
            label="층 수"
            id1="floor"
            type="number"
            placeholder1="층 수를 입력해주세요."
          />
          <PostDetailInput1
            label="방 수"
            id1="rooms"
            type="number"
            placeholder1="방 수를 입력해주세요."
          />
          <PostDetailInput1
            label="욕실 수"
            id1="bathrooms"
            type="number"
            placeholder1="욕실 수를 입력해주세요."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-[0.95rem]">
            난방 방식
            <div className="flex gap-3 mt-2 text-[0.8rem]">
              <button value="gasBoiler" className="w-[80px] border border-gray-300 py-2">
                가스보일러
              </button>
              <button value="oilBoiler" className="w-[80px] border border-gray-300 py-2">
                기름보일러
              </button>
              <button value="coalBoiler" className="w-[80px] border border-gray-300 py-2">
                연탄보일러
              </button>
              <button value="ect" className="w-[80px] border border-gray-300 py-2">
                기타
              </button>
            </div>
          </label>
          <PostDetailInput1
            label="건축 연도"
            id1="yearBuild"
            type="number"
            placeholder1="건축 연도를 입력해주세요."
          />
        </div>
        <label className="text-[0.95rem]">
          상세 설명
          <textarea
            id="content"
            placeholder="집에 대한 상세 설명을 입력해주세요."
            className="w-full border border-gray-300 px-4 py-2 mt-2 text-[0.8rem]"
          ></textarea>
        </label>
      </div>
    </div>
  );
};

export default PostDetailForm;

{
}
