import { AsyncStorage } from "@solid-primitives/storage";

const rawAdapter = {
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
    return syncItems[key];
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
};

export const ChromeSyncStorageAdapterForSolidStore = () => {
  return rawAdapter satisfies AsyncStorage;
};
