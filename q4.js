let cnv;
let x = 500;
let y = 500;
let speed = 3;

// Background images
let bgCenter, bgLeft, bgRight, bgTop, bgBottom;

// Track current location in the plus map
let currentPosition = 'center';

function preload() {
  bgCenter = loadImage('center_image.png');
  bgLeft = loadImage('two.png');
  bgRight = loadImage('three.png');
  bgTop = loadImage('four.png');
  bgBottom = loadImage('five.png');
}

function centerCanvas() {
  let cx = (windowWidth - width) / 2;
  let cy = (windowHeight - height) / 2;
  cnv.position(cx, cy);
}

function setup() {
  cnv = createCanvas(1000, 1000);
  centerCanvas();
}

function draw() {
  background(200);
  drawBackground();
  handleMovement();
  checkBorders();

  fill(200);
  circle(x, y, 20);
}

function drawBackground() {
  switch (currentPosition) {
    case 'center':
      background(bgCenter);
      break;
    case 'left':
      background(bgLeft);
      break;
    case 'right':
      background(bgRight);
      break;
    case 'top':
      background(bgTop);
      break;
    case 'bottom':
      background(bgBottom);
      break;
    default:
 background(255, 0, 200);
  }
}

function handleMovement() {
  if (keyIsDown(87)) y -= speed; // W
  if (keyIsDown(83)) y += speed; // S
  if (keyIsDown(65)) x -= speed; // A
  if (keyIsDown(68)) x += speed; // D
}

function checkBorders() {
  // Left edge
  if (x < 0) {
    if (currentPosition === 'center') {
      currentPosition = 'left';
      x = width - 5;
    } else if (currentPosition === 'right') {
      currentPosition = 'center';
      x = width - 5;
    }
  }
  // Right edge
  else if (x > width) {
    if (currentPosition === 'center') {
      currentPosition = 'right';
      x = 5;
    } else if (currentPosition === 'left') {
      currentPosition = 'center';
      x = 5;
    }
  }

  // Top edge
  if (y < 0) {
    if (currentPosition === 'center') {
      currentPosition = 'top';
      y = height - 5;
    } else if (currentPosition === 'bottom') {
      currentPosition = 'center';
      y = height - 5;
    }
  }
  // Bottom edge
  else if (y > height) {
    if (currentPosition === 'center') {
      currentPosition = 'bottom';
      y = 5;
    } else if (currentPosition === 'top') {
      currentPosition = 'center';
      y = 5;
    }
  }
}

function windowResized() {
 centerCanvas();
}

