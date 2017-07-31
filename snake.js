(function (globalScope, doc) {
  const GRID_SIZE = 25;
  const AREA_LIMIT = GRID_SIZE - 1;
  const INITIAL_SEGMENTS = 5;
  const DIRECTIONS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
  const INITIAL_HEAD = { x: 11, y: 12, dir: DIRECTIONS.left };
  const GAME_STATE = { INIT: 0, RUN: 1, FAIL: 2 };
  const AREA_BACKGROUND_COLOR = 'black';
  const SPEED = 15; // steps per second
  const food = {};

  let score = 0;
  let gameState = GAME_STATE.INIT;
  let timer;
  let clientScr;
  let ctx;
  let snake;
  let segmentSize;

  const Snake = function Snake(initx, inity, initdir) {
    const self = this;
    self.dir = initdir;
    self.head = { x: initx, y: inity };
    self.tail = self.head;
    self.createSegment = function createSegment(pX, pY, p, n) {
      return { x: pX, y: pY, prev: p, next: n };
    };
    self.addSegment = function addSegment() {
      const segment = self.createSegment(self.tail.x - self.dir[0], self.tail.y - self.dir[1], self.tail, null);
      self.tail.next = segment;
      self.tail = segment;
    };
  };
  function createSnake(headData, numSegments) {
    snake = new Snake(headData.x, headData.y, headData.dir);
    for (let s = 0; s <= numSegments; s++) {
      snake.addSegment();
    }
    return snake;
  }
  function placeFood() {
    food.x = Math.floor(Math.random() * AREA_LIMIT);
    food.y = Math.floor(Math.random() * AREA_LIMIT);
  }
  function checkAutoCollision() {
    let segment = snake.head.next;
    while (segment) {
      if (segment.x === snake.head.x && segment.y === snake.head.y) {
        return true;
      }
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
      snake.addSegment();
      placeFood();
    }
  }
  function drawElement(color, pX, pY, sX, sY) {
    ctx.fillStyle = color;
    ctx.fillRect(pX, pY, sX, sY);
  }
  function clearScr() {
    drawElement(AREA_BACKGROUND_COLOR, 0, 0, clientScr.width, clientScr.height);
  }
  function drawSegment(x, y) {
    drawElement('gray', x * segmentSize, y * segmentSize, segmentSize, segmentSize);
  }
  function drawHead() {
    drawElement('red', snake.head.x * segmentSize, snake.head.y * segmentSize, segmentSize, segmentSize);
  }
  function drawFood() {
    drawElement('green', food.x * segmentSize, food.y * segmentSize, segmentSize, segmentSize);
  }
  function eraseTail() {
    drawElement(
      AREA_BACKGROUND_COLOR, snake.tail.x * segmentSize, snake.tail.y * segmentSize, segmentSize, segmentSize);
  }
  function printMsg(text) {
    doc.getElementById('msgs').innerHTML = text;
  }
  function render() {
    drawHead();
    drawSegment(snake.head.next.x, snake.head.next.y);
    drawFood();
  }
  function move() {
    eraseTail();
    snake.tail.x = snake.head.x + snake.dir[0];
    snake.tail.y = snake.head.y + snake.dir[1];

    snake.head.prev = snake.tail;
    snake.tail.next = snake.head;
    snake.head = snake.tail;

    snake.tail = snake.tail.prev;
    snake.tail.next = null;
  }
  function stopGame() {
    clearInterval(timer);
    printMsg('Game Over');
  }
  function renderInit() {
    printMsg('');
    clearScr();
    let segment = snake.head.next;
    while (segment) {
      drawSegment(segment.x, segment.y);
      segment = segment.next;
    }
    drawHead();
  }
  function update() {
    move();
    checkLimits();
    checkFood();
    if (checkAutoCollision()) { gameState = GAME_STATE.FAIL; stopGame(timer); }
    render();
  }
  function start() {
    if (gameState !== GAME_STATE.INIT) {
      if (timer) clearInterval(timer);
      snake = createSnake(INITIAL_HEAD, INITIAL_SEGMENTS);
      score = 0;
      showScore(0);
    }
    placeFood();
    renderInit();
    gameState = GAME_STATE.RUN;
    timer = setInterval(update, 1000 / SPEED);
  }
  function handleKeyUp(e) {
    switch (e.keyCode) {
      case 32: start(); break;
      case 38: snake.dir = DIRECTIONS.up; break;
      case 40: snake.dir = DIRECTIONS.down; break;
      case 37: snake.dir = DIRECTIONS.left; break;
      case 39: snake.dir = DIRECTIONS.right;
    }
  }
  function init() {
    clientScr = doc.getElementById('canvas');
    ctx = clientScr.getContext('2d');
    segmentSize = clientScr.width / GRID_SIZE;
    clientScr.addEventListener('keyup', handleKeyUp, true);
    snake = createSnake(INITIAL_HEAD, INITIAL_SEGMENTS);
    renderInit();
  }

  init();
}(window, document));
