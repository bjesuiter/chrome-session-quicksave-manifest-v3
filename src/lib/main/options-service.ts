/**
 * A service which manages the options for this extension and saves them to chrome.storage.sync.
 */

import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { ChromeSyncStorageAdapterForSolidStore } from "../chrome-services/chrome-sync-storage-adapter-for-solid-store";
import { SessionQuicksaveOptions } from "../models/session-quicksave-options";
import { ChromeExtensionSyncStorageSync } from "../persistent-storage/sync-via-chrome-sync-storage";

export const [optionsLoadingError, setOptionsLoadingError] = createSignal<
  string | undefined
>(undefined);

export const [optionsStore, setOptionsStore, _initValues] = makePersisted(
  // eslint-disable-next-line solid/reactivity
  createStore<SessionQuicksaveOptions>({
    sessionsFolderId: undefined,
    isInitialized: false,
    openBookmarkTreeNodes: [],
  }),
  {
    storage: ChromeSyncStorageAdapterForSolidStore(),
    // The name of this store inside chrome.storage.sync
    name: "options",
    serialize: (value: SessionQuicksaveOptions) => JSON.stringify(value),
    deserialize: (value: string) => {
      const parsed = SessionQuicksaveOptions.safeParse(JSON.parse(value));
      if (!parsed.success) {
        setOptionsLoadingError(
          `Could not parse options from chrome.storage.sync: ${parsed.error.message}`,
        );
        throw new Error(
          `Could not parse options from chrome.storage.sync: ${parsed.error.message}`,
        );
      }
      return parsed.data;
    },
    sync: ChromeExtensionSyncStorageSync,
  },
);

// async function initStoreFromSyncStorage() {
//   const syncItems = await chrome.storage.sync.get(["options"]);
//   console.log(`Read Options from chrome.storage.sync: `, syncItems.options);
//   if (chrome.runtime.lastError) {
//     setOptionsLoadingError(chrome.runtime.lastError.message);
//   }
//   const optionsParsed = SessionQuicksaveOptions.safeParse(syncItems.options);
//   if (!optionsParsed.success) {
//     setOptionsLoadingError(
//       `Could not parse options from chrome.storage.sync: ${optionsParsed.error.message}`,
//     );
//   }

//   const decodedOptions = optionsParsed.data;
//   setOptionsStore(decodedOptions);
// }

// // Global Init
// initStoreFromSyncStorage();
