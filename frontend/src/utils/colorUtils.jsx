const COLORS = ['#7A86D8', '#D88A7A', '#7AD8A3', '#D7D87A', '#B47AD8', '#7AD8D5', '#D87AB3'];

export function getColorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}
