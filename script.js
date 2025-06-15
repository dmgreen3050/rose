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
let currentVolume = 50;

// Create buttons
channels.forEach((channel, index) => {
  const btn = document.createElement('button');
  btn.textContent = `${channel.number} - ${channel.name}`;
  btn.dataset.index = index;
  channelButtonsContainer.appendChild(btn);
});

const channelButtons = document.querySelectorAll('.channel-buttons button');

function loadChannel(index) {
  if (!isPowerOn) return;
  if (index < 0) index = channels.length - 1;
  if (index >= channels.length) index = 0;

  currentChannelIndex = index;

  channelButtons.forEach(btn => btn.classList.remove('active'));
  channelButtons[index].classList.add('active');

  const playlistId = channels[index].youtubePlaylistId;
  let src = '';

  if (playlistId.length === 11 && !playlistId.startsWith('PL')) {
    src = `https://www.youtube.com/embed/${playlistId}?autoplay=1&controls=0&loop=1&playlist=${playlistId}&mute=0&playsinline=1`;
  } else {
    src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&controls=0&loop=1&mute=0&playsinline=1`;
  }

  tvPlayer.src = src;
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

function setVolume(vol) {
  currentVolume = Math.min(Math.max(vol, 0), 100);
  // Can't actually control iframe volume without YouTube API.
}

function volumeUp() {
  setVolume(currentVolume + 10);
}

function volumeDown() {
  setVolume(currentVolume - 10);
}

// Event Listeners
channelButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => loadChannel(index));
});

powerBtn.addEventListener('click', togglePower);
channelUpBtn.addEventListener('click', channelUp);
channelDownBtn.addEventListener('click', channelDown);
volUpBtn.addEventListener('click', volumeUp);
volDownBtn.addEventListener('click', volumeDown);

// Load first channel
loadChannel(currentChannelIndex);
