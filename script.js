function playAudio() {
  const sound = new Audio();
  sound.src = chrome.extension.getURL("audio/level-up.mp3");
  sound.play();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "playNotificationAudio") {
    // try {
    //   playAudio()
    //   sendResponse({ success: true });
    // } catch(error) {
    //   console.error("Unable to  play audio");
    //   sendResponse({ success: false, error });
    // }
    alert("Audio");
  }
});
