
let bg;
let cnv;
let x = 100;
let y = 300;
let speed = 3;

// Add a second background image
let bg2;
let currentBg;

function preload() {
  bg = loadImage('center_image.png', () => {
    console.log('Image 1 loaded successfully!');
  }, () => {
    console.log('Image 1 failed to load!');
  });

  bg2 = loadImage('two.png', () => {
    console.log('Image 2 loaded successfully!');
  }, () => {
    console.log('Image 2 failed to load!');
  });
}

function centerCanvas() {
  let cx = (windowWidth - width) / 2;
  let cy = (windowHeight - height) / 2;
  cnv.position(cx, cy);
}

function setup() {
  cnv = createCanvas(1000, 1000);
  centerCanvas();
  currentBg = bg; // Start with the first background
}

function draw() {
  if (currentBg) {
    background(currentBg);
  } else {
    background(255, 0, 200); // fallback color
  }

  // Movement logic
  if (keyIsDown(87)) { // W
    y -= speed;
  }
  if (keyIsDown(83)) { // S
    y += speed;
  }
  if (keyIsDown(65)) { // A
    x -= speed;
  }
  if (keyIsDown(68)) { // D
    x += speed;
  }

  checkBorders();
  fill(200);
  circle(x, y, 20);
}

function windowResized() {
  centerCanvas();
}

// ------------------
// Check if circle hits borders
function checkBorders() {
  if (x <= 0 || x >= width) {
    // Swap the background
    if (currentBg === bg) {
      currentBg = bg2;
    } else {
      currentBg = bg;
    }

    // Optional: reposition the circle slightly inside to avoid rapid flipping
    if (x < 0) x = 1;
    if (x >= width-5) x = width - 1;
  }
}

