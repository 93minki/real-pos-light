// 차트용 고정 색상 팔레트
export const CHART_COLOR_PALETTE = [
  "#3B82F6", // 파란색
  "#EF4444", // 빨간색
  "#10B981", // 초록색
  "#F59E0B", // 주황색
  "#8B5CF6", // 보라색
  "#EC4899", // 핑크색
  "#06B6D4", // 청록색
  "#84CC16", // 라임색
  "#F97316", // 오렌지색
  "#6366F1", // 인디고색
] as const;

// 메뉴별 고정 색상 매핑 (일관성을 위해)
export const getMenuColor = (menuName: string, index: number): string => {
  return CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length];
};
