import {
  bookmarkTreeNodeIsOpen,
  bookmarkTreeNodeSetOpen,
} from "@src/lib/main/options-service";
import { createMemo, For, Match, Switch } from "solid-js";
import BookmarkIcon from "~icons/material-symbols-light/bookmark-outline?width=24px&height=24px";
import FolderEmptyIcon from "~icons/material-symbols-light/folder-outline-rounded?width=24px&height=24px";
import FolderFullIcon from "~icons/material-symbols-light/folder-rounded?width=24px&height=24px";

export function BookmarkTree(props: {
  tree: () => chrome.bookmarks.BookmarkTreeNode[];
  class?: string;
  depth?: number;
}) {
  //   createEffect(() => {
  //     console.log("BookmarkTree", props.tree());
  //   });
  const childDepth = createMemo(() => props.depth ?? 0 + 1);

  const renderNodeIcon = (node: chrome.bookmarks.BookmarkTreeNode) => {
    return (
      <Switch>
        <Match when={node.url === undefined && node.children?.length === 0}>
          <FolderEmptyIcon class="mb-[3px] inline" />
        </Match>
        <Match when={node.url === undefined && node.children?.length > 0}>
          <FolderFullIcon class="mb-[3px] inline" />
        </Match>
        <Match when={node.url !== undefined}>
          <BookmarkIcon class="mb-[3px] inline" />
        </Match>
      </Switch>
    );
  };

  const handleNodeToggle = (event: ToggleEvent, node) => {
    bookmarkTreeNodeSetOpen(node, event.newState === "open");
  };

  const renderNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
    if (node.children?.length > 0) {
      return (
        <details
          open={bookmarkTreeNodeIsOpen(node)}
          onToggle={(e) => handleNodeToggle(e, node)}
        >
          <summary>
            {renderNodeIcon(node)}

            {node.title.length > 0 ? node.title : "Bookmarks"}
          </summary>
          {/* Children of THIS <details> tag */}
          <div
            style={{
              "margin-left": `${childDepth()}rem`,
            }}
          >
            <BookmarkTree tree={() => node.children} depth={childDepth()} />
          </div>
        </details>
      );
    } else {
      return (
        <p
          style={{
            "margin-left": `${childDepth()}rem`,
          }}
        >
          {renderNodeIcon(node)}
          {node.title}
        </p>
      );
    }
  };

  return <For each={props.tree()}>{(node) => renderNode(node)}</For>;
}
