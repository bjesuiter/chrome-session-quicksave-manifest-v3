import { AsyncStorage } from "@solid-primitives/storage";

const rawAdapter = {
  // CAUTION: Throws on errors!
  getItem: async (key: string): Promise<string | null> => {
    const syncItems = await chrome.storage.sync.get([key]);
    console.debug(`Read ${key} from chrome.storage.sync: `, syncItems[key]);
    if (chrome.runtime.lastError) {
      throw chrome.runtime.lastError;
    }
    return syncItems[key];
  },
  setItem: async (key: string, value: string): Promise<unknown> => {
    console.debug(
      `Write key "${key}" with val "${value}" to chrome.storage.sync: `,
      value,
    );
    await chrome.storage.sync.set({ [key]: value });
    if (chrome.runtime.lastError) {
      throw chrome.runtime.lastError;
    }
    return;
  },
  removeItem: async (key: string): Promise<void> => {
    console.debug(`Remove key "${key}" from chrome.storage.sync`);

    await chrome.storage.sync.remove([key]);
    if (chrome.runtime.lastError) {
      throw chrome.runtime.lastError;
    }
    return;
  },
};

// Should not be used, since these functions are sync but call async functions internally
const proxyHandler = {
  get(target: typeof rawAdapter, prop: string) {
    console.warn(
      `Accessing property "${prop}" on ChromeSyncStorageStoreAdapter is not recommended, since it is sync but calls async functions internally.`,
    );
    target.getItem(prop);
  },
  set(target: typeof rawAdapter, prop: string, value: string) {
    console.warn(
      `Setting property "${prop}" on ChromeSyncStorageStoreAdapter is not recommended, since it is sync but calls async functions internally.`,
    );
    target.setItem(prop, value);
    return true;
  },
};

export const ChromeSyncStorageAdapterForSolidStore = () => {
  return new Proxy(rawAdapter, proxyHandler) satisfies AsyncStorage;
};
