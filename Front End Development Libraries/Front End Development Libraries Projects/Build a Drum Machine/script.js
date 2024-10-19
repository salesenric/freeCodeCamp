function playSound(soundId) {
  const audio = document.getElementById(soundId);
  audio.currentTime = 0;
  audio.play();
  document.getElementById("display").innerText = soundId;
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  const audio = document.getElementById(key);

  if (audio) {
    playSound(key);
  }
});
