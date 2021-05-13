const WIDTH = window.innerWidth;
const HEIGHT = 400;

const SMALL_SIZE = WIDTH / 50;
const BIG_SIZE = WIDTH / 10;

var clack;
var COUNT = 0;
let countDiv;
let DIGITS = 4;
let TIME_STEP = Math.pow(10, DIGITS - 2);
if (TIME_STEP < 1) TIME_STEP = 1;

function Block(x, v, m, size, xConstraint) {
  this.x = x;
  this.y = HEIGHT - size;
  this.v = v;
  this.m = m;
  this.size = size;
  this.xConstraint = xConstraint;

  this.show = function (color) {
    noStroke();
    fill(color);
    const x = constrain(this.x, this.xConstraint, window.innerWidth);
    rect(x, this.y, this.size);
  };

  this.update = function () {
    this.x += this.v;
  };

  this.collide = function (other) {
    if (this.x + this.size < other.x || this.x > other.x + other.size)
      return false;
    return true;
  };

  this.hitWall = function () {
    return this.x <= 0;
  };

  this.reverse = function () {
    this.v *= -1;
  };

  this.change = function (other) {
    var v = this.v;
    var m = this.m;
    var newV = ((m - other.m) / (m + other.m)) * v;
    newV += (2 * other.m * other.v) / (m + other.m);
    return newV;
  };
}

const m2 = Math.pow(100, DIGITS - 1);
var block1 = new Block(100, 0, 1, SMALL_SIZE, 0);
var block2 = new Block(400, -2 / TIME_STEP, m2, BIG_SIZE, SMALL_SIZE);


function preload() {
  clack = loadSound("clack.wav");
}

function setup() {
  createCanvas(WIDTH, 600);
  countDiv = createDiv(COUNT);
  countDiv.style("font-size", "72pt");
}

function draw() {
  background(0);
  noFill();
  stroke(255);
  line(0, HEIGHT, WIDTH, HEIGHT);

  let clackSound = false;
  for (let i = 0; i < TIME_STEP; i++) {
    if (block1.collide(block2)) {
      COUNT++;
      v1 = block1.change(block2);
      v2 = block2.change(block1);
      block1.v = v1;
      block2.v = v2;
      clackSound = true;
      
    }
    if (block1.hitWall()) {
      COUNT++;
      block1.reverse();
      clackSound = true;
    }
    block1.update();
    block2.update();
  }

  if (clackSound) clack.play();
  block1.show(color(0, 200, 0));
  block2.show(color(0, 200, 0));
  countDiv.html(nf(COUNT, DIGITS));
}
