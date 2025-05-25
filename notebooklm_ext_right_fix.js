// ==UserScript==
// @name         Notebook LM 强制固定右侧布局 (动态调整 body margin)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  当 Notebook LM 窗口出现时动态调整页面 body margin
// @author       You
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const notebookLMWidth = '400px'; // 定义 Notebook LM 的宽度

    // 创建一个 MutationObserver 实例来监听 notebooklm-container 的添加
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.id === 'notebooklm-container') {
                        // 当 notebooklm-container 被添加到 DOM 中时执行

                        // 动态添加调整 body margin 的样式
                        GM_addStyle(`
                            body {
                                margin-right: ${notebookLMWidth} !important; /* 强制设置 body 的右边距 */
                            }

                            /* 覆盖可能影响布局的其他 YouTube 元素 */
                            #page-manager,
                            #container.ytd-app,
                            #contentContainer,
                            #columns,
                            ytd-watch-flexy,
                            ytd-browse {
                                margin-right: ${notebookLMWidth} !important;
                            }
                        `);

                        const notebookLMContainer = node;

                        // 强制设置其位置和大小，覆盖内联样式
                        notebookLMContainer.style.position = 'absolute !important';
                        notebookLMContainer.style.top = '0 !important';
                        notebookLMContainer.style.right = '0 !important';
                        notebookLMContainer.style.width = notebookLMWidth + ' !important';
                        notebookLMContainer.style.height = '100% !important';
                        notebookLMContainer.style.zIndex = '2000 !important';
                        notebookLMContainer.style.overflowY = 'auto !important';
                        notebookLMContainer.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.2) !important';
                        notebookLMContainer.style.backgroundColor = 'white !important';
                        notebookLMContainer.style.transform = 'none !important';

                        const notebookLMPanel = notebookLMContainer.querySelector('#notebooklm-panel');
                        if (notebookLMPanel) {
                            notebookLMPanel.style.maxWidth = '100% !important';
                            notebookLMPanel.style.boxSizing = 'border-box !important';
                        }

                        // 停止观察
                        observer.disconnect();
                    }
                });
            }
        }
    });

    // 开始观察 body 元素的子节点变化
    observer.observe(document.body, { childList: true, subtree: false });

    // 页面加载时不添加任何样式来修改 body 的 margin-right
})();