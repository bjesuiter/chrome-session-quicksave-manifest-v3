import { isDev } from "@src/lib/flags";
import { optionsStore } from "@src/lib/main/options-service";
import "@src/styles/tailwind.css";
import { createResource, Show } from "solid-js";
import { BookmarkTree } from "./BookmarkTree";

export function OptionsPage() {
  const [bookmarkTree, { refetch }] = createResource(async () =>
    chrome.bookmarks.getTree(),
  );

  return (
    <div class="fixed inset-0 bg-slate-100 text-slate-800">
      <div class="mx-auto my-10 min-w-[300px] max-w-[900px] overflow-hidden rounded border-2 border-slate-200">
        <header class="flex flex-row items-center gap-4 bg-slate-800 p-5 text-white">
          <img
            class="size-12"
            src={chrome.runtime.getURL("icons/icon-512.png")}
          />
          <h1 class="text-2xl font-semibold">Session Quicksave Options</h1>
        </header>

        {/* Content Section */}
        <section class="min-h-[150px] overflow-y-auto p-5">
          <h2 class="text-xl font-semibold">Session Folder</h2>
          <p>Select the folder to store your sessions</p>

          <div class="my-2 text-base">
            <p class="my-4">
              <i>Current session folder marked with a golden star</i>
            </p>
            <BookmarkTree tree={bookmarkTree} />
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
