## Wellbyte Booster: A Chrome Extension for Improved Well-being

Wellbyte Booster is a Chrome extension designed to help you manage your well-being by encouraging you to take regular breaks throughout your workday. It provides gentle reminders to step away from your screen and offers suggestions for quick activities to help you refresh and refocus.

#### Video Demo: <https://www.youtube.com/watch?v=0D1U4mHxo8U>

#### Screenshot:

![image](https://github.com/basuabhirup/wellbyte-booster/assets/69730155/149bb6de-495c-4037-a099-3baaeddfc2e6)


**Features:**

- **Break Reminders:** Set up recurring alarms at user-defined intervals to prompt you to take breaks.
- **Activity Suggestions:** When a break reminder triggers, the extension displays a random suggestion for a quick activity, like stretching or deep breathing.
- **Notifications:** Receive desktop notifications with the break reminder message and activity suggestion. (Sound notifications can be enabled/disabled.)
- **User Preferences:** Customize your break interval and notification sound preferences.

**How to Use Wellbyte Booster:**

1. Install the Wellbyte Booster extension from the Chrome Web Store (link to be provided).
2. Click on the Wellbyte Booster icon in your Chrome toolbar.
3. Set your preferred break interval using the slider.
4. Choose whether you want to enable/disable notification sounds using the checkbox.

**Technical Breakdown:**

- **File Structure:**

  - `manifest.json`: Defines extension metadata (name, description, permissions) and configuration details (background script, popup UI).
  - `popup.html`: Provides the user interface for setting break intervals and notification sound preferences.
  - `popup.js`: Handles user interaction with the popup UI elements, updates user preferences in Chrome storage, and communicates with the background script.
  - `background.js`: Manages background processes like scheduling break reminders using Chrome's `chrome.alarms` API, displaying notifications with activity suggestions, and potentially handling notification creation using `chrome.notifications` API (commented out in current version).
  - `images`: Stores icons used in the extension (logo, potentially notification icons).

- **User Interaction and Preferences:**

  - The popup UI utilizes HTML form elements (slider, checkbox) for setting break intervals and notification sound preferences.
  - `popup.js` handles user interaction events (slider movement, checkbox toggle) and updates user preferences in Chrome storage using `chrome.storage.local.set`.
  - Error handling for storage retrieval is included in `popup.js` (commented out).

- **Background Processes:**

  - `background.js` loads user preferences from Chrome storage (with defaults if missing).
  - It creates or clears break reminder alarms based on user preferences and triggered notifications using `chrome.alarms.create` and `chrome.alarms.clear`.
  - While commented out in the current code, `background.js` could be extended to handle notification creation using `chrome.notifications.create`. The notification functionality would require additional implementation for displaying the reminder message and activity suggestion.

- **JavaScript Libraries and Frameworks:**
  - The current codebase does not utilize any external JavaScript libraries or frameworks.

**Future Enhancements:**

- **Improved UI/UX Design:** The UI in `popup.html` can be enhanced for a more visually appealing and user-friendly experience.
- **Advanced Features:**
  - Break duration variations (allow users to set different break lengths based on task type).
  - Activity categories (implement categorized activity suggestions based on user goals).
  - Integration with productivity tools (synchronize break reminders with calendars or to-do lists).
- **Testing:** Implement unit testing using frameworks like Jasmine or Mocha to ensure code reliability and catch regressions during development.

**Contribution**

We actively encourage contributions to Wellbyte Booster! Fork the repository, make improvements, and submit pull requests to enhance the extension's functionality and user experience.

**License:**

This project is licensed under the MIT License (see LICENSE file for details).

**Conclusion**

Wellbyte Booster offers a valuable tool for Chrome users seeking to promote focus and well-being during their workday. By providing customizable break reminders, insightful activity suggestions, and user-controlled notification options, the extension empowers users to take charge of their well-being and create a more sustainable work rhythm.
