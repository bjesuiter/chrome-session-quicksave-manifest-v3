import {
  bookmarkFolderExists,
  getBookmarkFolderByName,
} from "@src/lib/chrome-services/bookmark-service";
import {
  BOOKMARK_BAR_FOLDER_ID,
  createBookmarkFolder,
} from "../chrome-services/bookmark-service";

export const DEFAULT_SESSIONS_FOLDER_NAME = "Sessions";

/**
 * @returns Session Folder Node
 */
async function ensureDefaultSessionFolderAvailability(): Promise<chrome.bookmarks.BookmarkTreeNode> {
  const folderAvailable = await bookmarkFolderExists(
    BOOKMARK_BAR_FOLDER_ID,
    DEFAULT_SESSIONS_FOLDER_NAME,
  );
  if (!folderAvailable) {
    await createBookmarkFolder(
      BOOKMARK_BAR_FOLDER_ID,
      DEFAULT_SESSIONS_FOLDER_NAME,
    );
  }
  const defaultSessionFolderNode = await getBookmarkFolderByName(
    BOOKMARK_BAR_FOLDER_ID,
    DEFAULT_SESSIONS_FOLDER_NAME,
  );
  console.log(
    "Default sessions folder already available: ",
    defaultSessionFolderNode,
  );

  return defaultSessionFolderNode;
}
