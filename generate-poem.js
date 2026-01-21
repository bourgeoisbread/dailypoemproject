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
  },
  {
    text: `When I consider how my light is spent,
Ere half my days, in this dark world and wide,
And that one Talent which is death to hide,
Lodg'd with me useless…`,
    title: "On His Blindness",
    author: "John Milton"
  },
  {
    text: `Thou still unravish'd bride of quietness,
Thou foster-child of silence and slow time,
Sylvan historian, who canst thus express
A flowery tale more sweetly than our rhyme:`,
    title: "Ode on a Grecian Urn",
    author: "John Keats"
  }
  // You can add more poems here using the same format
];

// Get today's poem based on day of year
const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const diff = now - start;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);
const poemIndex = dayOfYear % poems.length;
const todaysPoem = poems[poemIndex];

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Daily Poem - ${todaysPoem.title}</title>

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
</style>
</head>

<body>
<div class="container">
  <div class="date">Poem for ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
  <div class="poem">${todaysPoem.text}</div>
  <div class="meta">${todaysPoem.title} — ${todaysPoem.author}</div>

  <div>
    <button onclick="toggleMode()">🌗 Dark / Light</button>
  </div>
</div>

<script>
function toggleMode() {
  document.body.classList.toggle("light");
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log(\`Generated poem: \${todaysPoem.title} by \${todaysPoem.author}\`);
