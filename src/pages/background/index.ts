import {
  badgeErrNotification,
  badgeOkNotification,
  showError,
} from "@src/lib/chrome-services/notification-service";
import { initializeOptions } from "@src/lib/main/initialize-options";

console.log("background service worker loaded");

// Code to run when extension gets installed
chrome.runtime.onInstalled.addListener(async function () {
  try {
    await initializeOptions();
    console.log("Extension Installed Successfully!");
  } catch (error) {
    const errorMessage = `Error while creating Extension Options Storage! Please contact the developer about it!`;
    showError("Installation Error", errorMessage);
    console.error(errorMessage, error);
  }
});

chrome.runtime.onMessage.addListener(
  async (message, _sender, _sendResponse) => {
    console.log("Message received in background:", message);

    if (message.type === "command") {
      switch (message.command) {
        case "showOkBadge": {
          await badgeOkNotification();
          // Note: This command cannot get a response since the sender is not available anymore
          break;
        }
        case "showErrBadge": {
          await badgeErrNotification();
          // Note: This command cannot get a response since the sender is not available anymore
          break;
        }
        default: {
          console.warn(
            "Unknown command received in background:",
            message.command,
          );
          break;
        }
      }
    }

    // Return `true` if you want to send a response asynchronously
    return true;
  },
);
