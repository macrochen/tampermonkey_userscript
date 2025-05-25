// ==UserScript==
// @name         Hide Twitter Sidebars & Center Timeline
// @name:zh-CN   隐藏推特左右边栏并居中时间线
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  Hides both sidebars on Twitter/X and centers the main timeline content.
// @description:zh-CN 隐藏推特/X的左右边栏，并将主时间线内容居中显示。
// @author       Gemini
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // CSS 选择器
    const RIGHT_SIDEBAR_SELECTOR = 'div[data-testid="sidebarColumn"]'; // 右侧边栏
    const LEFT_NAVIGATION_SELECTOR = 'header[role="banner"]'; // 左侧主导航栏
    const TIMELINE_SELECTOR = 'div[data-testid="primaryColumn"]'; // 中间的时间线/主内容列

    /**
     * 查找并隐藏指定的元素。
     * @param {string} selector CSS 选择器用于定位元素
     * @param {string} elementName 元素的名称（用于日志输出）
     */
    function hideElement(selector, elementName) {
        const element = document.querySelector(selector);
        if (element) {
            if (element.style.getPropertyValue('display') !== 'none') {
                element.style.setProperty('display', 'none', 'important');
                console.log(`推特${elementName}已隐藏 (Twitter ${elementName} hidden).`);
            }
        }
    }

    /**
     * 查找并居中时间线内容。
     */
    function centerTimelineContent() {
        const timeline = document.querySelector(TIMELINE_SELECTOR); // primaryColumn
        if (timeline) {
            // 1. 确保时间线列本身在其直接父容器中居中
            if (timeline.style.getPropertyValue('margin-left') !== 'auto' || timeline.style.getPropertyValue('margin-right') !== 'auto') {
                timeline.style.setProperty('margin-left', 'auto', 'important');
                timeline.style.setProperty('margin-right', 'auto', 'important');
                console.log('时间线 (primaryColumn) 已应用 margin:auto。');
            }

            // 2. 定位并样式化 <main role="main"> 元素，使其能有效地居中其主要子内容
            const mainRoleElement = document.querySelector('main[role="main"]');
            if (mainRoleElement) {
                mainRoleElement.style.setProperty('display', 'flex', 'important');
                mainRoleElement.style.setProperty('justify-content', 'center', 'important');
                mainRoleElement.style.setProperty('width', '100%', 'important'); // 确保它撑满父容器宽度
                mainRoleElement.style.setProperty('max-width', 'none', 'important'); // 移除可能存在的最大宽度限制
                mainRoleElement.style.setProperty('padding-left', '0px', 'important'); // 移除可能影响居中的内边距
                mainRoleElement.style.setProperty('padding-right', '0px', 'important');
                mainRoleElement.style.setProperty('box-sizing', 'border-box', 'important');
                console.log('<main role="main"> 区域已配置为 flex 居中容器。');

                // 3. 处理时间线列的直接父容器 (timelineWrapper)
                // 这个元素通常是 <main role="main"> 的直接子项或近后代，
                // 并且是实际包含时间线内容的列（例如，截图中的990px宽的div）。
                const timelineWrapper = timeline.parentElement;
                if (timelineWrapper && timelineWrapper !== mainRoleElement) {
                    timelineWrapper.style.setProperty('float', 'none', 'important'); // 清除可能存在的浮动
                    // 在 flex 容器 (mainRoleElement) 中，其子项 (timelineWrapper) 的 margin:auto 也有助于居中
                    if (timelineWrapper.style.getPropertyValue('margin-left') !== 'auto' || timelineWrapper.style.getPropertyValue('margin-right') !== 'auto') {
                         timelineWrapper.style.setProperty('margin-left', 'auto', 'important');
                         timelineWrapper.style.setProperty('margin-right', 'auto', 'important');
                         console.log('时间线包装器 (primaryColumn的父元素) 已应用 margin:auto。');
                    }
                }
            } else {
                // Fallback: 如果没有找到 main[role="main"]
                // 尝试将时间线列的直接父容器设置为块级并用 margin:auto 居中
                const timelineParent = timeline.parentElement;
                if (timelineParent && timelineParent.tagName.toLowerCase() !== 'body' && timelineParent.tagName.toLowerCase() !== 'html') {
                    timelineParent.style.setProperty('display', 'block', 'important');
                    timelineParent.style.setProperty('margin-left', 'auto', 'important');
                    timelineParent.style.setProperty('margin-right', 'auto', 'important');
                    // 如果它的父容器不是100%宽度，这个居中可能也无效，尝试设置其父容器宽度
                    if(timelineParent.parentElement) {
                        timelineParent.parentElement.style.setProperty('width', '100%', 'important');
                    }
                    console.log('Fallback: 时间线父容器已尝试使用 margin:auto 居中。');
                }
            }
        }
    }

    /**
     * 应用所有自定义样式：隐藏边栏并居中时间线。
     */
    function applyCustomStyles() {
        hideElement(RIGHT_SIDEBAR_SELECTOR, '右侧边栏');
        hideElement(LEFT_NAVIGATION_SELECTOR, '左侧导航栏');
        centerTimelineContent();
    }

    // 页面加载完成后，以及DOM动态更新时，尝试应用样式
    requestAnimationFrame(applyCustomStyles);

    const observer = new MutationObserver((mutationsList, observer) => {
        applyCustomStyles();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
