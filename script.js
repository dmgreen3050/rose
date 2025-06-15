const channels = [
  { number: "01", name: "Golden Girls", youtubePlaylistId: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV" },
  { number: "02", name: "Christmas Movies", youtubePlaylistId: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls" },
  { number: "03", name: "Lifetime", youtubePlaylistId: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq" },
  { number: "04", name: "Christmas Music", youtubePlaylistId: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G" },
  { number: "05", name: "Music", youtubePlaylistId: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ" },
  { number: "06", name: "Seinfeld", youtubePlaylistId: "SEINFELD" },
  { number: "07", name: "Movies", youtubePlaylistId: "5fnsIjeByxQ" }
];

const tvPlayer = document.getElementById('tvPlayer');
const channelButtonsContainer = document.querySelector('.channel-buttons');

const powerBtn = document.getElementById('powerBtn');
const volUpBtn = document.getElementById('volUpBtn');
const volDownBtn = document.getElementById('volDownBtn');
const channelUpBtn = document.getElementById('channelUpBtn');
const channelDownBtn = document.getElementById('channelDownBtn');

let currentChannelIndex = 0;
let isPowerOn = true;
let currentVolume = 50; // default volume percent

// Create channel buttons dynamically
channels.forEach(channel => {
  const btn = document.createElement('button');
  btn.textContent = `${channel.number} - ${channel.name}`;
  btn.dataset.playlistId = channel.youtubePlaylistId;
  channelButtonsContainer.appendChild(btn);
});

const channelButtons = document.querySelectorAll('.channel-buttons button');

function loadChannel(index) {
  if (index < 0) index = channels.length - 1;
  if (index >= channels.length) index = 0;
  currentChannelIndex = index;

  channelButtons.forEach(btn => btn.classList.remove('active'));
  channelButtons[index].classList.add('active');

  const playlistId = channels[index].youtubePlaylistId;
  let src = '';

  if (!playlistId || typeof playlistId !== 'string') {
    console.error('Invalid playlistId:', playlistId);
    return;
  }

  if (playlistId.length === 11) {
    // Single video ID
    src = `https://www.youtube.com/embed/${playlistId}?autoplay=1&controls=0&loop=1&playlist=${playlistId}&mute=0&playsinline=1`;
  } else if (playlistId.startsWith('PL')) {
    // Playlist
    src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&controls=0&loop=1&mute=0&playsinline=1`;
  } else {
    // Other cases (like SEINFELD)
    src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&controls=0&loop=1&mute=0&playsinline=1`;
  }

  tvPlayer.src = src;
  setTimeout(() => {
    setVolume(currentVolume);
  }, 1000); // try to set volume after iframe loads
}

function setVolume(volumePercent) {
  // YouTube iframe does NOT allow volume control by default without API integration.
  // So this is a best-effort approach, but volume control might not fully work.
  // Alternative: Use YouTube Iframe API for better control (more complex).

  currentVolume = Math.min(Math.max(volumePercent, 0), 100);

  // For muted autoplay, volume control is tricky; keeping muted off here
  // So for now, just remember the volume for future toggling.
}

function togglePower() {
  isPowerOn = !isPowerOn;
  if (isPowerOn) {
    tvPlayer.style.display = 'block';
    loadChannel(currentChannelIndex);
  } else {
    tvPlayer.style.display = 'none';
    tvPlayer.src = '';
  }
}

function channelUp() {
  loadChannel(currentChannelIndex + 1);
}

function channelDown() {
  loadChannel(currentChannelIndex - 1);
}

function volumeUp() {
  setVolume(currentVolume + 10);
}

function volumeDown() {
  setVolume(currentVolume - 10);
}

// Button click handlers
channelButtons.forEach((button, idx) => {
  button.addEventListener('click', () => {
    loadChannel(idx);
  });
});

powerBtn.addEventListener('click', togglePower);
volUpBtn.addEventListener('click', volumeUp);
volDownBtn.addEventListener('click', volumeDown);
channelUpBtn.addEventListener('click', channelUp);
channelDownBtn.addEventListener('click', channelDown);

// Initialize first channel on page load
loadChannel(currentChannelIndex);
