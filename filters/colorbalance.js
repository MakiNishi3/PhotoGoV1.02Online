export default {
  id: "colorbalance",
  name: "Color Balance",
  params: {
    amount: {
      type: "number",
      min: 0,
      max: 1,
      default: 0.5
    }
  },
  apply(imageData, { amount }) {
    const data = imageData.data;
    const rFactor = 1 + amount * 0.2;
    const gFactor = 1;
    const bFactor = 1 - amount * 0.2;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * rFactor);
      data[i + 1] = Math.min(255, data[i + 1] * gFactor);
      data[i + 2] = Math.min(255, data[i + 2] * bFactor);
    }

    return imageData;
  }
};