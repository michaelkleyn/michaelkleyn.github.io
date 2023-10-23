let particles = [];
const maxParticles = 1500;
const lifespanDecrease = 2;
const transparencyRange = [50, 200];
let noiseOffsetX, noiseOffsetY;
let lastNoiseChangeTime;
let prevMouseX, prevMouseY;
let speedFactor = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noiseOffsetX = random(1000);  // Initialize with a random value
  noiseOffsetY = random(1000);
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(
    isDarkMode ? 27 : 231,
    isDarkMode ? 55 : 224,
    isDarkMode ? 58 : 209,
    100
  );

  let isMouseMoving = (mouseX !== prevMouseX || mouseY !== prevMouseY);
  let targetSpeedFactor = isMouseMoving ? 1 : 0;
  speedFactor = lerp(speedFactor, targetSpeedFactor, 0.05);  // Adjust the third parameter as needed

  for(let particle of particles) {
    if (isMouseMoving && random(1) < 0.2) {
      particle.attractToMouse();
    }

    particle.move(speedFactor);
    particle.display();
    particle.updateLifespan();
  }

  while(particles.length < maxParticles) {
    particles.push(new Particle());
  }

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function mousePressed() {
  noiseOffsetX = random(1000);
  noiseOffsetY = random(1000);
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(1, 3);
    this.lifespan = random(50, 255);
    this.transparency = random(transparencyRange[0], transparencyRange[1]);
    
    // Directional bias to simulate following an invisible terrain
    this.biasX = random(-0.5, 0.5);
    this.biasY = random(-0.5, 0.5);
  }

  attractToMouse() {
    let mouseVec = createVector(mouseX, mouseY);
    let posVec = createVector(this.x, this.y);
    let forceVec = mouseVec.sub(posVec);
    forceVec.limit(20);  // Limit the magnitude of the attraction force
    posVec.add(forceVec.mult(.3));  // 0.05 is the strength of attraction
    this.x = posVec.x;
    this.y = posVec.y;
  }

  
  move(speedFactor) {
    let angle = noise(this.x * 0.01 + noiseOffsetX, this.y * 0.01 + noiseOffsetY) * TWO_PI * 4;
    this.x += cos(angle) * this.speed * speedFactor + this.biasX;
    this.y += sin(angle) * this.speed * speedFactor + this.biasY;
  
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  
display() {
  if (isDarkMode) {
    fill(231, 224, 209, this.transparency); 
  } else {
    fill(27, 55, 58, this.transparency); 
  }
  noStroke();
  ellipse(this.x, this.y, 2);
}
  
  updateLifespan() {
    this.lifespan -= lifespanDecrease;
  }
}
