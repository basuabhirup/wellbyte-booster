// Load user preferences from storage (default values if not set)
const storage = chrome.storage.local;
let breakInterval = 1; // Minutes
let notificationSound = true;

storage.get(["breakInterval", "notificationSound"], (data) => {
  if (data.breakInterval) {
    breakInterval = data.breakInterval;
  }
  if (data.notificationSound !== undefined) {
    notificationSound = data.notificationSound;
  }
});

chrome.alarms.create("breakReminder", { periodInMinutes: breakInterval });

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "breakReminder") {
    const activitySuggestions = [
      "Do some eye rolls!",
      "Stretch your arms and legs!",
      "Take a walk around for a minute",
      "Do some deep breathing exercises",
      "Try a quick desk yoga pose"
    ];
    const randomSuggestion = activitySuggestions[Math.floor(Math.random() * activitySuggestions.length)];
    
    const notificationOptions = {
      type: "basic",
      iconUrl: "images/icon.jpeg",
      title: "Wellbyte Booster",
      message: `Take a moment to relax and ${randomSuggestion}`,
    };
    
    if (notificationSound) {
      notificationOptions.iconUrl = "images/icon.jpeg"; // Can set a specific notification icon here
      notificationOptions.type = "basic"; // Needed for sound with basic type
    }
    
    chrome.notifications.create("breakNotification", notificationOptions);

    // Calculate idle time since last alarm
    const currentTime = performance.now();
    const idleTime = Math.floor((currentTime - lastActiveTime) / 1000 / 60);  // Convert to minutes
    console.log(`Idle time since last break: ${idleTime} minutes`);  // For demonstration purposes
    
    lastActiveTime = currentTime;  // Update last active time for next calculation
  }
});

// Removed the line: chrome.idle.getState((idleState) => { ... });

let lastActiveTime = performance.now();

// Functionality to handle user preferences in the popup (optional)
// ... (code to handle interaction with UI elements in popup.html)

// Persist user preferences to storage when they change (optional)
// ... (code to save user settings to storage)
