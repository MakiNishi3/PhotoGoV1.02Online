export default {
  id: "invert",
  name: "Invert",
  params: {
    amount: {
      type: "number",
      min: 0,
      max: 1,
      default: 1
    }
  },
  apply(imageData, params) {
    const data = imageData.data;
    const amount = params.amount;
    const inv = amount * 255;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + (255 - 2 * data[i]) * amount;
      data[i + 1] = data[i + 1] + (255 - 2 * data[i + 1]) * amount;
      data[i + 2] = data[i + 2] + (255 - 2 * data[i + 2]) * amount;
    }

    return imageData;
  }
};