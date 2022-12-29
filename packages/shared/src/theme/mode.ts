export const mode = (lightValue: string, darkValue: string) => ({ colorMode }: { colorMode: 'light' | 'dark'}) =>
  colorMode === 'light' ? lightValue : darkValue