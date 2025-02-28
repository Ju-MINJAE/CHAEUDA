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

export type WebSocketSender = {
  username: string;
  [key: string]: unknown;
};

export type WebSocketMessage = {
  id?: string | number;
  message?: string;
  sender?: WebSocketSender | string;
  created_at?: string | number;
  chat_room_id?: string | number;
  type?: string;
  prev_messages?: WebSocketPrevMessage[];
};

export type WebSocketPrevMessage = {
  id?: string | number;
  message?: string;
  sender?: WebSocketSender;
  created_at?: string | number;
  chat_room_id?: string | number;
};
