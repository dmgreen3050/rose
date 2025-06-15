const channels = [
  "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV", // Golden Girls playlist ID
  "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls", // Christmas Movies playlist ID
  "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G", // Lifetime playlist ID
  "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq", // Christmas Music playlist ID
  "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ", // Music playlist ID
  "SEINFELD", // Special non-YouTube handled below
  "5fnsIjeByxQ" // Single YouTube video ID - movie clip
];

let currentChannel = 0;
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
  if (isPoweredOn) {
    loadChannel(currentChannel);
  }
}

function onPlayerStateChange(event) {}

function onPlayerError(event) {
  console.error("YouTube Player Error:", event.data);
}

function loadChannel(index) {
  if (!isPoweredOn || !playerReady) return;

  const newIndex = index % channels.length;
  const newChannelId = channels[newIndex];
  const currentChannelId = channels[currentChannel];

  // Don't reload same channel
  if (newIndex === currentChannel) {
    console.log("Same channel clicked. Ignoring.");
    return;
  }

  const ytPlayerDiv = document.getElementById('tvPlayer');
  const nonYtIframe = document.getElementById('nonYoutubePlayer');

  // Handle special case for Seinfeld
  if (newChannelId === "SEINFELD") {
    ytPlayerDiv.style.display = 'none';
    nonYtIframe.style.display = 'none';
    nonYtIframe.src = "";
    if (player && playerReady) player.stopVideo();

    setTimeout(() => {
      window.open("https://watchseinfeld.net/", '_blank');
    }, 100);

    currentChannel = newIndex;
    return;
  }

  ytPlayerDiv.style.display = 'block';
  nonYtIframe.style.display = 'none';
  nonYtIframe.src = "";

  // Load new channel
  if (newChannelId.length === 11) {
    player.loadVideoById(newChannelId);
  } else {
    player.loadPlaylist({ list: newChannelId });
  }

  player.unMute();
  player.playVideo();

  currentChannel = newIndex; // Only update after load
  console.log("Switched to channel:", currentChannel);
}

function powerToggle() {
  isPoweredOn = !isPoweredOn;
  console.log("Power:", isPoweredOn ? "ON" : "OFF");

  const ytPlayerDiv = document.getElementById('tvPlayer');
  const nonYtIframe = document.getElementById('nonYoutubePlayer');

  if (isPoweredOn) {
    if (playerReady) {
      loadChannel(currentChannel);
    } else {
      const waitForReady = setInterval(() => {
        if (playerReady) {
          loadChannel(currentChannel);
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

window.switchChannel = loadChannel;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("powerButton").addEventListener("click", powerToggle);
  document.getElementById("powerRemote").addEventListener("click", powerToggle);

  document.getElementById("channelUp").addEventListener("click", channelUp);
  document.getElementById("channelUpRemote").addEventListener("click", channelUp);

  document.getElementById("channelDown").addEventListener("click", channelDown);
  document.getElementById("channelDownRemote").addEventListener("click", channelDown);

  document.getElementById("volumeUp").addEventListener("click", volumeUp);
  document.getElementById("volumeUpRemote").addEventListener("click", volumeUp);

  document.getElementById("volumeDown").addEventListener("click", volumeDown);
  document.getElementById("volumeDownRemote").addEventListener("click", volumeDown);

  document.getElementById("muteRemote").addEventListener("click", muteToggle);
});
