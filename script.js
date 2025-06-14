const channels = [
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV", // Golden Girls
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls", // Christmas Movies
  "https://www.youtube.com/embed/videoseries?list=PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G", // Lifetime
  "https://www.youtube.com/embed/videoseries?list=PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq", // Christmas Music
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ", // Music
  "https://watchseinfeld.net/", // Non-YouTube link
  "https://www.youtube.com/embed/5fnsIjeByxQ" // Movie clip or whatever
];

let currentChannel = 0;
let isPoweredOn = false;
let player;
let playerReady = false;

function isYouTubeURL(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

// YouTube iframe API callback
function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    height: '360',
    width: '640',
    videoId: '',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      mute: 0,
    },
    events: {
      'onReady': onPlayerReady,
      'onError': onPlayerError
    }
  });
}

function onPlayerReady(event) {
  playerReady = true;
  if (isPoweredOn) {
    loadChannel(currentChannel);
  }
}

function onPlayerError(event) {
  console.error("YouTube Player Error:", event.data);
}

function loadChannel(index) {
  if (!isPoweredOn) return;

  currentChannel = index % channels.length;
  const url = channels[currentChannel];

  const ytIframe = document.getElementById('tvPlayer');
  const nonYtIframe = document.getElementById('nonYoutubePlayer');

  if (isYouTubeURL(url)) {
    // Show YouTube iframe, hide other
    ytIframe.style.display = 'block';
    nonYtIframe.style.display = 'none';

    if (!playerReady) {
      // wait for playerReady, will load channel on ready
      return;
    }

    // Extract playlist or video id
    const listId = new URL(url).searchParams.get("list");
    const videoId = getVideoIdFromUrl(url);

    if (listId) {
      player.loadPlaylist({ list: listId });
    } else if (videoId) {
      player.loadVideoById(videoId);
    } else {
      player.cueVideoById(url);
    }
  } else {
    // Non-YouTube: hide YouTube iframe, show non-YT iframe with src
    ytIframe.style.display = 'none';
    nonYtIframe.style.display = 'block';
    playerReady = false; // player irrelevant here

    nonYtIframe.src = url;
  }
}

function getVideoIdFromUrl(url) {
  // match video id from various YouTube url formats
  const match = url.match(/(?:embed\/|v=|\/v\/|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function powerToggle() {
  if (!isPoweredOn) {
    isPoweredOn = true;
    loadChannel(currentChannel);
  } else {
    isPoweredOn = false;
    if (player && playerReady) {
      player.stopVideo();
    }
    // clear iframe srcs
    document.getElementById('tvPlayer').style.display = 'none';
    document.getElementById('tvPlayer').src = '';
    const nonYtIframe = document.getElementById('nonYoutubePlayer');
    nonYtIframe.style.display = 'none';
    nonYtIframe.src = '';
  }
}

function volumeUp() {
  if (!isPoweredOn || !player || !playerReady) return;
  let vol = player.getVolume();
  player.setVolume(Math.min(vol + 10, 100));
}

function volumeDown() {
  if (!isPoweredOn || !player || !playerReady) return;
  let vol = player.getVolume();
  player.setVolume(Math.max(vol - 10, 0));
}

function muteToggle() {
  if (!isPoweredOn || !player || !playerReady) return;
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
