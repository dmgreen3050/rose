const channels = [
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV",
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls",
  "https://www.youtube.com/embed/videoseries?list=PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G",
  "https://www.youtube.com/embed/videoseries?list=PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq",
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ",
  "https://watchseinfeld.net/", // Not a YouTube video
  "https://www.youtube.com/embed/5fnsIjeByxQ"
];

let currentChannel = 0;
let isPoweredOn = false;
let player;
let playerReady = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    events: {
      'onReady': onPlayerReady,
      'onError': onPlayerError
    },
    playerVars: {
      autoplay: 1,
      controls: 0,
      mute: 0,
      rel: 0,
      modestbranding: 1
    }
  });
}

function onPlayerReady(event) {
  playerReady = true;
  console.log("YouTube Player is ready");
}

function onPlayerError(event) {
  console.error("YouTube Player Error:", event.data);
}

function isYouTubeURL(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function loadChannel(index) {
  if (!isPoweredOn) return;

  currentChannel = index % channels.length;
  const url = channels[currentChannel];

  if (isYouTubeURL(url)) {
    const videoId = getVideoIdFromUrl(url);
    const listId = new URL(url).searchParams.get("list");

    if (player && playerReady) {
      if (listId) {
        player.loadPlaylist({ list: listId });
      } else {
        player.loadVideoById(videoId);
      }
    }
  } else {
    // Non-YouTube video, load manually
    const container = document.getElementById('tvPlayerWrapper');
    container.innerHTML = `<iframe src="${url}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
  }
}

function getVideoIdFromUrl(url) {
  const match = url.match(/(?:embed\/|v=|\/v\/|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function powerToggle() {
  const container = document.getElementById('tvPlayerWrapper');

  if (!isPoweredOn) {
    isPoweredOn = true;
    loadChannel(currentChannel);
  } else {
    isPoweredOn = false;
    if (player && playerReady) {
      player.stopVideo();
    }
    container.innerHTML = `<iframe id="tvPlayer" width="640" height="360" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen src=""></iframe>`;
    playerReady = false;
    onYouTubeIframeAPIReady();
  }
}

function volumeUp() {
  if (player && playerReady && isPoweredOn) {
    const currentVol = player.getVolume();
    player.setVolume(Math.min(currentVol + 10, 100));
  }
}

function volumeDown() {
  if (player && playerReady && isPoweredOn) {
    const currentVol = player.getVolume();
    player.setVolume(Math.max(currentVol - 10, 0));
  }
}

function muteToggle() {
  if (!player || !playerReady || !isPoweredOn) return;
  if (player.isMuted()) {
    player.unMute();
  } else {
    player.mute();
  }
}

window.switchChannel = function(index) {
  if (!isPoweredOn) return;
  loadChannel(index);
};

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("powerButton").addEventListener("click", powerToggle);
  document.getElementById("powerRemote").addEventListener("click", powerToggle);

  document.getElementById("channelUp").addEventListener("click", () => {
    if (!isPoweredOn) return;
    switchChannel((currentChannel + 1) % channels.length);
  });
  document.getElementById("channelUpRemote").addEventListener("click", () => {
    if (!isPoweredOn) return;
    switchChannel((currentChannel + 1) % channels.length);
  });

  document.getElementById("channelDown").addEventListener("click", () => {
    if (!isPoweredOn) return;
    switchChannel((currentChannel - 1 + channels.length) % channels.length);
  });
  document.getElementById("channelDownRemote").addEventListener("click", () => {
    if (!isPoweredOn) return;
    switchChannel((currentChannel - 1 + channels.length) % channels.length);
  });

  document.getElementById("volumeUp").addEventListener("click", volumeUp);
  document.getElementById("volumeUpRemote").addEventListener("click", volumeUp);
  document.getElementById("volumeDown").addEventListener("click", volumeDown);
  document.getElementById("volumeDownRemote").addEventListener("click", volumeDown);
  document.getElementById("muteRemote").addEventListener("click", muteToggle);
});
