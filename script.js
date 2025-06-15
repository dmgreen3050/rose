// Retro TV Script.js

let currentChannelIndex = 0;
let player;
let isMuted = false;
let isPaused = false;

const channels = [
  { number: "01", name: "Golden Girls", type: "playlist", id: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV" },
  { number: "02", name: "Christmas Movies", type: "playlist", id: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls" },
  { number: "03", name: "Lifetime", type: "playlist", id: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq" },
  { number: "04", name: "Christmas Music", type: "playlist", id: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G" },
  { number: "05", name: "Music", type: "playlist", id: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ" },
  { number: "06", name: "Seinfeld", type: "youtube", id: "SEINFELD" },
  { number: "07", name: "Movies", type: "youtube", id: "5fnsIjeByxQ" }
];

function onYouTubeIframeAPIReady() {
  player = new YT.Player("tvPlayer", {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      showinfo: 0
    },
    events: {
      onReady: () => loadChannel(currentChannelIndex)
    }
  });
}

function loadChannel(index) {
  currentChannelIndex = index;
  const channel = channels[index];
  const nowPlaying = document.getElementById("nowPlaying");

  if (channel.type === "playlist") {
    player.loadPlaylist({
      listType: "playlist",
      list: channel.id,
      index: 0
    });
  } else if (channel.type === "youtube") {
    player.loadVideoById(channel.id);
  }

  updateChannelButtons();
  nowPlaying.innerHTML = `<span>Now Playing: Channel ${channel.number} — ${channel.name}</span>`;
}

function updateChannelButtons() {
  const buttons = document.querySelectorAll(".channel-item");
  buttons.forEach((btn, i) => {
    btn.classList.toggle("active", i === currentChannelIndex);
  });
}

// Button Controls
document.getElementById("powerBtn").onclick = () => {
  const container = document.getElementById("tvContainer");
  container.style.display =
    container.style.display === "none" ? "block" : "none";
};

document.getElementById("channelUpBtn").onclick = () => {
  currentChannelIndex = (currentChannelIndex + 1) % channels.length;
  loadChannel(currentChannelIndex);
};

document.getElementById("channelDownBtn").onclick = () => {
  currentChannelIndex =
    (currentChannelIndex - 1 + channels.length) % channels.length;
  loadChannel(currentChannelIndex);
};

document.getElementById("volumeUpBtn").onclick = () => {
  let vol = player.getVolume();
  player.setVolume(Math.min(vol + 10, 100));
};

document.getElementById("volumeDownBtn").onclick = () => {
  let vol = player.getVolume();
  player.setVolume(Math.max(vol - 10, 0));
};

document.getElementById("muteBtn").onclick = () => {
  isMuted = !isMuted;
  isMuted ? player.mute() : player.unMute();
};

document.getElementById("pauseBtn").onclick = () => {
  isPaused = !isPaused;
  isPaused ? player.pauseVideo() : player.playVideo();
};

document.getElementById("rewindBtn").onclick = () => player.seekTo(Math.max(player.getCurrentTime() - 10, 0), true);

document.getElementById("fastForwardBtn").onclick = () => player.seekTo(player.getCurrentTime() + 10, true);

// Generate Channel Buttons
const channelContainer = document.querySelector(".channel-buttons") || document.querySelector(".tv-guide");
channels.forEach((channel, index) => {
  const btn = document.createElement("button");
  btn.className = "channel-item";
  btn.innerHTML = `
    <span class="channel-number">${channel.number}</span>
    <span class="channel-name">${channel.name}</span>
  `;
  btn.onclick = () => loadChannel(index);
  channelContainer.appendChild(btn);
});
