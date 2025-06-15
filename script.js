const channels = [
  "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV", // Golden Girls playlist ID
  "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G", // Lifetime playlist ID
  "SEINFELD", // Special non-YouTube handled below
  "5fnsIjeByxQ" // Single YouTube video ID - movie clip
];

let currentChannel = -1;
let isPoweredOn = false;
let player;
let playerReady = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    height: '360',
    width: '640',
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      mute: 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

function onPlayerReady(event) {
  playerReady = true;
  if (isPoweredOn && currentChannel >= 0) {
    loadChannel(currentChannel);
  }
}

function onPlayerStateChange(event) {}

function onPlayerError(event) {
  console.error("YouTube Player Error:", event.data);
}

function flickerEffect() {
  const tvWrapper = document.getElementById('tvWrapper');
  tvWrapper.classList.add('flicker');
  setTimeout(() => {
    tvWrapper.classList.remove('flicker');
  }, 200);
}

function loadChannel(index) {
  if (!isPoweredOn || !playerReady) return;

  flickerEffect();

  currentChannel = index % channels.length;
  const channelId = channels[currentChannel];
  const ytPlayerDiv = document.getElementById('tvPlayer');
  const nonYtIframe = document.getElementById('nonYoutubePlayer');

  if (channelId === "SEINFELD") {
    ytPlayerDiv.style.display = 'none';
    nonYtIframe.style.display = 'none';
    nonYtIframe.src = "";
    if (player && playerReady) player.stopVideo();
    setTimeout(() => {
      window.open("https://watchseinfeld.net/", '_blank');
    }, 100);
    return;
  }

  ytPlayerDiv.style.display = 'block';
  nonYtIframe.style.display = 'none';
  nonYtIframe.src = "";

  player.stopVideo();

  setTimeout(() => {
    if (channelId.length === 11) {
      player.loadVideoById(channelId);
    } else {
      player.loadPlaylist({ list: channelId });
    }
    player.unMute();
    player.playVideo();
  }, 100);
}

function powerToggle() {
  isPoweredOn = !isPoweredOn;
  console.log("Power:", isPoweredOn ? "ON" : "OFF");
  const ytPlayerDiv = document.getElementById('tvPlayer');
  const nonYtIframe = document.getElementById('nonYoutubePlayer');

  if (isPoweredOn) {
    if (playerReady) {
      loadChannel(currentChannel >= 0 ? currentChannel : 0);
    } else {
      const waitForReady = setInterval(() => {
        if (playerReady) {
          loadChannel(currentChannel >= 0 ? currentChannel : 0);
          clearInterval(waitForReady);
        }
      }, 100);
    }
  } else {
    if (player && playerReady) player.stopVideo();
    ytPlayerDiv.style.display = 'none';
    nonYtIframe.style.display = 'none';
    nonYtIframe.src = "";
  }
}

function channelUp() {
  if (!isPoweredOn) return;
  loadChannel((currentChannel + 1) % channels.length);
}

function channelDown() {
  if (!isPoweredOn) return;
  loadChannel((currentChannel - 1 + channels.length) % channels.length);
}

function volumeUp() {
  if (!isPoweredOn || !playerReady) return;
  let vol = player.getVolume();
  player.setVolume(Math.min(vol + 10, 100));
  console.log("Volume:", player.getVolume());
}

function volumeDown() {
  if (!isPoweredOn || !playerReady) return;
  let vol = player.getVolume();
  player.setVolume(Math.max(vol - 10, 0));
  console.log("Volume:", player.getVolume());
}

function muteToggle() {
  if (!isPoweredOn || !playerReady) return;
  if (player.isMuted()) {
    player.unMute();
    console.log("Unmuted");
  } else {
    player.mute();
    console.log("Muted");
  }
}

// The helper function for touch + click event handling
function addFastClickListener(element, handler) {
  let touched = false;

  element.addEventListener("touchstart", (e) => {
    touched = true;
    handler();
    e.preventDefault();
  });

  element.addEventListener("click", (e) => {
    if (touched) {
      touched = false;
      return;
    }
    handler();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  addFastClickListener(document.getElementById("powerButton"), powerToggle);
  addFastClickListener(document.getElementById("channelUp"), channelUp);
  addFastClickListener(document.getElementById("channelDown"), channelDown);
  addFastClickListener(document.getElementById("volumeUp"), volumeUp);
  addFastClickListener(document.getElementById("volumeDown"), volumeDown);

  addFastClickListener(document.getElementById("powerRemote"), powerToggle);
  addFastClickListener(document.getElementById("channelUpRemote"), channelUp);
  addFastClickListener(document.getElementById("channelDownRemote"), channelDown);
  addFastClickListener(document.getElementById("volumeUpRemote"), volumeUp);
  addFastClickListener(document.getElementById("volumeDownRemote"), volumeDown);
  addFastClickListener(document.getElementById("muteRemote"), muteToggle);
});

// Optional global switchChannel function for your channel buttons (if needed)
function switchChannel(index) {
  if (!isPoweredOn) {
    isPoweredOn = true;
    powerToggle();
  }
  loadChannel(index);
}
