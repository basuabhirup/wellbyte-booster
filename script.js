var sound = new Audio();
sound.src = chrome.runtime.getURL("audio/level-up.mp3");
sound.play();
