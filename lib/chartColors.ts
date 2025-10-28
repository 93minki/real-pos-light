export const CHART_COLOR_PALETTE: string[] = Array.from(
  { length: 100 },
  (_, i) => {
    const hue = Math.round((i / 100) * 360);
    return `hsl(${hue}, 70%, 55%)`;
  }
);

export const getMenuColor = (menuName: string): string => {
  let hash = 0;
  for (let i = 0; i < menuName.length; i++) {
    const char = menuName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const index = Math.abs(hash) % CHART_COLOR_PALETTE.length;
  return CHART_COLOR_PALETTE[index];
};
export const generateMenuColorMap = (
  allMenuNames: string[]
): Record<string, string> => {
  const colorMap: Record<string, string> = {};

  allMenuNames.forEach((menuName) => {
    colorMap[menuName] = getMenuColor(menuName);
  });

  return colorMap;
};
