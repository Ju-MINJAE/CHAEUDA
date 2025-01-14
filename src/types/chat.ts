export type Chat = {
  id: number;
  buyer: string;
  product_address: string;
  product_id: string;
  product_price: number;
  product_title: string;
  seller: string;
};

export type Message = {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
  chatRoom: string;
};

export type ChatListProps = {
  initialChats: Chat[];
  onSelectChat: (chatId: number) => void;
  selectedChatId: number | null;
  onChatCreated?: (newChat: Chat) => void;
};

export type ChatRoomProps = {
  chatId: number;
};
