const storage = chrome.storage.local;
let breakInterval;
let notificationSound;

// Load user preferences from storage (default values if not set)
storage.get("breakInterval", (data) => {
  if (data.breakInterval) {
    breakInterval = data.breakInterval;
  } else {
    // Set a default value if breakInterval is missing from storage
    breakInterval = 30; // Minutes
    storage.set({ breakInterval }, () => {
      console.log("Default break interval set to 30 minutes");
    });
  }
  chrome.alarms.create("breakReminder", {
    periodInMinutes: Number(breakInterval),
  });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "breakReminder") {
    const activitySuggestions = [
      "Do some eye rolls!",
      "Stretch your arms and legs!",
      "Take a walk around for a minute",
      "Do some deep breathing exercises",
      "Try a quick desk yoga pose",
    ];
    const randomSuggestion =
      activitySuggestions[
        Math.floor(Math.random() * activitySuggestions.length)
      ];

    const notificationOptions = {
      type: "basic",
      iconUrl: "images/icon.jpeg",
      title: "Wellbyte Booster",
      message: `Take a moment to relax and ${randomSuggestion}`,
      priority: 2,
      requireInteraction: true,
    };

    storage.get("notificationSound", (data) => {
      if (data.notificationSound) {
        notificationSound = data.notificationSound;
      } else {
        // Set a default value if notificationSound is missing from storage
        notificationSound = "on";
        storage.set({ notificationSound }, () => {
          console.log("Default notification sound set on");
        });
      }
    });

    if (notificationSound === "off") {
      notificationOptions.silent = true;
      notificationOptions.priority = 0;
    } else if (notificationSound == "on") {
      notificationOptions.silent = false;
      notificationOptions.priority = 2;
      chrome.runtime.sendMessage(
        {
          action: "playNotificationAudio",
        },
        (response) => {
          // Add callback function to receive response
          if (response && response.success) {
            console.log("Notification sound played successfully!");
          } else {
            console.error("Error playing notification sound.");
            console.error(response.error);
          }
        }
      );
    }

    chrome.notifications.create(
      "breakNotification",
      notificationOptions,
      (notificationId) => {
        if (notificationId.length < 1) {
          console.error(
            "Error creating notification:",
            chrome.runtime.lastError.message
          );
        }
      }
    );

    // Re-create the alarm with the stored break interval
    storage.get("breakInterval", (data) => {
      if (data.breakInterval) {
        chrome.alarms.clear("breakReminder");
        chrome.alarms.create("breakReminder", {
          periodInMinutes: Number(data.breakInterval),
        });
      } else {
        console.error("Error retrieving break interval from storage.");
      }
    });

    // Calculate idle time since last alarm
    const currentTime = performance.now();
    const idleTime = Math.floor((currentTime - lastActiveTime) / 1000 / 60); // Convert to minutes
    console.log(`Idle time since last break: ${idleTime} minutes`); // For demonstration purposes

    lastActiveTime = currentTime; // Update last active time for next calculation
  }
});

let lastActiveTime = performance.now();

// Functionality to handle user preferences in the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBreakInterval") {
    const newInterval = Number(message.newInterval); // Ensure numeric conversion
    if (!isNaN(newInterval) && newInterval > 0) {
      chrome.alarms.clear("breakReminder");
      chrome.alarms.create("breakReminder", {
        periodInMinutes: newInterval,
      });
      sendResponse({ success: true });
    } else {
      console.error("Invalid break interval received:", message.newInterval);
      sendResponse({ success: false, error: "Invalid break interval" });
    }
  }
});
