/**
 * 语言检测和重定向脚本
 * Language detection and redirect script
 */

(function() {
    'use strict';

    // 语言映射配置
    const LANGUAGE_CONFIG = {
        // 支持的语言
        supportedLanguages: ['zh', 'en'],
        
        // 默认语言
        defaultLanguage: 'zh',
        
        // 语言路径映射
        languagePaths: {
            'zh': '',      // 中文在根目录
            'en': 'en/'    // 英文在 en/ 子目录
        },
        
        // 页面映射
        pageMapping: {
            'index.html': 'index.html',
            'privacy.html': 'privacy.html',
            'terms.html': 'terms.html',
            'disclaimer.html': 'disclaimer.html',
            'changelog.html': 'changelog.html',
            'qa.html': 'qa.html'
        }
    };

    /**
     * 获取用户首选语言
     * @returns {string} 语言代码
     */
    function getUserPreferredLanguage() {
        // 1. 检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && LANGUAGE_CONFIG.supportedLanguages.includes(langParam)) {
            return langParam;
        }

        // 2. 检查localStorage（用户手动选择的语言）
        const storedLang = localStorage.getItem('tradeFlex_preferred_language');
        if (storedLang && LANGUAGE_CONFIG.supportedLanguages.includes(storedLang)) {
            return storedLang;
        }

        // 3. 检查浏览器语言（仅在首次访问时使用）
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // 'zh-CN' -> 'zh'
        
        if (LANGUAGE_CONFIG.supportedLanguages.includes(langCode)) {
            return langCode;
        }

        // 4. 返回默认语言
        return LANGUAGE_CONFIG.defaultLanguage;
    }

    /**
     * 获取当前页面语言
     * @returns {string} 当前语言代码
     */
    function getCurrentLanguage() {
        const path = window.location.pathname;
        
        // 检查是否在英文目录
        if (path.includes('/en/')) {
            return 'en';
        }
        
        // 默认为中文
        return 'zh';
    }

    /**
     * 获取当前页面名称
     * @returns {string} 页面名称
     */
    function getCurrentPageName() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';
        return fileName;
    }

    /**
     * 构建目标URL
     * @param {string} targetLang 目标语言
     * @param {string} pageName 页面名称
     * @returns {string} 目标URL
     */
    function buildTargetUrl(targetLang, pageName) {
        const basePath = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
        const langPath = LANGUAGE_CONFIG.languagePaths[targetLang];
        
        // 如果当前在子目录，需要回到根目录
        let targetPath = basePath;
        if (getCurrentLanguage() === 'en') {
            targetPath = basePath.replace('/en', '');
        }
        
        // 添加语言路径
        if (langPath) {
            targetPath += '/' + langPath;
        }
        
        // 添加页面名称
        targetPath += '/' + pageName;
        
        return targetPath;
    }

    /**
     * 重定向到指定语言版本
     * @param {string} targetLang 目标语言
     * @param {boolean} isUserAction 是否为用户主动操作
     */
    function redirectToLanguage(targetLang, isUserAction = false) {
        const currentLang = getCurrentLanguage();
        
        // 如果已经是目标语言，不需要重定向
        if (currentLang === targetLang) {
            // 即使是相同语言，如果是用户操作，也要保存偏好
            if (isUserAction) {
                localStorage.setItem('tradeFlex_preferred_language', targetLang);
            }
            return;
        }

        const pageName = getCurrentPageName();
        const targetUrl = buildTargetUrl(targetLang, pageName);
        
        // 保存用户语言偏好
        localStorage.setItem('tradeFlex_preferred_language', targetLang);
        
        // 重定向
        window.location.href = targetUrl;
    }

    /**
     * 自动语言检测和重定向
     */
    function autoLanguageRedirect() {
        // 检查是否禁用自动重定向
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('no_redirect') === '1') {
            return;
        }

        // 检查用户是否已经手动选择过语言
        const storedLang = localStorage.getItem('tradeFlex_preferred_language');
        
        // 如果用户已经手动选择过语言，完全停止自动重定向
        if (storedLang && LANGUAGE_CONFIG.supportedLanguages.includes(storedLang)) {
            // 用户已经做过选择，不再进行任何自动重定向
            return;
        }
        
        // 只有在用户从未手动选择过语言的情况下，才进行浏览器语言检测
        // 并且只在访问根页面时进行
        const currentLang = getCurrentLanguage();
        const currentPage = getCurrentPageName();
        
        if (currentPage === 'index.html') {
            const browserLang = navigator.language || navigator.userLanguage;
            const langCode = browserLang.split('-')[0];
            
            if (LANGUAGE_CONFIG.supportedLanguages.includes(langCode) && langCode !== currentLang) {
                redirectToLanguage(langCode);
            }
        }
    }

    /**
     * 初始化语言切换功能
     */
    function initLanguageSwitcher() {
        // 为语言切换链接添加事件监听器
        document.addEventListener('click', function(e) {
            // 检查是否点击了语言切换链接
            const target = e.target.closest('[data-lang]');
            if (target) {
                e.preventDefault();
                const targetLang = target.getAttribute('data-lang');
                redirectToLanguage(targetLang, true); // 标记为用户操作
                return;
            }
            
            // 检查是否点击了下拉菜单中的语言链接
            const dropdownItem = e.target.closest('.dropdown-menu .dropdown-item');
            if (dropdownItem && dropdownItem.getAttribute('href')) {
                const href = dropdownItem.getAttribute('href');
                if (href.includes('en/') || href === 'index.html' || href === '../index.html') {
                    e.preventDefault();
                    const targetLang = href.includes('en/') ? 'en' : 'zh';
                    redirectToLanguage(targetLang, true); // 标记为用户操作
                }
            }
        });

        // 更新语言切换器的链接
        updateLanguageSwitcherLinks();
    }

    /**
     * 更新语言切换器链接
     */
    function updateLanguageSwitcherLinks() {
        const currentPage = getCurrentPageName();
        const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
        
        dropdownItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href) {
                // 检查是否是语言切换链接
                if (href.includes('en/') || href === 'index.html') {
                    const targetLang = href.includes('en/') ? 'en' : 'zh';
                    const targetUrl = buildTargetUrl(targetLang, currentPage);
                    item.setAttribute('href', targetUrl);
                }
            }
        });
    }

    // 页面加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化语言切换功能
        initLanguageSwitcher();
        
        // 延迟执行自动重定向，避免影响页面加载
        setTimeout(autoLanguageRedirect, 100);
    });

    // 导出函数供外部使用
    window.TradeFlex = window.TradeFlex || {};
    window.TradeFlex.Language = {
        redirectToLanguage: redirectToLanguage,
        getCurrentLanguage: getCurrentLanguage,
        getUserPreferredLanguage: getUserPreferredLanguage
    };

})();