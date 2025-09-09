// Telugu playlists + a reliable "search" fallback link per mood.
// If a playlist ever becomes unavailable, users can click the search link.
const playlists = {
  happy: [
    { title: "😊 Happy Telugu Songs – Mix/Playlist", url: "https://www.youtube.com/results?search_query=happy+telugu+songs+playlist" },
    { title: "Feel-Good Telugu Hits (Curated)", url: "https://www.youtube.com/results?search_query=telugu+feel+good+songs+playlist" }
  ],
  sad: [
    { title: "😢 Telugu Sad Songs – Playlist", url: "https://www.youtube.com/results?search_query=telugu+sad+songs+playlist" },
    { title: "Emotional Telugu Songs", url: "https://www.youtube.com/results?search_query=emotional+telugu+songs+playlist" }
  ],
  angry: [
    { title: "🔥 Mass/Power Telugu Songs", url: "https://www.youtube.com/results?search_query=mass+telugu+songs+playlist" },
    { title: "Thumping Telugu Beats", url: "https://www.youtube.com/results?search_query=powerful+telugu+songs+playlist" }
  ],
  relax: [
    { title: "😴 Telugu Melodies / Calm", url: "https://www.youtube.com/results?search_query=telugu+melody+songs+playlist" },
    { title: "Chill/Lo-fi Telugu", url: "https://www.youtube.com/results?search_query=telugu+lofi+playlist" }
  ],
  energetic: [
    { title: "💪 Energetic/Dance Telugu Songs", url: "https://www.youtube.com/results?search_query=energetic+telugu+songs+playlist" },
    { title: "Trending Telugu Party", url: "https://www.youtube.com/results?search_query=telugu+party+songs+playlist" }
  ]
};

// Mood-based background gradients
const moodColors = {
  happy: "linear-gradient(to right, #FFD700, #FFA500)",
  sad: "linear-gradient(to right, #87CEFA, #1E90FF)",
  angry: "linear-gradient(to right, #FF6347, #8B0000)",
  relax: "linear-gradient(to right, #90EE90, #006400)",
  energetic: "linear-gradient(to right, #FF69B4, #FF1493)"
};

// Render recommendations
function recommend(mood) {
  const resultDiv = document.getElementById("results");
  document.body.style.background = moodColors[mood] || "linear-gradient(to right, #89f7fe, #66a6ff)";

  // Title with simple typewriter animation
  const title = `Recommended Telugu playlists for ${mood.toUpperCase()} mood:`;
  resultDiv.innerHTML = `<h2 id="typer"></h2><div id="links"></div>`;
  typeWriter("typer", title, 12);

  const linksDiv = document.getElementById("links");
  linksDiv.innerHTML = playlists[mood]
    .map(item => `<a href="${item.url}" target="_blank">🎶 ${item.title}</a>`)
    .join("");
}

// Voice recognition (Chrome/Edge/Android)
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Sorry, your browser doesn't support Speech Recognition.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript.toLowerCase();
    const mood = parseMoodFromText(spokenText);
    if (mood) recommend(mood);
    else document.getElementById("results").innerHTML = "<p>😕 Didn't catch the mood. Try: happy/sad/angry/relax/energetic.</p>";
  };

  recognition.onerror = (event) => alert("Error: " + event.error);
}

// AI: Sentiment + Telugu/English keyword hints
const sentiment = new Sentiment();
function detectMoodFromText() {
  const text = (document.getElementById("moodText").value || "").trim();
  if (!text) {
    alert("Please type something like 'Feeling great' or 'కొంచెం బాధగా ఉంది'.");
    return;
  }
  // Direct keyword mapping first (supports English + Telugu words)
  const direct = parseMoodFromText(text.toLowerCase());
  if (direct) {
    recommend(direct);
    return;
  }

  // Fallback to sentiment score → mood
  const score = sentiment.analyze(text).score;
  // Tweak thresholds for snappier behavior
  let mood = "relax";
  if (score >= 3) mood = "happy";
  else if (score <= -3) mood = "sad";
  // If text includes "angry/anger/kopam" push to angry
  if (/(angry|anger|furious|rage|kopam|కోపం)/i.test(text)) mood = "angry";
  // If text includes energy/excited/pumped → energetic
  if (/(energetic|energy|excited|hyped|pumped|ఉత్సాహం|ఎనర్జీ)/i.test(text)) mood = "energetic";

  recommend(mood);
}

// Understand mood words (English + simple Telugu)
function parseMoodFromText(t) {
  if (/(happy|joy|great|good|awesome|సంతోషం|సంతోషంగా|ఆనందం)/i.test(t)) return "happy";
  if (/(sad|down|lonely|bad|upset|బాధ|బాధగా|దుఃఖం|దుఖం)/i.test(t)) return "sad";
  if (/(angry|mad|rage|furious|irritated|annoyed|కోపం|ఆగ్రహం)/i.test(t)) return "angry";
  if (/(relax|calm|peace|chill|tired|sleepy|శాంతి|ఆరామం|అలసట|నిద్ర)/i.test(t)) return "relax";
  if (/(energetic|energy|hype|excited| pumped|workout|ఉత్సాహం|ఆనందోల్లాసం)/i.test(t)) return "energetic";
  return null;
}

// Tiny typewriter effect
function typeWriter(id, text, speed = 10) {
  const el = document.getElementById(id);
  let i = 0;
  const timer = setInterval(() => {
    el.textContent = text.slice(0, i++);
    if (i > text.length) clearInterval(timer);
  }, speed);
}
