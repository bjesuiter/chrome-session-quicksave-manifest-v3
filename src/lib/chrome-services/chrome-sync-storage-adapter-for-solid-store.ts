import { AsyncStorage } from "@solid-primitives/storage";

export const ChromeSyncStorageAdapterForSolidStore = {
  // CAUTION: Throws on errors!
  getItem: async (key: string): Promise<string | null> => {
    const syncItems = await chrome.storage.sync.get([key]);
    console.debug(`Read ${key} from chrome.storage.sync: `, syncItems[key]);
    if (chrome.runtime.lastError) {
      console.error(
        `Error reading key "${key}" from chrome.storage.sync: `,
        chrome.runtime.lastError,
      );
      throw chrome.runtime.lastError;
    }
    // if syncItems[key] is undefined, return an empty object so that the deserialize function is called higher up in the store
    // otherwise i can't check if i read the values from the first start of the extension or only nothing because the store was not initialized properly.
    // see options-service.ts for details
    return syncItems[key] ?? {};
  },
  setItem: async (key: string, value: string): Promise<unknown> => {
    console.debug(
      `Write key "${key}" to chrome.storage.sync with value:`,
      value,
    );
    await chrome.storage.sync.set({ [key]: value });
    if (chrome.runtime.lastError) {
      console.error(
        `Error writing key "${key}" to chrome.storage.sync: `,
        chrome.runtime.lastError,
      );
      throw chrome.runtime.lastError;
    }
    return;
  },
  removeItem: async (key: string): Promise<void> => {
    console.debug(`Remove key "${key}" from chrome.storage.sync`);

    await chrome.storage.sync.remove([key]);
    if (chrome.runtime.lastError) {
      console.error(
        `Error removing key "${key}" from chrome.storage.sync: `,
        chrome.runtime.lastError,
      );
      throw chrome.runtime.lastError;
    }
    return;
  },
} satisfies AsyncStorage;
