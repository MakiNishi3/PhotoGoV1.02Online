export default {
  id: "grayscale",
  name: "Grayscale",
  params: {
    amount: {
      type: "number",
      min: 0,
      max: 1,
      default: 1
    }
  },
  apply(imageData, { amount }) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = r * 0.299 + g * 0.587 + b * 0.114;
      data[i] = r + (gray - r) * amount;
      data[i + 1] = g + (gray - g) * amount;
      data[i + 2] = b + (gray - b) * amount;
    }
    return imageData;
  }
};