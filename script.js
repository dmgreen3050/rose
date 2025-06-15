const channels = [
  { number: "01", name: "Golden Girls", time: "8:00 PM", youtubePlaylistId: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV" },
  { number: "02", name: "Christmas Movies", time: "9:00 PM", youtubePlaylistId: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls" },
  { number: "03", name: "Lifetime", time: "10:00 PM", youtubePlaylistId: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq" },
  { number: "04", name: "Christmas Music", time: "11:00 PM", youtubePlaylistId: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G" },
  { number: "05", name: "Music", time: "12:00 AM", youtubePlaylistId: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ" },
  { number: "06", name: "Seinfeld", time: "1:00 AM", youtubePlaylistId: "SEINFELD" },
  { number: "07", name: "Movies", time: "2:00 AM", youtubePlaylistId: "5fnsIjeByxQ" }
];

let player, currentChannel = 0, volume = 50;

const tvGuide = document.getElementById('tvGuide');

channels.forEach((ch, i) => {
  const div = document.createElement('div');
  div.className = 'channel-item';
  div.innerHTML = `<div class="channel-number">${ch.number}</div>
                   <div class="channel-time">${ch.time}</div>
                   <div class="channel-name">${ch.name}</div>`;
  div.onclick = () => switchChannel(i);
  tvGuide.appendChild(div);
});

function updateGuide() {
  document.querySelectorAll('.channel-item').forEach((el, idx) => {
    el.classList.toggle('active', idx === currentChannel);
  });
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('tvPlayer', {
    width: '100%', height: '100%',
    playerVars: { autoplay: 1, controls:0, rel:0, modestbranding:1, iv_load_policy:3 },
    events: { onReady: () => switchChannel(0) }
  });
}

function switchChannel(i) {
  currentChannel = i;
  updateGuide();
  const ch = channels[i];
  document.getElementById('nonYoutubePlayer').style.display = 'none';

  if (ch.youtubePlaylistId === 'SEINFELD') {
    window.open('https://watchseinfeld.net/', '_blank');
    return;
  }

  if (!player) return;
  if (ch.youtubePlaylistId.length > 10)
    player.loadPlaylist({ list: ch.youtubePlaylistId, listType: 'playlist' });
  else
    player.loadVideoById(ch.youtubePlaylistId);
}

// Remote controls
document.getElementById('powerBtn').onclick = () => player && player.stopVideo();
document.getElementById('channelUpBtn').onclick = () => switchChannel((currentChannel+1)%channels.length);
document.getElementById('channelDownBtn').onclick = () => switchChannel((currentChannel-1+channels.length)%channels.length);
document.getElementById('volumeUpBtn').onclick = () => { volume = Math.min(100, volume+10); player && player.setVolume(volume); };
document.getElementById('volumeDownBtn').onclick = () => { volume = Math.max(0, volume-10); player && player.setVolume(volume); };
document.getElementById('muteBtn').onclick = () => player && (player.isMuted()?player.unMute():player.mute());
document.getElementById('pauseBtn').onclick = () => player && (player.getPlayerState()===YT.PlayerState.PLAYING?player.pauseVideo():player.playVideo());
document.getElementById('rewindBtn').onclick = () => player && player.seekTo(Math.max(0, player.getCurrentTime()-10), true);
document.getElementById('fastForwardBtn').onclick = () => player && player.seekTo(Math.min(player.getDuration(), player.getCurrentTime()+10), true);
