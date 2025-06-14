// List of Youtube and Internet Archive Videos

 const channels = [
  "https://www.youtube.com/embed/videoseries?si=dQlSqRd1aFZz8JDy&list=PLnJVRTZlANm1EyaREpsWbmXRd34Y66yWV&enablejsapi=1&controls=0&rel=0&modestbranding=1&autoplay=1", //Golden Girls
  "https://www.youtube.com/embed/videoseries?si=ECvqzona23O3jDo7&list=PLnJVRTZlANm28rG20hiPLXHOievQ8O3Ls&enablejsapi=1&controls=0&rel=0&modestbranding=1&autoplay=1", //Christmas Movies
  "https://www.youtube.com/embed/videoseries?si=mSb725kOM5Rm_ajC&list=PLiquKSP6s-eFZj2HF0fhw41D5Argpn3_G&enablejsapi=1&controls=0&rel=0&modestbranding=1&autoplay=1", //Lifetime
  "https://www.youtube.com/embed/videoseries?si=3whAWtFxipP-ydzj&list=PL7Sv7aQs2p0V1FlyUXXbVGekKW65j5QRq&enablejsapi=1&controls=0&rel=0&modestbranding=1&autoplay=1", //Christmas Music
  "https://www.youtube.com/embed/videoseries?si=8QsYISjNeoUTHOQl&list=PLnJVRTZlANm3L7JDiPnjIrP2zxEgbdlLJ&enablejsapi=1&controls=0&rel=0&modestbranding=1&autoplay=1", //Music
  "https://watchseinfeld.net/", //Seinfeld
  "https://www.youtube.com/embed/5fnsIjeByxQ?si=tY-BH-shRz4MacpL&enablejsapi=1&controls=0&rel=0&modestbranding=1&autoplay=1" //Movies
];
let currentChannel = 0;
let isPoweredOn = false;
const iframe = document.querySelector("iframe");
function switchChannel(index) {
  if (isPoweredOn) {
    currentChannel = index % channels.length;
    iframe.src = channels[currentChannel];
  }
}
window.switchChannel = switchChannel;

// Power
document.getElementById("powerButton").addEventListener("click" , () => {
  if (isPoweredOn) {
    iframe.src=""; // Turn off
  }
  else{
    iframe.src =channels[currentChannel]; // Turn on
  }
  isPoweredOn = !isPoweredOn;
});

// TV Channel Buttons
document.getElementById("channelUp").addEventListener("click" , () => {
  if (isPoweredOn) {
    currentChannel = (currentChannel + 1) % channels.length;
    iframe.src= channels[currentChannel];
  }
});
document.getElementById("channelDown").addEventListener("click", () => {
  if (isPoweredOn) {
    currentChannel = (currentChannel - 1 + channels.length) % channels.length;
    iframe.src=channels[currentChannel];
  }
});

document.getElementById("volumeUp").addEventListener("click", () => {
  console.log("Volume Up clicked (not implemented yet)");
});
document.getElementById("volumeDown").addEventListener("click", () => {
  console.log("Volume Down clicked (not implemented yet)");
});


    
