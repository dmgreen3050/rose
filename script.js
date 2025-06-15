// Example channels with your playlist IDs and custom IDs
const channels = [
  { id: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV", name: "Golden Girls" },
  { id: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls", name: "Christmas Movies" },
  { id: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G", name: "Lifetime" },
  { id: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq", name: "Christmas Music" },
  { id: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ", name: "Music" },
  { id: "SEINFELD", name: "Seinfeld" },
  { id: "5fnsIjeByxQ", name: "Movies" }
];

let currentChannel = 0;
let player;

// YouTube Iframe API Ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    height: '100%',
    width: '100%',
    playerVars: {
      listType: 'playlist',
      list: channels[currentChannel].id,
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0
    },
    events: {
      onReady: () => player.playVideo()
    }
  });
}

// Switch channel function
function switchChannel(index) {
  if (index < 0) index = channels.length - 1;
  else if (index >= channels.length) index = 0;
  currentChannel = index;

  if (player && player.loadPlaylist) {
    player.loadPlaylist({ list: channels[currentChannel].id });
    player.playVideo();
  }
}

// TV Buttons event listeners
document.getElementById('channelUp').addEventListener('click', () => {
  switchChannel(currentChannel + 1);
});
document.getElementById('channelDown').addEventListener('click', () => {
  switchChannel(currentChannel - 1);
});
document.getElementById('powerButton').addEventListener('click', () => {
  if (player) {
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) player.pauseVideo();
    else player.playVideo();
  }
});
document.getElementById('volumeUp').addEventListener('click', () => {
  if (player) {
    let vol = player.getVolume();
    if (vol < 100) player.setVolume(vol + 10);
  }
});
document.getElementById('volumeDown').addEventListener('click', () => {
  if (player) {
    let vol = player.getVolume();
    if (vol > 0) player.setVolume(vol - 10);
  }
});

// Optional: initialize first channel on page load
window.onload = () => {
  if (player && player.loadPlaylist) {
    player.loadPlaylist({ list: channels[currentChannel].id });
    player.playVideo();
  }
};
