import { createMemo, For } from "solid-js";

export function BookmarkTree(props: {
  tree: () => chrome.bookmarks.BookmarkTreeNode[];
  class?: string;
  depth?: number;
}) {
  //   createEffect(() => {
  //     console.log("BookmarkTree", props.tree());
  //   });

  const childDepth = createMemo(() => props.depth ?? 0 + 1);

  const renderNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
    if (node.children?.length > 0) {
      return (
        <details open={false}>
          <summary>{node.title.length > 0 ? node.title : "Bookmarks"}</summary>
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
          {node.title}
        </p>
      );
    }
  };

  return <For each={props.tree()}>{(node) => renderNode(node)}</For>;
}
