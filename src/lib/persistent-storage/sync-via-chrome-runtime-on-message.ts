/**
 * See https://www.npmjs.com/package//@solid-primitives/storage#:~:text=Custom%20synchronization%20API
 */

import {
  PersistenceSyncAPI,
  PersistenceSyncCallback,
} from "@solid-primitives/storage";

export const ChromeExtensionMessageSync = [
  /** subscribes to sync */
  (subscriber: PersistenceSyncCallback) => {
    chrome.runtime.onMessage.addListener(
      (message: any, _sender, _sendResponse) => {
        if (message.type === "persistenceSync") {
          subscriber(message.data);
        }
      },
    );
  },
  (key: string, value: string | null | undefined): void => {
    chrome.runtime.sendMessage({
      type: "persistenceSync",
      data: {
        key,
        newValue: value,
        timeStamp: Date.now(),
      },
    });
  },
] satisfies PersistenceSyncAPI;
