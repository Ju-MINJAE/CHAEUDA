interface Region {
  value: string;
  name: string;
}

export const FirstSelectRegion: Region[] = [
  { value: 'default', name: '시/도' },
  { value: '강원', name: '강원' },
  { value: '경기', name: '경기' },
  { value: '경남', name: '경남' },
  { value: '경북', name: '경북' },
  { value: '광주', name: '광주' },
  { value: '대구', name: '대구' },
  { value: '대전', name: '대전' },
  { value: '부산', name: '부산' },
  { value: '세종', name: '세종' },
  { value: '울산', name: '울산' },
  { value: '인천', name: '인천' },
  { value: '전남', name: '전남' },
  { value: '전북', name: '전북' },
  { value: '제주', name: '제주' },
  { value: '충남', name: '충남' },
  { value: '충북', name: '충북' },
];

type SecondSelectRegionType = Record<string, Region[]>;

export const SecondSelectRegion: SecondSelectRegionType = {
  부산: [
    { value: '강서구', name: '강서구' },
    { value: '금정구', name: '금정구' },
    { value: '기장군', name: '기장군' },
    { value: '남구', name: '남구' },
    { value: '동구', name: '동구' },
    { value: '동래구', name: '동래구' },
    { value: '부산진구', name: '부산진구' },
    { value: '북구', name: '북구' },
    { value: '사상구', name: '사상구' },
    { value: '사하구', name: '사하구' },
    { value: '서구', name: '서구' },
    { value: '수영구', name: '수영구' },
    { value: '연제구', name: '연제구' },
    { value: '영도구', name: '영도구' },
    { value: '중구', name: '중구' },
    { value: '해운대구', name: '해운대구' },
  ],
  대구: [
    { value: '군위군', name: '군위군' },
    { value: '남구', name: '남구' },
    { value: '달서구', name: '달서구' },
    { value: '달성군', name: '달성군' },
    { value: '동구', name: '동구' },
    { value: '북구', name: '북구' },
    { value: '서구', name: '서구' },
    { value: '수성구', name: '수성구' },
    { value: '중구', name: '중구' },
  ],
  인천: [
    { value: '강화군', name: '강화군' },
    { value: '계양구', name: '계양구' },
    { value: '남동구', name: '남동구' },
    { value: '동구', name: '동구' },
    { value: '미추홀구', name: '미추홀구' },
    { value: '부평구', name: '부평구' },
    { value: '서구', name: '서구' },
    { value: '연수구', name: '연수구' },
    { value: '옹진군', name: '옹진군' },
    { value: '중구', name: '중구' },
  ],
  광주: [
    { value: '광산구', name: '광산구' },
    { value: '남구', name: '남구' },
    { value: '동구', name: '동구' },
    { value: '북구', name: '북구' },
    { value: '서구', name: '서구' },
  ],
  대전: [
    { value: '대덕구', name: '대덕구' },
    { value: '동구', name: '동구' },
    { value: '서구', name: '서구' },
    { value: '유성구', name: '유성구' },
    { value: '중구', name: '중구' },
  ],
  울산: [
    { value: '남구', name: '남구' },
    { value: '동구', name: '동구' },
    { value: '북구', name: '북구' },
    { value: '울주군', name: '울주군' },
    { value: '중구', name: '중구' },
  ],
};
