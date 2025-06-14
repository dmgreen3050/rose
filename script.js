const channels = [
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV",
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls",
  "https://www.youtube.com/embed/videoseries?list=PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G",
  "https://www.youtube.com/embed/videoseries?list=PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq",
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ",
  "https://watchseinfeld.net/", // Non-YouTube
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
  console.log("YouTube Player ready");
}

function onPlayerError(event) {
  console.error("YouTube Error:", event.data);
}

function isYouTubeURL(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function loadChannel(index) {
  if (!isPoweredOn || !playerReady) return;

  currentChannel = index % channels.length;
  const url = channels[currentChannel];

  const ytFrame = document.getElementById("tvPlayer");
  const nonYTFrame = document.getElementById("nonYoutubePlayer");

  if (isYouTubeURL(url)) {
    ytFrame.style.display = "block";
    nonYTFrame.style.display = "none";
    const videoId = getVideoIdFromUrl(url);
    const listId = new URL(url).searchParams.get("list");

    if (listId) {
      player.loadPlaylist({ list: listId });
    } else {
      player.loadVideoById(videoId);
    }
  } else {
    ytFrame.style.display = "none";
    nonYTFrame.style.display = "block";
    nonYTFrame.src = url;
  }
}

function getVideoIdFromUrl(url) {
  const match = url.match(/(?:embed\/|v=|\/v\/|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function powerToggle() {
  const ytFrame = document.getElementById("tvPlayer");
  const nonYTFrame = document.getElementById("nonYoutubePlayer");

  if (!isPoweredOn) {
    isPoweredOn = true;
    ytFrame.style.display = "block";
    nonYTFrame.style.display = "none";
    loadChannel(currentChannel);
  } else {
    isPoweredOn = false;
    if (player && playerReady) player.stopVideo();
    ytFrame.style.display = "none";
    nonYTFrame.style.display = "none";
    nonYTFrame.src = ""; // Clear non-YT src too
  }
}

function volumeUp() {
  if (player && playerReady && isPoweredOn) {
    const vol = player.getVolume();
    player.setVolume(Math.min(vol + 10, 100));
  }
}

function volumeDown() {
  if (player && playerReady && isPoweredOn) {
    const vol = player.getVolume();
    player.setVolume(Math.max(vol - 10, 0));
  }
}

function muteToggle() {
  if (player && playerReady && isPoweredOn) {
    player.isMuted() ? player.unMute() : player.mute();
  }
}

window.switchChannel = function(index) {
  if (!isPoweredOn) return;
  loadChannel(index);
};

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("powerButton").addEventListener("click", powerToggle);
  document.getElementById("powerRemote").addEventListener("click", powerToggle);

  const nextChannel = () => switchChannel((currentChannel + 1) % channels.length);
  const prevChannel = () => switchChannel((currentChannel - 1 + channels.length) % channels.length);

  document.getElementById("channelUp").addEventListener("click", nextChannel);
  document.getElementById("channelUpRemote").addEventListener("click", nextChannel);
  document.getElementById("channelDown").addEventListener("click", prevChannel);
  document.getElementById("channelDownRemote").addEventListener("click", prevChannel);

  document.getElementById("volumeUp").addEventListener("click", volumeUp);
  document.getElementById("volumeUpRemote").addEventListener("click", volumeUp);
  document.getElementById("volumeDown").addEventListener("click", volumeDown);
  document.getElementById("volumeDownRemote").addEventListener("click", volumeDown);
  document.getElementById("muteRemote").addEventListener("click", muteToggle);
});
