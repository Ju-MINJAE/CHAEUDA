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
    return data;
  } catch (error) {
    console.error('나의 매물 조회 오류: ', error);
    return {
      success: false,
      message: '나의 매물 조회 중 오류가 발생하였습니다.',
    };
  }
};
