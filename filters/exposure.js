export default {
  id: "exposure",
  name: "Exposure",
  params: {
    amount: {
      type: "number",
      min: -100,
      max: 100,
      default: 0
    }
  },
  apply: function (imageData, params) {
    const data = imageData.data;
    const factor = params.amount / 100 * 255;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + factor));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + factor));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + factor));
    }

    return imageData;
  }
};