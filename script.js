const channels = [
  "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV", // Golden Girls
  "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls", // Christmas Movies
  "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G", // Lifetime
  "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq", // Christmas Music
  "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ", // Music
  "SEINFELD",                            // Special case: open external site
  "5fnsIjeByxQ"                         // Single YouTube video ID
];

let currentChannel = -1; // No channel selected at start
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

function onPlayerStateChange(event) {
  // You can add any state change logic here if needed
}

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
  if (!isPoweredOn) return;
  if (!playerReady) {
    console.log("Player not ready.");
    return;
  }

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
    if (
      channelId.startsWith("PL") || 
      channelId.startsWith("UU") || 
      channelId.startsWith("OL")
    ) {
      player.loadPlaylist({ list: channelId });
    } else if (channelId.length === 11) {
      player.loadVideoById(chan
