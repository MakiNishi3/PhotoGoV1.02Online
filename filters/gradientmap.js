export default {
  id: "gradientmap",
  name: "Gradient Map",
  params: {
    points: [
      { position: 0.0, color: [0, 0, 0] },
      { position: 0.14, color: [36, 0, 70] },
      { position: 0.28, color: [0, 32, 120] },
      { position: 0.42, color: [0, 120, 140] },
      { position: 0.56, color: [60, 180, 75] },
      { position: 0.7, color: [255, 225, 25] },
      { position: 0.84, color: [245, 130, 48] },
      { position: 1.0, color: [255, 255, 255] }
    ]
  },
  apply(input) {
    const output = new Uint8ClampedArray(input.length)
    const points = this.params.points.sort((a, b) => a.position - b.position)

    for (let i = 0; i < input.length; i += 4) {
      const r = input[i]
      const g = input[i + 1]
      const b = input[i + 2]
      const a = input[i + 3]

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

      let left = points[0]
      let right = points[points.length - 1]

      for (let j = 0; j < points.length - 1; j++) {
        if (luminance >= points[j].position && luminance <= points[j + 1].position) {
          left = points[j]
          right = points[j + 1]
          break
        }
      }

      const range = right.position - left.position || 1
      const t = (luminance - left.position) / range

      const nr = Math.round(left.color[0] + t * (right.color[0] - left.color[0]))
      const ng = Math.round(left.color[1] + t * (right.color[1] - left.color[1]))
      const nb = Math.round(left.color[2] + t * (right.color[2] - left.color[2]))

      output[i] = nr
      output[i + 1] = ng
      output[i + 2] = nb
      output[i + 3] = a
    }

    return output
  }
}