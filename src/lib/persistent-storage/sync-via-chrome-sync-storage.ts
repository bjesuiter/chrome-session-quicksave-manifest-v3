/**
 * See https://www.npmjs.com/package//@solid-primitives/storage#:~:text=Custom%20synchronization%20API
 */

import {
  PersistenceSyncAPI,
  PersistenceSyncCallback,
} from "@solid-primitives/storage";

export const ChromeExtensionSyncStorageSync = [
  /** subscribes to sync */
  (subscriber: PersistenceSyncCallback) => {
    chrome.storage.sync.onChanged.addListener((changes) => {
      for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "sync" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`,
        );
        subscriber({
          key,
          newValue,
          timeStamp: Date.now(),
        });
      }
    });
  },
  (key: string, value: string | null | undefined): void => {
    // NO-OP Updater, since writing to chrome.storage.sync provides the update automatically
  },
] satisfies PersistenceSyncAPI;
