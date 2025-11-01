const fs = require('fs');
const { createCanvas } = require('canvas');

// 북마크 모양을 그리는 함수
function drawBookmark(ctx, size, color) {
  const padding = size * 0.2;
  const width = size - padding * 2;
  const height = size - padding * 2;
  const x = padding;
  const y = padding;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width / 2, y + height - width * 0.25);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.fill();
}

// 아이콘 생성 함수
function generateIcon(size, color, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 투명 배경
  ctx.clearRect(0, 0, size, size);

  // 북마크 그리기
  drawBookmark(ctx, size, color);

  // PNG로 저장
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`✓ ${filename} 생성 완료`);
}

// 아이콘 생성
const sizes = [16, 48, 128];
const activeColor = '#3B82F6';  // 파란색
const inactiveColor = '#9CA3AF';  // 회색

sizes.forEach(size => {
  generateIcon(size, activeColor, `icons/icon-active-${size}.png`);
  generateIcon(size, inactiveColor, `icons/icon-inactive-${size}.png`);
});

console.log('\n모든 아이콘이 성공적으로 생성되었습니다!');
