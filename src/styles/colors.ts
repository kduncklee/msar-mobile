const colors = {
  yellow: '#FED32C',
  primaryBg: '#20242A',
  secondaryBg: '#2B3038',
  selectionBg: '#67ACED',
  primaryText: '#ffffff',
  white: '#ffffff',
  black: '#000000',
  grayText: '#60646A',
  secondaryYellow: '#EDC767',
  red: '#F07676',
  blue: '#67ACED',
  darkBlue: '#366087',
  green: '#47C39A',
  lightText: '#E5F7F1',
  clear: '#00000000',
};

// Modified from https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
export function colorIsDark(bgColor: string) {
  if (!bgColor) {
    return false;
  }
  const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  const r = Number.parseInt(color.substring(0, 2), 16); // hexToR
  const g = Number.parseInt(color.substring(2, 4), 16); // hexToG
  const b = Number.parseInt(color.substring(4, 6), 16); // hexToB
  return ((r * 0.299) + (g * 0.587) + (b * 0.114)) <= 186;
}

export function textColorForBackground(bgColor: string) {
  return colorIsDark(bgColor) ? colors.white : colors.black;
}

export default colors;
