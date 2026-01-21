const fs = require('fs');

// Read poems from the simple text file
const poemsText = fs.readFileSync('poems.txt', 'utf8');

// Parse the poems
const poemBlocks = poemsText.trim().split('\n===\n').filter(block => block.trim());
const poems = poemBlocks.map(block => {
  const parts = block.split('\n---\n');
  const text = parts[0].trim();
  const meta = parts[1].trim();
  const [title, author] = meta.split(' — ');
  return { text, title, author };
});

const now = new Date();
const estOffset = -5 * 60;
const estTime = new Date(now.getTime() + (estOffset + now.getTimezoneOffset()) * 60000);
const start = new Date(estTime.getFullYear(), 0, 0);
const diff = estTime - start;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);

const poemsJson = JSON.stringify(poems);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Daily Poem</title>

<style>
  :root {
    --bg: #2b2b2b;
    --text: #ffffff;
    --button: #444;
  }

  body.light {
    --bg: #f4f4f4;
    --text: #111;
    --button: #ddd;
  }

  body {
    background-color: var(--bg);
    color: var(--text);
    font-family: Georgia, serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
  }

  .container {
    max-width: 800px;
    padding: 40px;
    text-align: center;
  }

  .poem {
    white-space: pre-wrap;
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 30px;
    min-height: 200px;
  }

  .meta {
    font-weight: bold;
    margin-bottom: 30px;
  }

  .date {
    color: #888;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .controls {
    margin-bottom: 20px;
  }

  button {
    background: var(--button);
    color: var(--text);
    border: none;
    padding: 10px 18px;
    font-size: 15px;
    cursor: pointer;
    margin: 5px;
    border-radius: 4px;
  }

  button:hover {
    opacity: 0.85;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nav-buttons {
    margin-bottom: 15px;
  }
</style>
</head>

<body>
<div class="container">
  <div class="date" id="dateDisplay"></div>
  <div class="poem" id="poemText"></div>
  <div class="meta" id="poemMeta"></div>

  <div class="nav-buttons">
    <button onclick="previousDay()">← Previous Day</button>
    <button onclick="today()">Today</button>
    <button onclick="nextDay()" id="nextBtn">Next Day →</button>
  </div>
  
  <div class="controls">
    <button onclick="toggleMode()">🌗 Dark / Light</button>
  </div>
</div>

<script>
const poems = ${poemsJson};
const todayDayOfYear = ${dayOfYear};
let currentOffset = 0;

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getDateFromOffset(offset) {
  const now = new Date();
  const estOffset = -5 * 60;
  const estTime = new Date(now.getTime() + (estOffset + now.getTimezoneOffset()) * 60000);
  estTime.setDate(estTime.getDate() + offset);
  return estTime;
}

function renderPoem() {
  const viewingDate = getDateFromOffset(currentOffset);
  const viewingDayOfYear = getDayOfYear(viewingDate);
  const poemIndex = viewingDayOfYear % poems.length;
  const poem = poems[poemIndex];
  
  document.getElementById('poemText').textContent = poem.text;
  document.getElementById('poemMeta').textContent = poem.title + ' - ' + poem.author;
  
  const dateStr = viewingDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  if (currentOffset === 0) {
    document.getElementById('dateDisplay').textContent = 'Todays Poem - ' + dateStr;
  } else {
    document.getElementById('dateDisplay').textContent = 'Poem for ' + dateStr;
  }
  
  document.getElementById('nextBtn').disabled = (currentOffset >= 0);
}

function previousDay() {
  currentOffset--;
  renderPoem();
}

function nextDay() {
  if (currentOffset < 0) {
    currentOffset++;
    renderPoem();
  }
}

function today() {
  currentOffset = 0;
  renderPoem();
}

function toggleMode() {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}

renderPoem();
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('Generated ' + poems.length + ' poems for day ' + dayOfYear + ' of the year (EST)');
