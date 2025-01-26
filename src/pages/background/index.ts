import {
  badgeErrNotification,
  badgeOkNotification,
  showError,
} from "@src/lib/chrome-services/notification-service";
import { optionsStore } from "@src/lib/main/options-service";
import { isSessionFolderValid } from "@src/lib/utils/is-session-folder-valid";
import { createEffect } from "solid-js";

console.log("background service worker loaded");

// Code to run when extension gets installed
chrome.runtime.onInstalled.addListener(async function () {
  try {
    // await initializeOptions();
    console.log("Extension Installed Successfully!");
  } catch (error) {
    const errorMessage = `Error while creating Extension Options Storage! Please contact the developer about it!`;
    showError("Installation Error", errorMessage);
    console.error(errorMessage, error);
  }
});

createEffect(() => {
  // For debugging
  // const options = unwrap(optionsStore);
  // console.debug("Current optionsStore: ", options);

  // check if options are initialized
  if (!optionsStore.isInitialized) {
    console.debug("Options are not initialized yet. Skipping validation.");
    return;
  }

  // validate sessionFolderId on each change
  const sessionsFolderId = optionsStore.sessionsFolderId;
  console.debug(`Validating options.sessionsFolderId: ${sessionsFolderId}...`);
  isSessionFolderValid(sessionsFolderId).then((isValid) => {
    if (isValid) {
      console.debug(`Session Folder Id "${sessionsFolderId}" is valid.`);
    } else {
      console.error(`Session Folder Id "${sessionsFolderId}" is invalid!`);
      badgeErrNotification();
      // Reset invalid sessionFolderId ?
      // setOptionsStore("sessionsFolderId", undefined);
      // TODO: show user error
      // showError(
      //   "Invalid Session Folder",
      //   `The selected Session Folder is invalid. Please select a valid folder.`,
      // );
    }
  });
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
