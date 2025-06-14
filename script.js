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

function isYouTubeURL(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function loadChannel(index) {
  currentChannel = index % channels.length;
  const url = channels[currentChannel];
  const iframe = document.getElementById('tvPlayer');

  if (isYouTubeURL(url)) {
    // For YouTube videos, use the iframe API player if ready
    if (player) {
      // Load YouTube playlist or video by changing src or via API methods
      player.loadVideoByUrl(url);
      player.playVideo();
    } else {
      // If player not ready yet, just set iframe src directly (fallback)
      iframe.src = url + "&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1";
    }
  } else {
    // Non-YouTube URL: just set iframe src
    iframe.src = url;
  }
}

function powerToggle() {
  const iframe = document.getElementById('tvPlayer');
  if (!isPoweredOn) {
    loadChannel(currentChannel);
    isPoweredOn = true;
  } else {
    // Turn off TV by blanking iframe src
    iframe.src = "";
    isPoweredOn = false;
  }
}

// Attach your event listeners
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
  loadChannel(currentChannel)
