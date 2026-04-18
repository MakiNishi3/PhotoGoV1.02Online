const curves = {
  id: "curves",
  name: "Curves",
  params: {
    points: Array.from({ length: 20 }, (_, i) => ({
      [`point${i + 1}`]: { x: 0, y: 0 }
    })),
    channels: {
      r: [],
      g: [],
      b: [],
      rgba: []
    }
  }
};

export default curves;