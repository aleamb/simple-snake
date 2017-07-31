(function (globalScope, doc) {
  const GRID_SIZE = 25;
  const AREA_LIMIT = GRID_SIZE - 1;
  const INITIAL_SEGMENTS = 5;
  const DIRECTIONS = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1],
  };
  const INITIAL_HEAD = { x: 11, y: 12, dir: DIRECTIONS.left };
  const GAME_STATE = { INIT: 0, RUN: 1, FAIL: 2 };
  const food = { x: 5, y: 5 };
  let score = 0;

  const Snake = function (initx, inity, initdir) {
    const self = this;
    self.dir = initdir;
    self.head = {
      x: initx,
      y: inity,
    };
    self.tail = self.head;
    self.createSegment = function (pX, pY, p, n) {
      return { x: pX, y: pY, prev: p, next: n };
    };
    self.addSegment = function () {
      const segment = self.createSegment(self.tail.x - self.dir[0], self.tail.y - self.dir[1], self.tail, null);
      self.tail.next = segment;
      self.tail = segment;
    };
  };

  let gameState = GAME_STATE.INIT;
  let timer;
  let clientScr;
  let ctx;
  let ringSize;

  init();

  function init() {
    clientScr = doc.getElementById('canvas');
    ctx = clientScr.getContext('2d');
    segmentSize = clientScr.width / GRID_SIZE;
    clientScr.addEventListener('keyup', handleKeyUp, true);
    clientScr.addEventListener('keydown', handleKeyDown, true);
    snake = createSnake(INITIAL_HEAD, INITIAL_SEGMENTS);
    renderInit();
  }

  function createSnake(headData, numSegments) {
    const snake = new Snake(headData.x, headData.y, headData.dir);
    for (let s = 0; s <= numSegments; s++) {
      snake.addSegment();
    }
    return snake;
  }

  function update() {
    let state;
    render();
    state = check();
    if (state === GAME_STATE.FAIL) stopGame(timer);
    move();
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

  function handleKeyUp(e) {
    switch (e.keyCode) { case 32: start(); }
  }
  function handleKeyDown(e) {
    switch (e.keyCode) {
      case 38: snake.dir = DIRECTIONS.up; break;
      case 40: snake.dir = DIRECTIONS.down; break;
      case 37: snake.dir = DIRECTIONS.left; break;
      case 39: snake.dir = DIRECTIONS.right;
    }
  }

  function start() {
    if (gameState !== GAME_STATE.INIT) {
      if (timer) clearInterval(timer);
      snake = createSnake(INITIAL_HEAD, INITIAL_SEGMENTS);
      score = 0;
      showScore(0);
    }
    renderInit();
    gameState = GAME_STATE.RUN;
    timer = setInterval(update, 50);
  }

  function check() {
    checkLimits();
    checkFood();
    if (checkAutoCollision()) { return GAME_STATE.FAIL; }
    return GAME_STATE.RUN;
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
    const head = snake.head;

    if (head.x < 0) head.x = AREA_LIMIT;
    else if (head.x > AREA_LIMIT) head.x = 0;

    if (head.y < 0) head.y = AREA_LIMIT;
    else if (head.y > AREA_LIMIT) head.y = 0;
  }
  function checkFood() {
    if (food.x === snake.head.x && food.y === snake.head.y) {
      score++;
      showScore(score);
      snake.addSegment();
      food.x = Math.floor(Math.random() * AREA_LIMIT);
      food.y = Math.floor(Math.random() * AREA_LIMIT);
    }
  }
  function showScore(pScore) {
    document.getElementById('score').innerHTML = pScore;
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

  function clearScr() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, clientScr.width, clientScr.height);
  };

  function drawSegment(x, y) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(x * segmentSize, y * segmentSize, segmentSize, segmentSize);
  }

  function drawHead() {
    ctx.fillStyle = 'red';
    ctx.fillRect(snake.head.x * segmentSize, snake.head.y * segmentSize, segmentSize, segmentSize);
  }
  function drawFood() {
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x * segmentSize, food.y * segmentSize, segmentSize, segmentSize);
  }
  function eraseTail() {
    ctx.fillStyle = 'black';
    ctx.fillRect(snake.tail.x * segmentSize, snake.tail.y * segmentSize, segmentSize, segmentSize);
  }
  function printMsg(text) {
    doc.getElementById('msgs').innerHTML = text;
  }
}(window, document));
