const channels = [
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV", // Golden Girls
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls", // Christmas Movies
  "https://www.youtube.com/embed/videoseries?list=PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G", // Lifetime
  "https://www.youtube.com/embed/videoseries?list=PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq", // Christmas Music
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ", // Music
  "https://watchseinfeld.net/", // Seinfeld (non-YT)
  "https://www.youtube.com/embed/5fnsIjeByxQ?enablejsapi=1" // Movies single video
];

let currentChannel = 0;
let isPoweredOn = false;
let player = null;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    events: {
      'onReady': onPlayerReady,
      'onError': onPlayerError
    },
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      autoplay: 0,
      mute: 1,
    }
  });
}

function onPlayerReady(event) {
  // Player is ready
  console.log("YouTube Player Ready");
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
    // Extract playlist or video id from url for API use
    // For simplicity, just load URL into iframe src fallback if player not ready
    if (player && player.loadPlaylist) {
      // If it's a playlist link, load playlist
      if (url.includes("list=")) {
        const listId = new URL(url).searchParams.get("list");
        player.loadPlaylist({list: listId});
        player.playVideo();
      } else {
        // Single video id from URL
        const videoId = getVideoIdFromUrl(url);
        player.loadVideoById(videoId);
      }
    } else {
      document.getElementById('tvPlayer').src = url + "&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1";
    }
  } else {
    // Non YouTube URL: set iframe src directly (e.g. Seinfeld)
    document.getElementById('tvPlayer').src = url;
  }
}

function getVideoIdFromUrl(url) {
  // Simple regex to extract video id from typical YT urls
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function powerToggle() {
  if (!isPoweredOn) {
    isPoweredOn = true;
    loadChannel(currentChannel);
  } else {
    isPoweredOn = false;
    if (player) {
      player.stopVideo();
    }
    document.getElementById('tvPlayer').src = "";
  }
}

function volumeUp() {
  if (!isPoweredOn || !player) return;
  const currentVol = player.getVolume();
  player.setVolume(Math.min(currentVol + 10, 100));
}

function volumeDown() {
  if (!isPoweredOn || !player) return;
  const currentVol = player.getVolume();
  player.setVolume(Math.max(currentVol - 10, 0));
}

function muteToggle() {
  if (!isPoweredOn || !player) return;
  if (player.isMuted()) {
    player.unMute();
  } else {
    player.mute();
  }
}

// Attach event listeners after DOM loads
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("powerButton").addEventListener("click", powerToggle);
  document.getElementById("powerRemote").addEventListener("click", powerToggle);
  document.getElementById("channelUp").addEventListener("click", () => {
    if (!isPoweredOn) return;
    currentChannel = (currentChannel + 1) % channels.length;
    loadChannel(currentChannel);
  });
  document.getElementById("channelUpRemote").addEventListener("click", () => {
    if (!isPoweredOn) return;
    currentChannel = (currentChannel + 1) % channels.length;
    loadChannel(currentChannel);
  });
  document.getElementById("channelDown").addEventListener("click", () => {
    if (!isPoweredOn) return;
    currentChannel = (currentChannel - 1 + channels.length) % channels.length;
    loadChannel(currentChannel);
  });
  document.getElementById("channelDownRemote").addEventListener("click", () => {
    if (!isPoweredOn) return;
    currentChannel = (currentChannel - 1 + channels.length) % channels.length;
    loadChannel(currentChannel);
  });
  document.getElementById("volumeUp").addEventListener("click", volumeUp);
  document.getElementById("volumeUpRemote").addEventListener("click", volumeUp);
  document.getElementById("volumeDown").addEventListener("click", volumeDown);
  document.getElementById("volumeDownRemote").addEventListener("click", volumeDown);
  document.getElementById("muteRemote").addEventListener("click", muteToggle);
});

// Make switchChannel globally accessible for inline buttons
window.switchChannel = function(index) {
  if (!isPoweredOn) return;
  loadChannel(index);
};
