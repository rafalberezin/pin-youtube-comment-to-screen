// ==UserScript==
// @name         Pin Youtube Comment To Screen
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Pin Youtube Comment To Screen
// @author       RafalBerezin
// @match        https://www.youtube.com/watch?*
// ==/UserScript==

(function () {

    // CONFIG

    // No alternative way for now. Maybe I'll add buttons to the comments in the future.
    const useKeybinds = true;
    const pinKeybind = "p";
    const hideKeybind = "h";

    const pinnedClass = "pinnedComment";
    const hiddenClass = "hidePin";

    const style = `
        .${pinnedClass}:not(.${hiddenClass}) {
            position: fixed !important;
            right: 0;
            top: 0;
            max-width: 80ch !important;
            max-height: 100vh !important;
            padding: 1em;
            background-color: #000000cc;
            border: 1px solid white;
            overflow-y: scroll  !important;
            box-sizing: border-box;
            z-index: 2200;
            & #content-text.ytd-comment-view-model {
                color: white;
            }
        }
    `;

    // CODE

    let pinnedComment = null;
    let hoveredNode = null;
    let hidden = false;

    const commentNodeSelector = "ytd-comment-thread-renderer";

    function togglePin() {
        if (!pinnedComment || unpin()) pin();
    }

    function pin() {
        const hoveredComment = getCommentNode(hoveredNode);
        if (!hoveredComment) return;

        pinnedComment = hoveredComment;
        pinnedComment.classList.add(pinnedClass);
    }

    function unpin() {
        if (!pinnedComment) return false;

        const wasHidden = hidden;
        if (wasHidden) toggleHide();

        pinnedComment.classList.remove(pinnedClass);
        pinnedComment = null;

        return wasHidden;
    }

    function getCommentNode(element) {
        return element.matches(commentNodeSelector) ? element : element.closest(commentNodeSelector);
    }

    function toggleHide() {
        if (!pinnedComment) return;

        hidden = !hidden;
        pinnedComment.classList.toggle(hiddenClass, hidden);
    }

    if (useKeybinds) {
        window.addEventListener('mouseover', e => {
            hoveredNode = e.target;
        });

        window.addEventListener('keydown', e => {
            const key = e.key.toLowerCase();

            if (key === pinKeybind) return togglePin();
            if (key === hideKeybind) return toggleHide();
        });
    }

    document.head.appendChild(document.createElement("style")).innerHTML = style;

    console.log("[Pin Comment] Script Initialized");
})();
