const breakIntervalSlider = document.getElementById("break-interval-slider");
const breakIntervalDisplay = document.getElementById("break-interval-display");
const remainingTimeDisplay = document.getElementById("remaining-time-display");
const notificationSoundSwitch = document.getElementById("notificationSound");
const notificationSwitchText = document.getElementById("switch-text");
const currentYear = document.getElementById("current-year");
let timerIntervalId;

breakIntervalSlider.addEventListener("input", function () {
  const newInterval = breakIntervalSlider.value;
  breakIntervalDisplay.textContent = `${newInterval} minutes`;
  chrome.storage.local.set({ breakInterval: newInterval }, () => {
    // Send message to background script
    chrome.runtime.sendMessage(
      {
        action: "updateBreakInterval",
        newInterval: newInterval,
      },
      (response) => {
        // Add callback function to receive response
        if (response && response.success) {
          console.log("Break interval updated successfully!");
          remainingTimeDisplay.textContent = `Next break in: ${newInterval} minutes`;
          window.clearInterval(timerIntervalId);
          timerIntervalId = window.setInterval(() => {
            updateRemainingTimeDisplay();
          }, 1000);
        } else {
          console.error("Error updating break interval.");
          console.error(response.error);
        }
      }
    );
  });
});

chrome.storage.local.get("breakInterval", (data) => {
  if (data.breakInterval) {
    breakIntervalSlider.value = data.breakInterval;
    breakIntervalDisplay.textContent = `${data.breakInterval} minutes`;
  }
});

chrome.storage.local.get("notificationSound", (data) => {
  if (data.notificationSound == "off") {
    notificationSoundSwitch.checked = false;
    notificationSwitchText.textContent = "OFF";
  } else if (data.notificationSound == "on") {
    notificationSoundSwitch.checked = true;
    notificationSwitchText.textContent = "ON";
  }
});

notificationSoundSwitch.addEventListener("change", function (e) {
  if (e.target.checked === false) {
    chrome.storage.local.set({ notificationSound: "off" }, () => {
      notificationSwitchText.textContent = "OFF";
    });
  } else {
    chrome.storage.local.set({ notificationSound: "on" }, () => {
      notificationSwitchText.textContent = "ON";
    });
  }
});

function updateRemainingTimeDisplay() {
  chrome.alarms.get("breakReminder", (alarm) => {
    if (alarm) {
      const now = Date.now();
      const alarmTime = alarm.scheduledTime;
      const remainingTime = (alarmTime - now) / 1000;
      const remainingMins = Math.floor(remainingTime / 60);
      const remainingSeconds = Math.round(remainingTime % 60);
      if (remainingTime > 0) {
        remainingTimeDisplay.textContent = `Next break in: ${
          remainingMins > 1
            ? remainingMins + " minutes"
            : remainingMins === 1
            ? remainingMins + " minute"
            : ""
        } ${
          remainingSeconds === 1
            ? remainingSeconds + " second"
            : remainingSeconds + " seconds"
        }`;
      }
    } else {
      remainingTimeDisplay.textContent = "No break reminder set.";
    }
  });
}

updateRemainingTimeDisplay(); // Call on initial load to display initial time

currentYear.textContent = new Date().getFullYear();

timerIntervalId = window.setInterval(() => {
  updateRemainingTimeDisplay();
}, 1000);
