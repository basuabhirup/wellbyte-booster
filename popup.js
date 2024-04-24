const breakIntervalSlider = document.getElementById("break-interval-slider");
const breakIntervalDisplay = document.getElementById("break-interval-display");
const remainingTimeDisplay = document.getElementById("remaining-time-display");
const notificationSoundSwitch = document.getElementById("notificationSound");

breakIntervalSlider.addEventListener("input", function () {
  const newInterval = breakIntervalSlider.value;
  breakIntervalDisplay.textContent = `${newInterval} minutes`;
  chrome.storage.local.set({ breakInterval: newInterval }, () => {
    // (Optional) Send message to background script
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

function updateRemainingTimeDisplay() {
  chrome.alarms.get("breakReminder", (alarm) => {
    if (alarm) {
      const now = Date.now();
      const alarmTime = alarm.scheduledTime;
      const remainingTime = (alarmTime - now) / 1000;
      const remainingMins = Math.floor(remainingTime / 60);
      const remainingSeconds = Math.round(remainingTime % 60);
      remainingTimeDisplay.textContent = `Next break in: ${remainingMins} minutes ${remainingSeconds} seconds`;
    } else {
      remainingTimeDisplay.textContent = "No break reminder set.";
    }
  });
}

notificationSoundSwitch.addEventListener("change", function (e) {
  if (e.target.checked === false) {
    document.getElementById("switch-text").textContent = "OFF";
  } else {
    document.getElementById("switch-text").textContent = "ON";
  }
});

updateRemainingTimeDisplay(); // Call on initial load to display initial time
