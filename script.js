// List of Youtube and Internet Archive Videos
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
let player;

// Helper: extract playlist ID or video ID from YouTube URLs
function getPlaylistId(url) {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}

function getVideoId(url) {
  const match = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Called by YouTube API once ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    height: '360',
    width: '640',
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      enablejsapi: 1,
      mute: 1
    },
    events: {
      onReady: (event) => {
        // Player ready but don't autoplay yet
      }
    }
  });
}

function loadChannel(index) {
  currentChannel = index % channels.length;
  const url = channels[currentChannel];

  // If channel is YouTube
  if (url.includes("youtube.com")) {
    const playlistId = getPlaylistId(url);
    if (playlistId) {
      player.loadPlaylist({list: playlistId, index: 0, startSeconds: 0});
    } else {
      const videoId = getVideoId(url);
      if (videoId) {
        player.loadVideoById(videoId);
      }
    }
    player.mute(); // start muted per autoplay policy
  } else {
    // Non-YouTube: just change iframe src
    const iframe = document.querySelector('iframe');
    iframe.src = url;
  }
}

function powerToggle() {
  if (!player) return;
  if (isPoweredOn) {
    player.stopVideo();
    isPoweredOn = false;
  } else {
    loadChannel(currentChannel);
    player.unMute();
    player.playVideo();
    isPoweredOn = true;
  }
}

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

document.getElementById("muteRemote").addEventListener("click", () => {
  if (!player) return;
  if (player.isMuted()) {
    player.unMute();
  } else {
    player.mute();
  }
});

// Volume buttons just log for now:
document.getElementById("volumeUp").addEventListener("click", () => {
  console.log("Volume Up clicked (not implemented)");
});
document.getElementById("volumeDown").addEventListener("click", () => {
  console.log("Volume Down clicked (not implemented)");
});
document.getElementById("volumeUpRemote").addEventListener("click", () => {
  console.log("Volume Up clicked (not implemented)");
});
document.getElementById("volumeDownRemote").addEventListener("click", () => {
  console.log("Volume Down clicked (not implemented)");
});

window.switchChannel = (index) => {
  if (!isPoweredOn) return;
  loadChannel(index);
};
