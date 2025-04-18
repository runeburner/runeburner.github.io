export const renderProgress = (
  ctx: CanvasRenderingContext2D,
  pos: Vec,
  progress: Vec,
  color: string
): void => {
  const cap = Math.max(progress[0], progress[1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4 / 64;
  ctx.beginPath();
  ctx.moveTo(pos[0], pos[1] + 60 / 64);
  ctx.lineTo(pos[0] + progress[0] / cap, pos[1] + 60 / 64);
  ctx.stroke();
};
