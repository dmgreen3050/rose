const channels = [
  { number: "01", name: "Golden Girls", youtubePlaylistId: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV" },
  { number: "02", name: "Christmas Movies", youtubePlaylistId: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls" },
  { number: "03", name: "Lifetime", youtubePlaylistId: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq" },
  { number: "04", name: "Christmas Music", youtubePlaylistId: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G" },
  { number: "05", name: "Music", youtubePlaylistId: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ" },
  { number: "06", name: "Seinfeld", externalUrl: "https://watchseinfeld.net" },
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

// Create channel buttons dynamically
channels.forEach(channel => {
  const btn = document.createElement('button');
  btn.textContent = `${channel.number} - ${channel.name}`;
  btn.dataset.channelIndex = channels.indexOf(channel);
  channelButtonsContainer.appendChild(btn);
});

const channelButtons = document.querySelectorAll('.channel-buttons button');

function loadChannel(index) {
  if (index < 0) index = channels.length - 1;
  if (index >= channels.length) index = 0;
  currentChannelIndex = index;

  channelButtons.forEach(btn => btn.classList.remove('active'));
  channelButtons[index].classList.add('active');

  const channel = channels[index];

  if (!isPowerOn) return;

  // Handle external URL (like Seinfeld)
  if (channel.externalUrl) {
    tvPlayer.src = '';
    window.open(channel.externalUrl, '_blank');
    return;
  }

  const playlistId = channel.youtubePlaylistId;
  let src = '';

  if (!playlistId || typeof playlistId !== 'string') {
    console.error('Invalid playlistId:', playlistId);
    return;
  }

  if (playlistId.length === 11) {
    src = `https://www.youtube.com/embed/${playlistId}?autoplay=1&controls=0&loop=1&playlist=${playlistId}&mute=0&playsinline=1`;
  } else if (playlistId.startsWith('PL')) {
    src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&controls=0&loop=1&mute=0&playsinline=1`;
  } else {
    src = `https://www.youtube.com/embed/videoseries?list
