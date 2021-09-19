const COLOR_MAP = {"#EE2222": "#E44141",  // red
                   "#E77471": "#C86462",  // coral
                   "#EF8239": "#D37339",  // orange
                   "#DAA520": "#B4902E",  // yellow
                   "#7AB941": "#70A342",  // green
                   "#009856": "#08AB6E",  // mint
                   "#249BCE": "#389BC6",  // azure
                   "#4646CE": "#6666EE",  // blue
                   "#900090": "#A010A0",  // purple
                   "#A259C5": "#AE6CCD",  // lavender
                   "#E762B5": "#C75C9F",  // pink
                   "#EF2081": "#EE2D88",  // fuchsia
                   "#FFB3F3": "#AF7BA7",  // light pink
                   "#808080": "#999999",  // silver
                   "#000000": "#999999"}; // white

function hex(num) {
  return Math.round(Math.max(0, Math.min(255, num))).toString(16);
}

function splitRGB(rgb) {
  return rgb.match(/.{1,2}/g).map(x => parseInt(x, 16));
}

function joinRGB(rgb) {
  return rgb.map(x => hex(x).padStart(2, "0")).join("");
}

function gradient(start, end, len) {
  let colors = [];
  let splitStart = splitRGB(start);
  let splitEnd = splitRGB(end);
  for (let i = 0; i < len; i++) {
    let weight = (len == 1) ? 0 : (i / (len - 1));
    colors.push(joinRGB(splitStart.map((e, i) => (e * (1 - weight) + splitEnd[i] * weight))));
  }
  return colors;
}