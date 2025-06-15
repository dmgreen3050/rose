const channels = [
  { number: "01", name: "Golden Girls", youtubePlaylistId: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV" },
  { number: "02", name: "Christmas Movies", youtubePlaylistId: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls" },
  { number: "03", name: "Lifetime", youtubePlaylistId: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq" },
  { number: "04", name: "Christmas Music", youtubePlaylistId: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G" },
  { number: "05", name: "Music", youtubePlaylistId: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ" },
  { number: "06", name: "Seinfeld", youtubePlaylistId: "SEINFELD" },
  { number: "07", name: "Movies", youtubePlaylistId: "5fnsIjeByxQ" }
];

let player;
let currentChannel = -1;
let volume = 50;

const channelButtonsContainer = document.querySelector('.channel-buttons');
const nonYoutubePlayer = document.getElementById('nonYoutubePlayer');
const tvPlayerContainer = document.getElementById('tvPlayer');

function createChannelButtons() {
  channels.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.textContent = ch.name;
    btn.onclick = () => switchChannel(i);
    channelButtonsContainer.appendChild(btn);
  });
}

function updateChannelButtons() {
  const buttons = channelButtonsContainer.querySelectorAll('button');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === currentChannel);
  });
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      playsinline: 1
    },
    events: {
      onReady: () => {
        createChannelButtons();
        switchChannel(0); // start on first channel
      }
    }
  });
}

function switchChannel(i) {
  if (i < 0 || i >= channels.length) return;
  if (i === currentChannel) return; // don't reload same channel

  const ch = channels[i];

  // Handle Seinfeld external link
  if (ch.youtubePlaylistId === "SEINFELD") {
    // Hide YouTube player, show iframe with link
    if (player) player.stopVideo();
    tvPlayerContainer.style.display = 'none';
    nonYoutubePlayer.style.display = 'block';
    nonYoutubePlayer.src = "https://watchseinfeld.net/";
    currentChannel = i;
    updateChannelButtons();
    return;
  }

  // Normal YouTube channels
  nonYoutubePlayer.style.display = 'none';
  nonYoutubePlayer.src = '';
  tvPlayerContainer.style.display = 'block';

  currentChannel = i;
  updateChannelButtons();

  if (!player) return;

  // Play playlist or video based on id length
  if (ch.youtubePlaylistId.length > 10) {
    player.loadPlaylist({ list: ch.youtubePlaylistId, listType: 'playlist' });
  } else {
    player.loadVideoById(ch.youtubePlaylistId);
  }
  player.setVolume(volume);
}

// Power button: stop video and reset
document.getElementById('powerBtn').onclick = () => {
  if (!player) return;
  player.stopVideo();
  nonYoutubePlayer.style.display = 'none';
  nonYoutubePlayer.src = '';
  tvPlayerContainer.style.display = 'block';
  currentChannel = -1;
  updateChannelButtons();
};

// Channel up/down buttons cycle channels
document.getElementById('channelUpBtn').onclick = () => {
  if (currentChannel === -1) return;
  let next = (currentChannel + 1) % channels.length;
  switchChannel(next);
};

document.getElementById('channelDownBtn').onclick = () => {
  if (currentChannel === -1) return;
  let prev = (currentChannel - 1 + channels.length) % channels.length;
  switchChannel(prev);
};

// Volume control buttons
document.getElementById('volumeUpBtn').onclick = () => {
  volume = Math.min(100, volume + 10);
  if (player) player.setVolume(volume);
};

document.getElementById('volumeDownBtn').onclick = () => {
  volume = Math.max(0, volume - 10);
  if (player) player.setVolume(volume);
};

document.getElementById('muteBtn').onclick = () => {
  if (!player) return;
  if (player.isMuted()) player.unMute();
  else player.mute();
};

// Pause/play toggle
document.getElementById('pauseBtn').onclick = () => {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
};

// Rewind and fast-forward 10 seconds
document.getElementById('rewindBtn').onclick = () => {
  if (!player) return;
  player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
};

document.getElementById('fastForwardBtn').onclick = () => {
  if (!player) return;
  player.seekTo(Math.min(player.getDuration(), player.getCurrentTime() + 10), true);
};
