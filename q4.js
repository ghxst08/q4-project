let cnv;
let x = 500;
let y = 500;
let speed = 7;

let bgCenter, bgLeft, bgRight, bgTop, bgBottom;
let currentPosition = 'center';

let showFishingPrompt = false;
let fishingPromptDiv;
let movementEnabled = true;
let fishingCooldown = 0;

let sliderPos = 0;
let direction = 1;
const barWidth = 600;
const sliderWidth = 10;
const speedSlider = 10;
let greenZoneStart, greenZoneEnd;
let gameActive = false;
let castingSuccess = null;

let money = 0;
let moneyDiv;

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

  // Position moneyDiv relative to canvas, not browser
  if (moneyDiv) {
    moneyDiv.position(cx + width - 210, cy + 10);
  }
}

function setup() {
  cnv = createCanvas(1000, 1000);
  centerCanvas();

  moneyDiv = createDiv('Money: $' + money);
  moneyDiv.id('moneyCounter');
  moneyDiv.style('position', 'absolute');
  moneyDiv.style('padding', '10px');
  moneyDiv.style('background', 'white');
  moneyDiv.style('border', '2px solid black');
  moneyDiv.style('border-radius', '10px');
  moneyDiv.style('font-size', '24px');
  moneyDiv.style('z-index', '20');

  if (!fishingPromptDiv) {
    fishingPromptDiv = createDiv();
    fishingPromptDiv.style('position', 'absolute');
    fishingPromptDiv.style('top', '40%');
    fishingPromptDiv.style('left', 'calc(50% - 150px)');
    fishingPromptDiv.style('width', '300px');
    fishingPromptDiv.style('padding', '20px');
    fishingPromptDiv.style('background', 'rgba(255, 255, 255, 0.95)');
    fishingPromptDiv.style('border', '2px solid black');
    fishingPromptDiv.style('border-radius', '10px');
    fishingPromptDiv.style('text-align', 'center');
    fishingPromptDiv.style('z-index', '10');
    fishingPromptDiv.style('box-shadow', '0 4px 8px rgba(0,0,0,0.2)');
    fishingPromptDiv.hide();
  }
}

function draw() {
  background(200);
  drawBackground();

  if (movementEnabled) {
    handleMovement();
  }

  checkBorders();
  checkFishingZone();

  if (fishingCooldown > 0) fishingCooldown--;

  fill(200);
  circle(x, y, 20);

  if (gameActive) {
    moveSlider();
    drawSlider();
  }
}

function drawBackground() {
  switch (currentPosition) {
    case 'center': background(bgCenter); break;
    case 'left': background(bgLeft); break;
    case 'right': background(bgRight); break;
    case 'top': background(bgTop); break;
    case 'bottom': background(bgBottom); break;
    default: background(255, 0, 200);
  }
}

function handleMovement() {
  if (keyIsDown(87) || keyIsDown(38)) y -= speed;
  if (keyIsDown(83) || keyIsDown(40)) y += speed;
  if (keyIsDown(65) || keyIsDown(37)) x -= speed;
  if (keyIsDown(68) || keyIsDown(39)) x += speed;
}

function checkBorders() {
  if (x < 0) {
    if (currentPosition === 'center') { currentPosition = 'left'; x = width - 5; }
    else if (currentPosition === 'right') { currentPosition = 'center'; x = width - 5; }
  } else if (x > width) {
    if (currentPosition === 'center') { currentPosition = 'right'; x = 5; }
    else if (currentPosition === 'left') { currentPosition = 'center'; x = 5; }
  }

  if (y < 0) {
    if (currentPosition === 'center') { currentPosition = 'top'; y = height - 5; }
    else if (currentPosition === 'bottom') { currentPosition = 'center'; y = height - 5; }
  } else if (y > height) {
    if (currentPosition === 'center') { currentPosition = 'bottom'; y = 5; }
    else if (currentPosition === 'top') { currentPosition = 'center'; y = 5; }
  }
}

function checkFishingZone() {
  if (fishingCooldown === 0 && !showFishingPrompt && movementEnabled) {
    if (currentPosition === 'top' && abs(y - 430) <= 8 ||
        currentPosition === 'left' && abs(x - 360) <= 8 ||
        currentPosition === 'bottom' && abs(y - 550) <= 8) {
      showFishingPrompt = true;
      movementEnabled = false;
      showFishingButtons();
    }
  }
}

function startFishingGame() {
  const zoneWidth = 60;
  const maxStart = barWidth - zoneWidth;
  greenZoneStart = Math.floor(Math.random() * maxStart);
  greenZoneEnd = greenZoneStart + zoneWidth;
  gameActive = true;
  sliderPos = 0;
  direction = 1;
  moveSlider();
}

function showFishingButtons() {
  fishingPromptDiv.html(`
    <div style="text-align: center;">
      <h3>Start Fishing?</h3>
      <button id="castBtn" style="font-size: 20px; padding: 10px 20px;">Cast</button>
      <button id="cancelBtn" style="font-size: 20px; padding: 10px 20px;">Cancel</button>
    </div>
  `);

  fishingPromptDiv.show();

  select('#castBtn').mousePressed(() => {
    hideFishingButtons();
    startFishingGame();
  });

  select('#cancelBtn').mousePressed(cancelFishing);
}

function hideFishingButtons() {
  if (fishingPromptDiv) fishingPromptDiv.hide();
}

function checkCast() {
  const sliderCenter = sliderPos + sliderWidth / 2;
  castingSuccess = sliderCenter >= greenZoneStart && sliderCenter <= greenZoneEnd;
  showCatchPrompt(castingSuccess);
  gameActive = false;
}

function showCatchPrompt(success) {
  let message = success ? "You caught a fish!" : "You failed!";
  let imagePath = '';

  if (success && currentPosition === 'top') {
    const rand = Math.random();
    if (rand < 0.40) { message = "You caught a Bluegill!"; imagePath = "bluegill.jpg"; }
    else if (rand < 0.60) { message = "You caught a Yellow Perch!"; imagePath = "yellow_perch.jpg"; }
    else if (rand < 0.80) { message = "You caught a White Perch!"; imagePath = "white_perch.jpg"; }
    else if (rand < 0.90) { message = "You caught a Largemouth Bass!"; imagePath = "largemouth_bass.jpg"; }
    else if (rand < 0.95) { message = "You caught a Pickerel!"; imagePath = "pickerel.jpg"; }
    else { message = "You caught a Common Carp!"; imagePath = "commoncarp.jpg"; }
  }

  if (success && currentPosition === 'bottom') {
    const rand = Math.random();
    if (rand < 0.40) { message = "You caught a Peacock Bass!"; imagePath = "peacock_bass.jpg"; }
    else if (rand < 0.60) { message = "You caught a Piranha!"; imagePath = "piranha.jpg"; }
    else if (rand < 0.72) { message = "You caught a Tautog!"; imagePath = "tautog.jpg"; }
    else if (rand < 0.82) { message = "You caught a Tilefish!"; imagePath = "tilefish.jpg"; }
    else if (rand < 0.90) { message = "You caught a Hogfish!"; imagePath = "hogfish.jpg"; }
    else if (rand < 0.95) { message = "You caught an Oscar!"; imagePath = "oscar.jpg"; }
    else { message = "You caught a Willy Mammoth!"; imagePath = "willy.jpg"; }
  }
// Add fish probabilities for the bottom position
  if (success && currentPosition === 'left') {
    const rand = Math.random();
    if (rand < 0.60) { message = "You caught a Squid!"; imagePath = "squid.jpg"; }
    else if (rand < 0.65) { message = "You caught a Travis Scott Fish!"; imagePath = "travis.jpg"; }
    else if (rand < 0.75) { message = "You caught The Dawgon!"; imagePath = "braiden.jpg"; }
    else if (rand < 0.82) { message = "You caught a JB-Tirty-Fore!"; imagePath = "jb.jpg"; }
    else if (rand < 0.85) { message = "You caught The Chelillini!"; imagePath = "ben.jpg"; }
    else if (rand < 0.95) { message = "You caught Da SeBass!"; imagePath = "sebastian.jpg"; }
   else if (rand < 0.96) { message = "You caught The Deacs!"; imagePath = "deacon.jpg"; }
    else { message = "You caught a Pedro!"; imagePath = "pedro.jpg"; }
  }

let fishingPromptDiv;

function setup() {
  noCanvas();
  fishingPromptDiv = createDiv('');
  
  let message = "You caught a fish!";
  let imagePath = "https://example.com/fish.png";  // or null
  let success = true;

  updatePrompt(message, imagePath, success);
  
  // Add event listeners after HTML is inserted
  fishingPromptDiv.elt.addEventListener('click', (e) => {
    if(e.target.id === 'castAgainBtn') {
      console.log("Cast Again clicked");
    } else if (e.target.id === 'cancelBtn') {
      console.log("Cancel clicked");
    }
  });
}

function updatePrompt(message, imagePath, success) {
  fishingPromptDiv.html(`
    <div style="text-align: center;">
      <h3>${message}</h3>
      ${imagePath ? `<img src="${imagePath}" style="max-width: 100%; max-height: 180px; display: block; margin: 10px auto;">` : ''}
      <button id="castAgainBtn" style="font-size: 20px; padding: 10px 20px;">
        ${success ? 'Cast Again' : 'Try Again'}
      </button>
      <button id="cancelBtn" style="font-size: 20px; padding: 10px 20px;">Cancel</button>
    </div>
  `);
}
  fishingPromptDiv.show();

  select('#castAgainBtn').mousePressed(() => {
    hideFishingButtons();
    startFishingGame();
  });

  select('#cancelBtn').mousePressed(cancelFishing);
}

function cancelFishing() {
  movementEnabled = true;
  showFishingPrompt = false;
  fishingCooldown = 60;
  castingSuccess = null;
  gameActive = false;
  if (fishingPromptDiv) fishingPromptDiv.hide();
}

function moveSlider() {
  sliderPos += direction * speedSlider;
  if (sliderPos <= 0 || sliderPos >= barWidth - sliderWidth) direction *= -1;
}

function drawSlider() {
  fill(0);
  rect(200, height - 100, barWidth, 10);
  fill(0, 255, 0);
  rect(200 + greenZoneStart, height - 100, greenZoneEnd - greenZoneStart, 10);
  fill(255, 0, 0);
  rect(200 + sliderPos, height - 100, sliderWidth, 20);
}

function windowResized() {
  centerCanvas();
}

function keyPressed() {
  if (keyCode === 32 && gameActive) {
    checkCast();
  }
}
