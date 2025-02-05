/**
 * A service which manages the options for this extension and saves them to chrome.storage.sync.
 */

import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { ChromeSyncStorageAdapterForSolidStore } from "../chrome-services/chrome-sync-storage-adapter-for-solid-store";
import { ChromeExtensionSyncStorageSync } from "../persistent-storage/sync-via-chrome-sync-storage";
import { SessionQuicksaveOptions } from "./session-quicksave-options";

export const [optionsLoadingError, setOptionsLoadingError] = createSignal<
  string | undefined
>(undefined);

/**
 * States of this store
 *
 * - when loading the chrome Extensions:
 *   - optionsStore contains the default values passed to createStore() function below
 *   - sync storage is not yet loaded, indicated by the isInitialized === false prop
 *
 * - when sync storage contains nothing:
 *   - optionsStore contains the default values of the SessionQuicksaveOptions schema,
 *     in particular: isFirstStart === true, isInitialized === true
 *     => can be used to detect the first start of the extension
 *
 * - when sync storage contains values:
 *   - optionsStore contains the values from the sync storage
 *
 */
export const [optionsStore, setOptionsStore, _initValues] = makePersisted(
  // eslint-disable-next-line solid/reactivity
  createStore<SessionQuicksaveOptions>({
    sessionsFolderId: undefined,
    isInitialized: false,
    openBookmarkTreeNodes: [],
  }),
  {
    storage: ChromeSyncStorageAdapterForSolidStore,
    // The name of this store inside chrome.storage.sync
    name: "options",
    serialize: (value: SessionQuicksaveOptions) => JSON.stringify(value),
    deserialize: (value: string | Record<string, unknown> | undefined) => {
      if (typeof value === "string") {
        value = JSON.parse(value);
      }
      const parsed = SessionQuicksaveOptions.safeParse(value);
      if (!parsed.success) {
        console.error({
          message: `Could not parse options from chrome.storage.sync: ${parsed.error.message}`,
        });
        setOptionsLoadingError(
          `Could not parse options from chrome.storage.sync: ${parsed.error.message}`,
        );
        // throw new Error(
        //   `Could not parse options from chrome.storage.sync: ${parsed.error.message}`,
        // );
        return;
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

// HELPER Functions

export function bookmarkTreeNodeSetOpen(
  node: chrome.bookmarks.BookmarkTreeNode,
  isOpen: boolean,
) {
  const openNodes = new Set(optionsStore.openBookmarkTreeNodes);
  console.log("bookmarkTreeNodeSetOpen", node, isOpen);
  if (isOpen) {
    openNodes.add(node.id);
  } else {
    openNodes.delete(node.id);
  }
  setOptionsStore("openBookmarkTreeNodes", Array.from(openNodes));
}

export function bookmarkTreeNodeIsOpen(
  node: chrome.bookmarks.BookmarkTreeNode,
) {
  return optionsStore.openBookmarkTreeNodes.includes(node.id);
}

export function setSessionsFolderId(folderId: string) {
  setOptionsStore("sessionsFolderId", folderId);
}

export function isNodeSessionsFolder(folderId: string) {
  return folderId === optionsStore.sessionsFolderId;
}
