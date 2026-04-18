export default {
  id: "kaleidoscope",
  name: "Kaleidoscope",
  params: {
    angle: { type: "number", min: -360, max: 360, default: 0 },
    segments: { type: "number", min: 2, max: 24, default: 6 }
  },
  apply: function (ctx, canvas, params) {
    const { angle, segments } = params;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tctx = tempCanvas.getContext("2d");
    tctx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, w, h);

    const slice = (Math.PI * 2) / segments;

    for (let i = 0; i < segments; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(i * slice + (angle * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.max(w, h), -slice / 2, slice / 2);
      ctx.closePath();
      ctx.clip();
      if (i % 2 === 0) {
        ctx.scale(1, -1);
      }
      ctx.drawImage(tempCanvas, -cx, -cy);
      ctx.restore();
    }
  }
};