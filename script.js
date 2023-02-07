const board = document.querySelector(".board");
const boardContainer = document.querySelector(".board-container");
const cards = document.querySelector(".cards");
const movement = document.querySelector(".movement");
const timer = document.querySelector(".timer");
const start = document.querySelector("button");
const win = document.querySelector(".win");

let gamestarted = false;
let numFlippedCards = 0;
let totalTime = 0;
let totalNumFlips = 0;
let loop = null;

const getRandom = (arr, num) => {
  const copyAni = [...arr];
  const randomAni = [];

  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * copyAni.length);
    randomAni.push(copyAni[randomIndex]);
    copyAni.splice(randomIndex, 1);
  }

  return randomAni;
};

const shuffle = (arr) => {
  const copyAni = [...arr];
  for (let i = copyAni.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const firstCopy = copyAni[i];

    copyAni[i] = copyAni[randomIndex];
    copyAni[randomIndex] = firstCopy;
  }
  return copyAni;
};

const startGame = () => {
  const animals = ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🐮"];
  const dimensions = boardContainer.getAttribute("data-dimension");
  const getRandomAni = getRandom(animals, (dimensions * dimensions) / 2);
  const items = shuffle([...getRandomAni, ...getRandomAni]);

  const cards = `<div class="board-container grid grid--${dimensions}-cols"  >
  ${items
    .map(
      (item) => `
  <div class="cards">
    <div class="card-front"></div>
    <div class="card-back emoji">${item}</div>
  </div>
  `
    )
    .join("")}
  
</div>`;
  const parser = new DOMParser().parseFromString(cards, "text/html");

  boardContainer.replaceWith(parser.querySelector(".board-container"));
};

const clickEventListners = () => {
  document.addEventListener("click", (e) => {
    const eventTarget = e.target;
    const eventParent = eventTarget.parentElement;

    if (
      eventTarget.className.includes("card") &&
      !eventParent.className.includes("flipped")
    ) {
      flipCard(eventParent);
    } else if (
      eventTarget.nodeName === "BUTTON" &&
      !eventTarget.className.includes("disabled")
    ) {
      startButton();
    }
  });
};

const flipCard = (card) => {
  numFlippedCards++;
  totalNumFlips++;

  if (!gamestarted) {
    startButton();
  }
  if (numFlippedCards <= 2) {
    card.classList.add("flipped");
  }
  if (numFlippedCards === 2) {
    const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
    if (flippedCards[0].innerText === flippedCards[1].innerText) {
      flippedCards[0].classList.add("matched");
      flippedCards[1].classList.add("matched");
      console.log(!flippedCards.length);
    }

    setTimeout(() => {
      flipBack();
    }, 1000);
  }

  //win the game
  if (!document.querySelectorAll(".cards:not(.flipped)").length) {
    setTimeout(() => {
      board.classList.add("flipped");
      win.innerHTML = `<span class="text">You won!<br /> with <span class="highlight">${totalNumFlips}</span> moves under <span class="highlight">${totalTime}</span> seconds</span>
      `;
      clearInterval(loop);
    }, 1000);
  }
};

const startButton = () => {
  gamestarted = true;
  start.classList.add("disabled");
  loop = setInterval(() => {
    totalTime++;
    movement.innerText = `${totalNumFlips} moves`;
    timer.innerText = `time: ${totalTime} sec`;
  }, 1000);
};

const flipBack = () => {
  document.querySelectorAll(".flipped:not(.matched)").forEach((item) => {
    item.classList.remove("flipped");
  });

  numFlippedCards = 0;
};

startGame();
clickEventListners();
