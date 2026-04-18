function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

export default {
  id: "hsladjust",
  name: "HSL Adjust",
  params: {
    hue: { min: -360, max: 360 },
    saturation: { min: -360, max: 360 },
    lightness: { min: -360, max: 360 }
  },
  run(pixels, { hue = 0, saturation = 0, lightness = 0 }) {
    const out = new Uint8ClampedArray(pixels.length);

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      let [h, s, l] = rgbToHsl(r, g, b);

      h = (h + hue) % 360;
      if (h < 0) h += 360;

      s = clamp(s + saturation, 0, 100);
      l = clamp(l + lightness, 0, 100);

      const [nr, ng, nb] = hslToRgb(h, s, l);

      out[i] = nr;
      out[i + 1] = ng;
      out[i + 2] = nb;
      out[i + 3] = a;
    }

    return out;
  }
};