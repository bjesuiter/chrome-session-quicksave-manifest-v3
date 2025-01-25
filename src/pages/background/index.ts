import { showError } from "@src/lib/chrome-services/notification-service";
import { initializeOptions } from "@src/lib/main/initialize-options";

console.log("background service worker loaded");

// Code to run when extension gets installed
chrome.runtime.onInstalled.addListener(async function () {
    try {
        await initializeOptions();
        console.log("Extension Installed Successfully!");
    } catch (error) {
        const errorMessage =
            `Error while creating Extension Options Storage! Please contact the developer about it!`;
        showError("Installation Error", errorMessage);
        console.error(errorMessage, error);
    }
});

chrome.action.onClicked.addListener(
    /**
     * @param currentTab see https://developer.chrome.com/extensions/tabs#type-Tab
     */
    async (currentTab) => {
        // try {
        //     await quicksaveSession(currentTab);
        // } catch (error) {
        //     await showError(
        //         "Session Quicksave - Error",
        //         `The session could not be saved.`,
        //     );
        //     console.error(error);
        // }
    },
);
