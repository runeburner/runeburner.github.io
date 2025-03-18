export const renderProgress = (
  ctx: CanvasRenderingContext2D,
  pos: Vec,
  progress: Vec,
  color: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(pos[0] * 64, pos[1] * 64 + 60);
  ctx.lineTo((pos[0] + progress[0] / progress[1]) * 64, pos[1] * 64 + 60);
  ctx.stroke();
};
