export default {
  id: "labadjust",
  name: "LAB Adjust",
  params: {
    lightness: { type: "number", min: -360, max: 360, default: 0 },
    a: { type: "number", min: -360, max: 360, default: 0 },
    b: { type: "number", min: -360, max: 360, default: 0 },
    invertLuminosity: { type: "boolean", default: false }
  },
  run({ data, width, height, params }) {
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    const rgbToXyz = (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x, y, z];
    };

    const xyzToLab = (x, y, z) => {
      const refX = 0.95047, refY = 1.00000, refZ = 1.08883;
      x /= refX; y /= refY; z /= refZ;
      const f = v => v > 0.008856 ? Math.cbrt(v) : (7.787 * v) + 16 / 116;
      const fx = f(x), fy = f(y), fz = f(z);
      const L = (116 * fy) - 16;
      const a = 500 * (fx - fy);
      const b = 200 * (fy - fz);
      return [L, a, b];
    };

    const labToXyz = (L, a, b) => {
      const refX = 0.95047, refY = 1.00000, refZ = 1.08883;
      let y = (L + 16) / 116;
      let x = a / 500 + y;
      let z = y - b / 200;
      const f = v => {
        const v3 = v * v * v;
        return v3 > 0.008856 ? v3 : (v - 16 / 116) / 7.787;
      };
      x = refX * f(x);
      y = refY * f(y);
      z = refZ * f(z);
      return [x, y, z];
    };

    const xyzToRgb = (x, y, z) => {
      let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      let b = x * 0.0557 + y * -0.2040 + z * 1.0570;
      const f = v => v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v;
      r = clamp(f(r), 0, 1);
      g = clamp(f(g), 0, 1);
      b = clamp(f(b), 0, 1);
      return [r * 255, g * 255, b * 255];
    };

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      let [x, y, z] = rgbToXyz(r, g, b);
      let [L, A, B] = xyzToLab(x, y, z);

      if (params.invertLuminosity) L = 100 - L;

      L = clamp(L + params.lightness, 0, 100);
      A = clamp(A + params.a, -128, 127);
      B = clamp(B + params.b, -128, 127);

      [x, y, z] = labToXyz(L, A, B);
      [r, g, b] = xyzToRgb(x, y, z);

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    return { data, width, height };
  }
};