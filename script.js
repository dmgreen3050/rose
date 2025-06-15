const channels = [
  {
    number: "01",
    name: "Golden Girls",
    time: "8:00 PM",
    youtubePlaylistId: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV"
  },
  {
    number: "02",
    name: "Christmas Movies",
    time: "9:00 PM",
    youtubePlaylistId: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls"
  },
  {
    number: "03",
    name: "Lifetime",
    time: "10:00 PM",
    youtubePlaylistId: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq"
  },
  {
    number: "04",
    name: "Christmas Music",
    time: "11:00 PM",
    youtubePlaylistId: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G"
  },
  {
    number: "05",
    name: "Music",
    time: "12:00 AM",
    youtubePlaylistId: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ"
  },
  {
    number: "06",
    name: "Seinfeld",
    time: "1:00 AM",
    youtubePlaylistId: "SEINFELD"
  },
  {
    number: "07",
    name: "Movies",
    time: "2:00 AM",
    youtubePlaylistId: "5fnsIjeByxQ"
  }
];

let player;
let currentChannel = 0;
let isMuted = false;

// Populate TV guide dynamically
const tvGuide = document.getElementById('tvGuide');

channels.forEach((ch, i) => {
  const btn = document.createElement('div');
  btn.classList.add('channel-item');
  btn.dataset.index = i;
  btn.innerHTML = `
    <div class="channel-number">${ch.number}</div>
    <div class="channel-time">${ch.time}</div>
    <div class="channel-name">${ch.name}</div>
  `;
  btn.addEventListener('click', () => switchChannel(i));
  tvGuide.appendChild(btn);
});

function updateGuideHighlight() {
  document.querySelectorAll('.channel-item').forEach((el, idx) => {
    el.classList.toggle('active', idx === currentChannel);
  });
}

// YouTube API requires global function
function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      iv_load_policy: 3
    },
    events: {
      onReady: () => switchChannel(currentChannel),
      onStateChange: onPlayerStateChange
    }
  });
}

function switchChannel(index) {
  currentChannel = index;
  updateGuideHighlight();
  const ch = channels[index];

  if (!player) return;

  if (ch.youtubePlaylistId.length > 10) {
    player.loadPlaylist({ list: ch.youtubePlaylistId, listType: 'playlist', index: 0, suggestedQuality: 'medium' });
    document.getElementById('nonYoutubePlayer').style.display = 'none';
    document.getElementById('tvPlayer').style.display = 'block';
  } else if (ch.youtubePlaylistId === 'SEINFELD') {
    // Example for a non-YouTube video, just hiding YouTube player:
    document.getElementById('tvPlayer').style.display = 'none';
    const iframe = document.getElementById('nonYoutubePlayer');
    iframe.style.display = 'block';
    iframe.src = 'https://player.vimeo.com/video/76979871'; // example video
    if(player) player.stopVideo();
  } else {
    player.loadVideoById(ch.youtubePlaylistId);
    document.getElementById('nonYoutubePlayer').style.display = 'none';
    document.getElementById('tvPlayer').style.display = 'block';
  }
}

// Control buttons
document.getElementById('powerBtn').addEventListener('click', () => {
  if(player && player.getPlayerState() !== YT.PlayerState.ENDED){
    if(player.isMuted()) player.unMute();
    player.stopVideo();
    updateGuideHighlight();
  }
});

document.getElementById('channelUpBtn').addEventListener('click', () => {
  let next = (currentChannel + 1) % channels.length;
  switchChannel(next);
});
document.getElementById('channelDownBtn').addEventListener('click', () => {
  let prev = (currentChannel - 1 + channels.length) % channels.length;
  switchChannel(prev);
});

let volume = 50;
function setVolume(v) {
  volume = Math.min(100, Math.max(0, v));
  if (player) player.setVolume(volume);
}
setVolume(volume);

document.getElementById('volumeUpBtn').addEventListener('click', () => {
  setVolume(volume + 10);
});
document.getElementById('volumeDownBtn').addEventListener('click', () => {
  setVolume(volume - 10);
});

document.getElementById('muteBtn').addEventListener('click', () => {
  if (!player) return;
  if (player.isMuted()) {
    player.unMute();
    isMuted = false;
  } else {
    player.mute();
    isMuted = true;
  }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

document.getElementById('rewindBtn').addEventListener('click', () => {
  if (!player) return;
  const currentTime = player.getCurrentTime();
  player.seekTo(Math.max(0, currentTime - 10), true);
});

document.getElementById('fastForwardBtn').addEventListener('click', () => {
  if (!player) return;
  const currentTime = player.getCurrentTime();
  const duration = player.getDuration();
  player.seekTo(Math.min(duration, currentTime + 10), true);
});

function onPlayerStateChange(event) {
  // Optional: handle state changes here if needed
}
