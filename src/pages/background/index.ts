import { showError } from "@src/lib/chrome-services/notification-service";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@src/lib/main/messages-service";
import { optionsStore } from "@src/lib/main/options-service";
import { isSessionFolderValid } from "@src/lib/utils/is-session-folder-valid";
import { createEffect } from "solid-js";
import { unwrap } from "solid-js/store";
import { backgroundOnMessageListener } from "./background-on-message.listener";

console.log("background service worker loaded");

// Code to run when extension gets installed
chrome.runtime.onInstalled.addListener(async function () {
  // For debugging
  // const options = unwrap(optionsStore);
  // console.debug("Current optionsStore: ", options);

  // Example Messages & Debugging (with real-time syncing of messages to the popup)
  // clearMessages();
  // showSuccessMessage({ title: "Success", message: "Welcome" });
  // await delay(1000);
  // showInfoMessage({ title: "Info", message: "Welcome" });
  // await delay(1000);
  // showWarningMessage({ title: "Warning", message: "Welcome" });
  // await delay(1000);
  // showErrorMessage({ title: "Error", message: "Welcome" });

  try {
    // await initializeOptions();
    showSuccessMessage({
      message: "Extension Installed Successfully!",
      timeout: 5000,
    });
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
      showErrorMessage({
        message: `The selected Session Folder is invalid. Please select a valid folder.`,
      });
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

chrome.runtime.onMessage.addListener(backgroundOnMessageListener);
