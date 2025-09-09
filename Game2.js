const gameArea = document.getElementById('gameArea');
const basket = document.getElementById('basket');
const scoreElement = document.getElementById('score');
let score = 0;

const fruits = [
  'https://cdn-icons-png.flaticon.com/512/415/415733.png', // Apple
  'https://cdn-icons-png.flaticon.com/512/415/415734.png', // Banana
  'https://cdn-icons-png.flaticon.com/512/415/415735.png'  // Orange
];

// Move basket with arrow keys
document.addEventListener('keydown', (e) => {
  const basketLeft = basket.offsetLeft;
  if (e.key === 'ArrowLeft' && basketLeft > 0) {
    basket.style.left = basketLeft - 30 + 'px';
  }
  if (e.key === 'ArrowRight' && basketLeft < gameArea.offsetWidth - basket.offsetWidth) {
    basket.style.left = basketLeft + 30 + 'px';
  }
});

// Create falling fruits
function createFruit() {
  const fruit = document.createElement('div');
  fruit.classList.add('fruit');
  fruit.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
  fruit.style.top = '0px';
  fruit.style.backgroundImage = `url(${fruits[Math.floor(Math.random() * fruits.length)]})`;
  gameArea.appendChild(fruit);

  let fallInterval = setInterval(() => {
    const fruitTop = parseInt(fruit.style.top);
    if (fruitTop < gameArea.offsetHeight - 50) {
      fruit.style.top = fruitTop + 5 + 'px';
    } else {
      clearInterval(fallInterval);
      gameArea.removeChild(fruit);
    }

    // Collision detection
    const fruitRect = fruit.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    if (
      fruitRect.bottom > basketRect.top &&
      fruitRect.left < basketRect.right &&
      fruitRect.right > basketRect.left
    ) {
      score++;
      scoreElement.textContent = score;
      clearInterval(fallInterval);
      gameArea.removeChild(fruit);
    }
  }, 30);
}

// Spawn fruits every second
setInterval(createFruit, 1000);
