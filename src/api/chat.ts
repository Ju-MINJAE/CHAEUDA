import { Chat } from '@/types/chat';

export const fetchChatList = async (accessToken: string): Promise<Chat[]> => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('BASE_URL is not defined');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.chat_rooms || [];
  } catch (error) {
    console.error('Error fetching chat list:', error);
    throw error;
  }
};

export const createChatRequest = async (accessToken: string, product_id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ product_id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '채팅방 생성 오류');
    }

    return {
      success: true,
      message: data.message,
      chatRoom: data.chat_room,
    };
  } catch (error) {
    console.error('채팅방 생성 오류: ', error);
    return {
      success: false,
      message: '잠시 후 재시도바랍니다.',
    };
  }
};
