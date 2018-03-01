let SnakeGame = function() {
  const GRID_SIZE = 25;
  const AREA_LIMIT = GRID_SIZE - 1;
  const INITIAL_SEGMENTS = 3;
  const DIRECTIONS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
  const INITIAL_HEAD = { x: 11, y: 12, dir: DIRECTIONS.left };
  const GAME_STATE = { INIT: 0, RUN: 1, FAIL: 2 };
  const AREA_BACKGROUND_COLOR = 'black';
  const SPEED = 1000 / 20; // steps per second
  const food = {};

  let score = 0;
  let gameState = GAME_STATE.INIT;
  let clientScr;
  let ctx;
  let snake;
  let segmentSize;
  let t1 = 0;
  let frameRequest;

  const Snake = function Snake(initx, inity, initdir, num_segments) {
    const self = this;

    self.createSegment = function createSegment(pX, pY, p, n) {
      return { x: pX, y: pY, prev: p, next: n };
    };
    self.addSegment = function addSegment(cx, cy) {
      const segment = self.createSegment(self.tail.x + cx, self.tail.y + cy, self.tail, null);
      self.tail.next = segment;
      self.tail = segment;
    };
    self.draw = function() {
      let segment = self.head.next;     
      while (segment) {
        drawElement('gray', segment.x, segment.y);
        segment = segment.next;
      }
      drawElement('red', self.head.x , self.head.y);
    }
    self.dir = initdir;
    self.head = self.createSegment(initx, inity, null, null);
    self.tail = self.head;
    for (let s = 0; s < num_segments; s++) {
      self.addSegment(-initdir[0], -initdir[1]);
    }
  };
  function createSnake(headData, numSegments) {
    snake = new Snake(headData.x, headData.y, headData.dir, INITIAL_SEGMENTS);
    return snake;
  }
  function placeFood() {
    food.x = Math.floor(Math.random() * AREA_LIMIT);
    food.y = Math.floor(Math.random() * AREA_LIMIT);
  }
  function checkAutoCollision() {
    let segment = snake.head.next;
    while (segment) {
      if (segment.x === snake.head.x && segment.y === snake.head.y) { return true; }
      segment = segment.next;
    }
    return false;
  }
  function checkLimits() {
    if (snake.head.x < 0) snake.head.x = AREA_LIMIT;
    else if (snake.head.x > AREA_LIMIT) snake.head.x = 0;

    if (snake.head.y < 0) snake.head.y = AREA_LIMIT;
    else if (snake.head.y > AREA_LIMIT) snake.head.y = 0;
  }
  function showScore(pScore) {
    document.getElementById('score').innerHTML = pScore;
  }
  function checkFood() {
    if (food.x === snake.head.x && food.y === snake.head.y) {
      score++;
      showScore(score);
      snake.addSegment(0,0);
      placeFood();
    }
  }
  function drawElement(color, pX, pY, sX, sY) {
    ctx.fillStyle = color;
    ctx.fillRect(pX * segmentSize, pY * segmentSize, segmentSize, segmentSize);
  }
  function clearScr() {
    ctx.fillStyle = AREA_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, clientScr.width, clientScr.height);
  }
  function drawFood() {
    drawElement('green', food.x , food.y);
  }
  function printMsg(text) {
    document.getElementById('msgs').innerHTML = text;
  }
  function render() {
    clearScr();
    drawFood();
    snake.draw();
  }
  function move() {
    snake.tail.x = snake.head.x + snake.dir[0];
    snake.tail.y = snake.head.y + snake.dir[1];
    snake.tail.next = snake.head;
    snake.head.prev = snake.tail;
    snake.head = snake.tail;
    snake.tail = snake.tail.prev;
    snake.head.prev = null;
    snake.tail.next = null;
  }
  function stopGame() {
    cancelAnimationFrame(frameRequest);
    printMsg('Game Over');
  }
  function update(t) {
    if (checkAutoCollision()) {
      gameState = GAME_STATE.FAIL;
      stopGame();
      render();
      return;
    }
    if (t - t1 > SPEED) {
      move();
      t1 = t;
    }
    checkLimits();
    checkFood();
    render();
    frameRequest = requestAnimationFrame(update);
  }
  function start() {
    if (gameState !== GAME_STATE.INIT) {
      snake = createSnake(INITIAL_HEAD, INITIAL_SEGMENTS);
      score = 0;
    }
    printMsg('');
    placeFood();
    gameState = GAME_STATE.RUN;
    frameRequest = requestAnimationFrame(update);
  }
  function handleKeyUp(e) {
    switch (e.keyCode) {
      case 32: start(); break;
      case 38: snake.dir = DIRECTIONS.up; move(); break;
      case 40: snake.dir = DIRECTIONS.down; move(); break;
      case 37: snake.dir = DIRECTIONS.left; move(); break;
      case 39: snake.dir = DIRECTIONS.right; move();
    }
  }
  function init() {
    clientScr = doc.getElementById('canvas');
    ctx = clientScr.getContext('2d');
    segmentSize = clientScr.width / GRID_SIZE;
    clientScr.addEventListener('keyup', handleKeyUp, true);
    snake = createSnake(INITIAL_HEAD, INITIAL_SEGMENTS);
    render();
  }
  init();
};
SnakeGame();
