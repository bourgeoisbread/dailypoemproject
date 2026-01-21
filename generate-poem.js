const fs = require('fs');

const poems = [
  {
    text: `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date;
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance or nature's changing course untrimm'd;
But thy eternal summer shall not fade,
Nor lose possession of that fair thou ow'st;
Nor shall Death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st:
So long as men can breathe or eyes can see,
So long lives this, and this gives life to thee.`,
    title: "Sonnet 18",
    author: "William Shakespeare"
  },
  {
    text: `She walks in beauty, like the night
Of cloudless climes and starry skies;
And all that's best of dark and bright
Meet in her aspect and her eyes.`,
    title: "She Walks in Beauty",
    author: "Lord Byron"
  },
  {
    text: `I met a traveller from an antique land
Who said—"Two vast and trunkless legs of stone
Stand in the desert… Near them, on the sand,
Half sunk a shattered visage lies…"`,
    title: "Ozymandias",
    author: "Percy Bysshe Shelley"
  },
  {
    text: `Tyger Tyger, burning bright,
In the forests of the night;
What immortal hand or eye,
Could frame thy fearful symmetry?`,
    title: "The Tyger",
    author: "William Blake"
  },
  {
    text: `Tell me not, in mournful numbers,
Life is but an empty dream!
For the soul is dead that slumbers,
And things are not what they seem.`,
    title: "A Psalm of Life",
    author: "Henry Wadsworth Longfellow"
  }
];

// Get today's poem based on day of year (EST timezone)
const now = new Date();
const estOffset = -5 * 60; // EST is UTC-5
const estTime = new Date(now.getTime() + (estOffset + now.getTimezoneOffset()) * 60000);
const start = new Date(estTime.getFullYear(), 0, 0);
const diff = estTime - start;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);

// Generate HTML with all poems data embedded
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
  document.getElementById('poemMeta').textContent = poem.title + ' — ' + poem.author;
  
  const dateStr = viewingDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  if (currentOffset === 0) {
    document.getElementById('dateDisplay').textContent = 'Today\'s Poem - ' + dateStr;
  } else {
    document.getElementById('dateDisplay').textContent = 'Poem for ' + dateStr;
  }
  
  // Disable next button if we're at today
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

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}

// Initial render
renderPoem();
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('Generated poem for day ' + dayOfYear + ' of the year (EST)');
