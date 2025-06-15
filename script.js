// Load YouTube Iframe API script dynamically
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

const channels = [
  { number: "01", name: "Golden Girls", youtubePlaylistId: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV" },
  { number: "02", name: "Christmas Movies", youtubePlaylistId: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls" },
  { number: "03", name: "Lifetime", youtubePlaylistId: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq" },
  { number: "04", name: "Christmas Music", youtubePlaylistId: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G" },
  { number: "05", name: "Music", youtubePlaylistId: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ" },
  { number: "06", name: "Seinfeld", youtubePlaylistId: "SEINFELD" }, // Just a label
  { number: "07", name: "Movies", youtubePlaylistId: "5fnsIjeByxQ" }
];

const channelButtonsContainer = document.querySelector('.channel-buttons');
const powerBtn = document.getElementById('powerBtn');
const volUpBtn = document.getElementById('volUpBtn');
const volDownBtn = document.getElementById('volDownBtn');
const channelUpBtn = document.getElementById('channelUpBtn');
const channelDownBtn = document.getElementById('channelDownBtn');
const muteToggleBtn = document.getElementById('muteToggleBtn');

let player;
let currentChannelIndex = 0;
let isPowerOn = false;
let currentVolume = 50;

channels.forEach(channel => {
  const btn = document.createElement('button');
  btn.textContent = `${channel.number} - ${channel.name}`;
  channelButtonsContainer.appendChild(btn);
});

const channelButtons = document.querySelectorAll('.channel-buttons button');

function getVideoIdOrPlaylistId(channel) {
  const id = channel.youtubePlaylistId;
  if (!id) return null;
  if (id.length === 11) {
    return { type: 'video', id: id };
  }
  return { type: 'playlist', id: id };
}

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('tvPlayer', {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      playlist: channels[0].youtubePlaylistId,
      playsinline: 1,
      mute: 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  event.target.mute();
  loadChannel(currentChannelIndex);
  isPowerOn = true;
  updatePowerButton();
  updateMuteButton();
}

function onPlayerStateChange(event) {}

function loadChannel(index) {
  if (!player) return;

  if (index < 0) index = channels.length - 1;
  if (index >= channels.length) index = 0;
  currentChannelIndex = index;

  channelButtons.forEach(btn => btn.classList.remove('active'));
  channelButtons[index].classList.add('active');

  const channel = channels[index];

  // ✅ If Seinfeld channel is selected
  if (channel.name.toLowerCase() === 'seinfeld') {
    if (isPowerOn) {
      window.open('https://watchseinfeld.net', '_blank');
    }
    return;
  }

  const vidOrList = getVideoIdOrPlaylistId(channel);

  if (vidOrList.type === 'video') {
    player.loadVideoById({
      videoId: vidOrList.id,
      suggestedQuality: 'large'
    });
  } else if (vidOrList.type === 'playlist') {
    player.loadPlaylist({
      list: vidOrList.id,
      listType: 'playlist',
      suggestedQuality: 'large'
    });
  }

  if (isPowerOn) {
    player.playVideo();
  } else {
    player.pauseVideo();
  }
}

function togglePower() {
  if (!player) return;

  isPowerOn = !isPowerOn;

  if (isPowerOn) {
    document.querySelector('.tv-screen').style.visibility = 'visible';
    loadChannel(currentChannelIndex);
  } else {
    player.pauseVideo();
    document.querySelector('.tv-screen').style.visibility = 'hidden';
  }
  updatePowerButton();
}

function volumeUp() {
  if (!player) return;
  currentVolume = Math.min(currentVolume + 10, 100);
  player.setVolume(currentVolume);
}

function volumeDown() {
  if (!player) return;
  currentVolume = Math.max(currentVolume - 10, 0);
  player.setVolume(currentVolume);
}

function channelUp() {
  loadChannel(currentChannelIndex + 1);
}

function channelDown() {
  loadChannel(currentChannelIndex - 1);
}

function toggleMute() {
  if (!player) return;
  if (player.isMuted()) {
    player.unMute();
  } else {
    player.mute();
  }
  updateMuteButton();
}

function updatePowerButton() {
  powerBtn.textContent = isPowerOn ? 'Power Off' : 'Power On';
}

function updateMuteButton() {
  muteToggleBtn.textContent = player.isMuted() ? 'Unmute' : 'Mute';
}

powerBtn.addEventListener('click', togglePower);
volUpBtn.addEventListener('click', volumeUp);
volDownBtn.addEventListener('click', volumeDown);
channelUpBtn.addEventListener('click', channelUp);
channelDownBtn.addEventListener('click', channelDown);
muteToggleBtn.addEventListener('click', toggleMute);

channelButtons.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    loadChannel(idx);
  });
});
