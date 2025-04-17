
let bg;

function preload() {
  bg = loadImage('center_image.png', () => {
    console.log('Image loaded successfully!');
  }, () => {
    console.log('Image failed to load!');
  });
}

var cnv;
let x = 100;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(1000, 1000);
  centerCanvas();
}

function draw() {
  if (bg) {
    background(bg);
  } else {
    background(255, 0, 200); // fallback if image isn't loaded
  }

  fill(200);
  circle(x, 300, 20); // this draws after background
  x += 1;
}

function windowResized() {
  centerCanvas();
}

