export type Chat = {
  id: number;
  buyer: string;
  product_address: string;
  product_id: number;
  product_price: number;
  product_title: string;
  seller: string;
};

export type Message = {
  id: string;
  user: string;
  content: string;
};

export type ChatListProps = {
  initialChats: Chat[];
  onSelectChat: (chatId: number) => void;
  selectedChatId: number | null;
  onChatCreated?: (newChat: Chat) => void;
};
