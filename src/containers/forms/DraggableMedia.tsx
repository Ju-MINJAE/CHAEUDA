import { useDrag, useDrop } from 'react-dnd';

const ItemType = {
  MEDIA: 'media',
};

interface DraggableMediaProps {
  preview: string;
  id: string;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  handleDelete: (id: string) => void;
}

const DraggableMedia: React.FC<DraggableMediaProps> = ({
  preview,
  id,
  index,
  moveItem,
  handleDelete,
}) => {
  const [, dragRef] = useDrag(() => ({
    type: ItemType.MEDIA,
    item: { index, id },
  }));

  const [, dropRef] = useDrop(() => ({
    accept: ItemType.MEDIA,
    hover: (draggedItem: { index: number; id: string }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }));

  const combinedRef = (node: HTMLDivElement | null) => {
    dragRef(node);
    dropRef(node);
  };

  return (
    <div ref={combinedRef} className="w-full relative border p-1 bg-white">
      {preview.startsWith('data:image/') ? (
        <img src={preview} alt={`Preview ${index}`} className="h-[140px] w-full object-cover" />
      ) : (
        <video controls className="h-[135px] w-full object-cover">
          <source src={preview} type="video/mp4" />
        </video>
      )}
      <button
        onClick={() => handleDelete(id)}
        className="absolute top-1 right-1 bg-gray-100 bg-opacity-60 text-xs px-1"
      >
        ✖
      </button>
    </div>
  );
};

export default DraggableMedia;
