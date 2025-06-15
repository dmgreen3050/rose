const channels = [
  { number: "01", name: "Golden Girls", youtubePlaylistId: "PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV" },
  { number: "02", name: "Christmas Movies", youtubePlaylistId: "PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls" },
  { number: "03", name: "Lifetime", youtubePlaylistId: "PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq" },
  { number: "04", name: "Christmas Music", youtubePlaylistId: "PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G" },
  { number: "05", name: "Music", youtubePlaylistId: "PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ" },
  { number: "06", name: "Seinfeld", youtubePlaylistId: "SEINFELD" },
  { number: "07", name: "Movies", youtubePlaylistId: "5fnsIjeByxQ" }
];

const channelButtonsContainer = document.querySelector('.channel-buttons');
const tvPlayer = document.getElementById('tvPlayer');
let currentChannelIndex = 0;

// Create channel buttons dynamically
channels.forEach((channel, index) => {
  const btn = document.createElement('button');
  btn.textContent = `${channel.number} - ${channel.name}`;
  btn.classList.add('channel-btn');
  if(index === 0) btn.classList.add('active');
  btn.addEventListener('click', () => {
    if(currentChannelIndex === index) return; // already active
    currentChannelIndex = index;

    // Remove active class from all buttons
    document.querySelectorAll('.channel-buttons button').forEach(b => b.classList.remove('active'));

    // Add active class to clicked button
    btn.classList.add('active');

    // Load the selected channel video/playlist
    loadChannel(channels[index].youtubePlaylistId);
  });
  channelButtonsContainer.appendChild(btn);
});

function loadChannel(playlistId) {
  // For YouTube iframe embed - load playlist or video by ID
  // Clear the player src then update to trigger reload
  tvPlayer.style.opacity = '0';
  tvPlayer.src = ''; 

  setTimeout(() => {
    if(playlistId.length === 11) {
      // If it looks like a YouTube video ID
      tvPlayer.src = `https://www.youtube.com/embed/${playlistId}?autoplay=1&controls=0&showinfo=0&loop=1&playlist=${playlistId}`;
    } else {
      // Assume it's a playlist ID
      tvPlayer.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&controls=0&showinfo=0&loop=1`;
    }
    tvPlayer.style.opacity = '1';
  }, 300);
}

// Load first channel on page load
loadChannel(channels[0].youtubePlaylistId);
