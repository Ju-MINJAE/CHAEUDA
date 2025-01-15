import { NearbyProductsResponse } from '@/types/product';

export const fetchLikeLists = async (accessToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/like-mylist`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error('API 요청 실패');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('관심 매물 조회 오류: ', error);
    return {
      success: false,
      message: '관심 매물 조회 중 오류가 발생하였습니다.',
    };
  }
};

export const fetchMyProducts = async (accessToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/products-mylist`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) throw new Error('API 요청 실패');

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('나의 매물 조회 오류: ', error);
    return {
      success: false,
      message: '나의 매물 조회 중 오류가 발생하였습니다.',
    };
  }
};

export const fetchNearbyProducts = async (
  lat: number,
  lng: number,
  zoom = 14,
): Promise<NearbyProductsResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/nearby?latitude=${lat}&longitude=${lng}&zoom=${zoom}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API 요청 실패');
    }

    const data: NearbyProductsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('매물 조회 오류: ', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '매물 조회 중 오류가 발생하였습니다.',
    };
  }
};

export const deleteRequest = async (productId: number, accessToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/delete/${productId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) throw new Error('API 요청 실패');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('매물 삭제 오류: ', error);
    return {
      success: false,
      message: '매물 삭제 중 오류가 발생하였습니다.',
    };
  }
};
