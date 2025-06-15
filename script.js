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

// YouTube API ready callback
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
      disablekb: 1
    },
    events: {
      onReady: () => {
        createChannelButtons();
        switchChannel(0);
      }
    }
  });
}

function switchChannel(i) {
  if (i === currentChannel) return;
  const ch = channels[i];

  // Special case: external link for Seinfeld
  if (ch.youtubePlaylistId === "SEINFELD") {
    window.open("https://watchseinfeld.net/", "_blank");
    return;
  }

  currentChannel = i;
  updateChannelButtons();

  // Hide external iframe if visible
  const iframe = document.getElementById('nonYoutubePlayer');
  iframe.style.display = 'none';

  if (!player) return;

  if (ch.youtubePlaylistId.length > 10) {
    player.loadPlaylist({ list: ch.youtubePlaylistId, listType: 'playlist' });
  } else {
    player.loadVideoById(ch.youtubePlaylistId);
  }
  player.setVolume(volume);
}

// Remote buttons functionality
document.getElementById('powerBtn').onclick = () => {
  if (!player) return;
  player.stopVideo();
  currentChannel = -1;
  updateChannelButtons();
};

document.getElementById('channelUpBtn').onclick = () => {
  if (currentChannel === -1) return;
  switchChannel((currentChannel + 1) % channels.length);
};

document.getElementById('channelDownBtn').onclick = () => {
  if (currentChannel === -1) return;
  switchChannel((currentChannel - 1 + channels.length) % channels.length);
};

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

document.getElementById('pauseBtn').onclick = () => {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
};

document.getElementById('rewindBtn').onclick = () => {
  if (!player) return;
  player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
};

document.getElementById('fastForwardBtn').onclick = () => {
  if (!player) return;
  player.seekTo(Math.min(player.getDuration(), player.getCurrentTime() + 10), true);
};
