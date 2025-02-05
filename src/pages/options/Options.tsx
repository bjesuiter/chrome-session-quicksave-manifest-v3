import { isDev } from "@src/lib/flags";
import { userMessages } from "@src/lib/main/messages-service";
import { optionsStore } from "@src/lib/main/options-service";
import "@src/styles/tailwind.css";
import { createMemo, createResource, Show } from "solid-js";
import { BookmarkTree } from "./BookmarkTree";

export function OptionsPage() {
  const [bookmarkTree] = createResource(async () => chrome.bookmarks.getTree());

  // an array of all nodes in the hirarchy of the selected sessions folder
  const [selectedHirarchyNodes] = createResource(
    () => optionsStore.sessionsFolderId,
    async (sessionsFolderId) => {
      const hirarchyNodes = [];

      if (!sessionsFolderId || sessionsFolderId === "") return hirarchyNodes;
      console.log("optionsStore.sessionsFolderId", sessionsFolderId);

      let nodes = await chrome.bookmarks.get(sessionsFolderId);
      while (nodes[0] && nodes[0].parentId) {
        nodes = await chrome.bookmarks.get(nodes[0].parentId);
        if (!nodes || !nodes[0]) return hirarchyNodes;
        hirarchyNodes.push(nodes[0]);
      }

      return hirarchyNodes;
    },
  );

  // an array of all node IDs in the hirarchy of the selected sessions folder
  const selectedHirarchyNodeIDs = createMemo(() => {
    if (!selectedHirarchyNodes()) return [];
    const nodeIDs = selectedHirarchyNodes().map((node) => node.id);
    console.log("selectedHirarchyNodeIDs", nodeIDs);
    return nodeIDs;
  });

  const invalidSessionFolderMessage = createMemo(() => {
    return userMessages.find(
      (message) => message.id === "invalid-session-folder",
    );
  });

  return (
    <div class="fixed inset-0 bg-slate-100 text-slate-800">
      {/* x-centered box */}
      <div class="mx-auto my-10 flex h-[90dvh] min-w-[300px] max-w-[900px] flex-col overflow-hidden rounded border-2 border-slate-200">
        {/* Header section */}
        <header class="flex flex-row items-center gap-4 bg-slate-800 p-5 text-white">
          <img
            class="size-12"
            src={chrome.runtime.getURL("icons/icon-512.png")}
          />
          <h1 class="text-2xl font-semibold">Session Quicksave Options</h1>
        </header>

        {/* Content Section */}
        <section class="min-h-[150px] overflow-y-auto p-5">
          {/* Render message here when message id invalid-session-folder exists */}
          <Show when={invalidSessionFolderMessage()}>
            {(_props) => (
              <div class="mb-4 mt-2 flex cursor-pointer items-center space-x-2 rounded border-2 border-solid border-yellow-500 p-2">
                <div class="size-3 rounded-full bg-yellow-500" />
                <div>
                  <p class="text-base font-bold">
                    You're selected session folder is invalid.
                  </p>
                  <span class="font-semibold">
                    Please select a folder below by clicking on the hollow star
                    besides the name.
                  </span>
                </div>
              </div>
            )}
          </Show>

          <h2 class="text-xl font-semibold">Session Folder</h2>
          <p>Select the folder to store your sessions</p>

          <div class="my-2 text-base">
            <p class="my-4">
              <i>Current session folder marked with a golden star</i>
            </p>
            <BookmarkTree
              tree={bookmarkTree}
              selectedHirarchyNodeIDs={selectedHirarchyNodeIDs()}
            />
          </div>

          <Show when={isDev}>
            <h2 class="mb-2 mt-8 text-xl font-bold text-red-600">
              DEV Section
            </h2>
            <div class="border-b-2 border-dashed border-red-600" />
            <div class="mt-4 flex-col gap-4">
              <h3 class="text-lg font-semibold">
                Stored Options in chrome.storage.sync
              </h3>
              <pre>{JSON.stringify(optionsStore, null, 2)}</pre>
            </div>
          </Show>
        </section>
      </div>
    </div>
  );
}
