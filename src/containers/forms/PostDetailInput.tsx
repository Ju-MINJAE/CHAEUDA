interface PostDetailInputProps {
  label: string;
  id1: string;
  id2?: string;
  type: string;
  placeholder1?: string;
  placeholder2?: string;
}

export const PostDetailInput1: React.FC<PostDetailInputProps> = ({
  label,
  id1,
  type,
  placeholder1,
}) => {
  return (
    <label className="text-[0.95rem]">
      {label}
      <input
        id={id1}
        type={type}
        placeholder={placeholder1}
        className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
      />
    </label>
  );
};

export const PostDetailInput2: React.FC<PostDetailInputProps> = ({
  label,
  id1,
  id2,
  type,
  placeholder1,
  placeholder2,
}) => {
  return (
    <label className="text-[0.95rem]">
      {label}
      <div className="grid grid-cols-2 gap-4 mt-2 mb-4 text-[0.8rem]">
        <input
          id={id1}
          type={type}
          placeholder={placeholder1}
          className="border border-gray-300 px-4 py-2"
        />
        <input
          id={id2}
          type={type}
          placeholder={placeholder2}
          className="border border-gray-300 px-4 py-2"
        />
      </div>
    </label>
  );
};
