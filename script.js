const channels = [
  { name: "Golden Girls", youtubePlaylistId: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV" },
  { name: "Christmas Movies", youtubePlaylistId: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls" },
  { name: "Lifetime", youtubePlaylistId: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq" },
  { name: "Christmas Music", youtubePlaylistId: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G" },
  { name: "Music", youtubePlaylistId: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ" },
  { name: "Seinfeld", youtubePlaylistId: "SEINFELD" },
  { name: "Movies", youtubePlaylistId: "5fnsIjeByxQ" }
];

let player;
let currentChannel = -1;
let volume = 50;

const channelButtonsContainer = document.querySelector('.channel-buttons');

function createChannelButtons() {
  channels.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.textContent = ch.name;
    btn.classList.add('channel-btn');
    btn.addEventListener('click', () => {
      switchChannel(i);
    });
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
      iv_load_policy: 3
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

  if (ch.youtubePlaylistId === "SEINFELD") {
    window.open("https://watchseinfeld.net/", "_blank");
    return;
  }

  currentChannel = i;
  updateChannelButtons();

  document.getElementById('nonYoutubePlayer').style.display = 'none';

  if (!player) return;

  if (ch.youtubePlaylistId.length > 10) {
    player.loadPlaylist({ list: ch.youtubePlaylistId, listType: 'playlist' });
  } else {
    player.loadVideoById(ch.youtubePlaylistId);
  }

  player.setVolume(volume);
}

// Remote buttons
document.getElementById('powerBtn').addEventListener('click', () => {
  if (!player) return;
  player.stopVideo();
  currentChannel = -1;
  updateChannelButtons();
});

document.getElementById('channelUpBtn').addEventListener('click', () => {
  if (currentChannel === -1) return;
  switchChannel((currentChannel + 1) % channels.length);
});

document.getElementById('channelDownBtn').addEventListener('click', () => {
  if (currentChannel === -1) return;
  switchChannel((currentChannel - 1 + channels.length) % channels.length);
});

document.getElementById('volumeUpBtn').addEventListener('click', () => {
  volume = Math.min(100, volume + 10);
  if (player) player.setVolume(volume);
});

document.getElementById('volumeDownBtn').addEventListener('click', () => {
  volume = Math.max(0, volume - 10);
  if (player) player.setVolume(volume);
});

document.getElementById('muteBtn').addEventListener('click', () => {
  if (!player) return;
  if (player.isMuted()) player.unMute();
  else player.mute();
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
});

document.getElementById('rewindBtn').addEventListener('click', () => {
  if (!player) return;
  player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
});

document.getElementById('fastForwardBtn').addEventListener('click', () => {
  if (!player) return;
  player.seekTo(Math.min(player.getDuration(), player.getCurrentTime() + 10), true);
});
