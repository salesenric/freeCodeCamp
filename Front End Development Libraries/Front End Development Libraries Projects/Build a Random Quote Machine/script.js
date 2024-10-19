const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "Do not watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  }
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function displayRandomQuote() {
  const randomQuote = getRandomQuote();
  document.getElementById("text").innerText = randomQuote.text;
  document.getElementById("author").innerText = randomQuote.author;
}

window.onload = displayRandomQuote;

document
  .getElementById("new-quote")
  .addEventListener("click", displayRandomQuote);

document.getElementById("tweet-quote").addEventListener("click", function () {
  const quoteText = document.getElementById("text").innerText;
  const quoteAuthor = document.getElementById("author").innerText;
  const tweetUrl = `https://twitter.com/intent/tweet?text="${quoteText}" - ${quoteAuthor}`;
  document.getElementById("tweet-quote").setAttribute("href", tweetUrl);
});
