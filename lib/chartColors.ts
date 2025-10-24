export const CHART_COLOR_PALETTE: string[] = Array.from({ length: 100 }, (_, i) => {
  const hue = Math.round((i / 100) * 360);
  return `hsl(${hue}, 70%, 55%)`;
});



// 메뉴 이름을 기반으로 일관된 색상 반환
export const getMenuColor = (menuName: string): string => {
  // 메뉴 이름의 해시값을 생성하여 일관된 색상 반환
  let hash = 0;
  for (let i = 0; i < menuName.length; i++) {
    const char = menuName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit 정수로 변환
  }

  // 음수를 양수로 변환하고 팔레트 인덱스로 사용
  const index = Math.abs(hash) % CHART_COLOR_PALETTE.length;
  return CHART_COLOR_PALETTE[index];
};

// 모든 메뉴에 대한 색상 매핑 생성
export const generateMenuColorMap = (
  allMenuNames: string[]
): Record<string, string> => {
  const colorMap: Record<string, string> = {};

  allMenuNames.forEach((menuName) => {
    colorMap[menuName] = getMenuColor(menuName);
  });

  return colorMap;
};
