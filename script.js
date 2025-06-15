const channels = [
  {name: 'Lifetime', type: 'youtube', playlistId: 'PLkRkQjmz8eJ6nH4Qpi_2XNkRfRv9n9PAQ'},
  {name: 'Golden Girls', type: 'youtube', playlistId: 'PLkRkQjmz8eJ7lxPIFzA3p2zq2kNw4oqJu'},
  {name: 'Music Channel', type: 'youtube', playlistId: 'PLkRkQjmz8eJ5OP0T0Tq6zQy5e4qzjLqAb'},
  {name: 'External Link', type: 'external', url: 'https://example.com'},
  // Add more channels here
];

let currentChannelIndex = 0;
let isPoweredOn = false;
let player;
const tvPlayerDiv = document.getElementById('tvPlayer');
const nonYoutubePlayer = document.getElementById('nonYoutubePlayer');

// YouTube API callback when ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    height: '100%',
    width: '100%',
    playerVars: {
      listType: 'playlist',
      list: channels[currentChannelIndex].playlistId,
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
    }
  });
}

function onPlayerReady(event) {
  if (isPoweredOn && channels[currentChannelIndex].type === 'youtube') {
    event.target.playVideo();
  }
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    tvPlayerDiv.style.display = 'block';
  } else if (event.data === YT.PlayerState.BUFFERING) {
    tvPlayerDiv.style.display = 'none';
  }
}

function switchToChannel(index) {
  currentChannelIndex = index;
  updateActiveButton();
  const channel = channels[index];

  if (!isPoweredOn) {
    return; // don't do anything if power is off
  }

  if (channel.type === 'youtube') {
    nonYoutubePlayer.style.display = 'none';
    tvPlayerDiv.style.display = 'block';
    if(player && player.loadPlaylist) {
      player.loadPlaylist({list: channel.playlistId, listType: 'playlist'});
    }
  } else if (channel.type === 'external') {
    if(player && player.pauseVideo) player.pauseVideo();
    tvPlayerDiv.style.display = 'none';
    nonYoutubePlayer.style.display = 'block';
    nonYoutubePlayer.src = channel.url;
  }
}

function updateActiveButton() {
  const btns = document.querySelectorAll('#channelButtons button');
  btns.forEach((btn, i) => {
    btn.classList.toggle('active', i === currentChannelIndex);
  });
}

function buildChannelButtons() {
  const container = document.getElementById('channelButtons');
  channels.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.textContent = ch.name;
    btn.addEventListener('click', () => {
      if (!isPoweredOn) return;
      switchToChannel(i);
    });
    container.appendChild(btn);
  });
}

// Power toggle button
document.getElementById('powerBtn').addEventListener('click', () => {
  isPoweredOn = !isPoweredOn;
  if (isPoweredOn) {
    switchToChannel(currentChannelIndex);
    document.getElementById('powerBtn').textContent = 'POWER ON';
  } else {
    document.getElementById('powerBtn').textContent = 'POWER OFF';
    if(player && player.pauseVideo) player.pauseVideo();
    tvPlayerDiv.style.display = 'none';
    nonYoutubePlayer.style.display = 'none';
    nonYoutubePlayer.src = '';
  }
});

// Channel up/down buttons
document.getElementById('channelUpBtn').addEventListener('click', () => {
  if (!isPoweredOn) return;
  currentChannelIndex = (currentChannelIndex + 1) % channels.length;
  switchToChannel(currentChannelIndex);
});

document.getElementById('channelDownBtn').addEventListener('click', () => {
  if (!isPoweredOn) return;
  currentChannelIndex = (currentChannelIndex - 1 + channels.length) % channels.length;
  switchToChannel(currentChannelIndex);
});

// On page load
buildChannelButtons();
