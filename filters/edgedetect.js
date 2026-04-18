export default {
  id: "edgedetect",
  name: "Edge Detect",
  params: {
    amount: {
      type: "number",
      min: -10,
      max: 10,
      default: 1
    }
  },
  run({ imageData, params }) {
    const { width, height, data } = imageData;
    const output = new ImageData(width, height);
    const out = output.data;
    const amount = params.amount;

    const kernel = [
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let r = 0, g = 0, b = 0;

        let i = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = (y + ky) * width + (x + kx);
            const idx = px * 4;
            const w = kernel[i++];

            r += data[idx] * w;
            g += data[idx + 1] * w;
            b += data[idx + 2] * w;
          }
        }

        const idx = (y * width + x) * 4;

        out[idx] = Math.min(255, Math.max(0, data[idx] + r * amount));
        out[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + g * amount));
        out[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + b * amount));
        out[idx + 3] = data[idx + 3];
      }
    }

    return output;
  }
};