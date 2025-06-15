const channels = [
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV&autoplay=1", // Golden Girls
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls&autoplay=1", // Christmas Movies
  "https://www.youtube.com/embed/videoseries?list=PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G&autoplay=1", // Lifetime
  "https://www.youtube.com/embed/videoseries?list=PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq&autoplay=1", // Christmas Music
  "https://www.youtube.com/embed/videoseries?list=PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ&autoplay=1", // Music
  "https://watchseinfeld.net/", // Non-YouTube
  "https://www.youtube.com/embed/5fnsIjeByxQ?autoplay=1" // Movie clip
];

let currentChannel = 0;
let isPoweredOn = false;

const tvPlayer = document.getElementById('tvPlayer');

function loadChannel(index) {
  if (!isPoweredOn) return;
  currentChannel = index % channels.length;
  tvPlayer.src = channels[currentChannel];
  tvPlayer.style.display = 'block';
  console.log("Loaded channel:", channels[currentChannel]);
}

function switchChannel(index) {
  if (isPoweredOn) {
    loadChannel(index);
  }
}

function powerToggle() {
  isPoweredOn = !isPoweredOn;
  if (isPoweredOn) {
    loadChannel(currentChannel);
  } else {
    tvPlayer.src = "";
    tvPlayer.style.display = 'none';
  }
}

function channelUp() {
  switchChannel((currentChannel + 1) % channels.length);
}

function channelDown() {
  switchChannel((currentChannel - 1 + channels.length) % channels.length);
}

document.getElementById("powerButton").addEventListener("click", powerToggle);
document.getElementById("powerRemote").addEventListener("click", powerToggle);
document.getElementById("channelUp").addEventListener("click", channelUp);
document.getElementById("channelUpRemote").addEventListener("click", channelUp);
document.getElementById("channelDown").addEventListener("click", channelDown);
document.getElementById("channelDownRemote").addEventListener("click", channelDown);

document.getElementById("muteRemote").addEventListener("click", () => {
  // Mute not supported here directly — iframe content is isolated.
  alert("Mute only works within YouTube directly.");
});
