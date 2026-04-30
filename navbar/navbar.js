// navbar.js - 顶栏交互逻辑
(function() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 移动端菜单切换
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
            
            // 修复移动端分类菜单点击问题
            const dropdowns = document.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                const dropdownLink = dropdown.querySelector('.nav-link');
                
                if (dropdownLink) {
                    dropdownLink.addEventListener('click', function(e) {
                        // 只在移动端处理
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            e.stopPropagation(); // 阻止事件冒泡
                            
                            // 切换当前下拉菜单的active状态
                            dropdown.classList.toggle('active');
                            
                            // 关闭其他打开的下拉菜单
                            dropdowns.forEach(otherDropdown => {
                                if (otherDropdown !== dropdown) {
                                    otherDropdown.classList.remove('active');
                                }
                            });
                        }
                    });
                }
            });
            
            // 点击下拉菜单中的链接
            const dropdownLinks = document.querySelectorAll('.dropdown-content a');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // 如果是移动端，点击链接后关闭整个菜单
                    if (window.innerWidth <= 768) {
                        navMenu.classList.remove('active');
                        
                        // 移除所有下拉菜单的active状态
                        dropdowns.forEach(dropdown => {
                            dropdown.classList.remove('active');
                        });
                    }
                    
                    // 更新活动链接状态
                    updateActiveLink(this.getAttribute('href'));
                });
            });
            
            // 点击普通导航链接
            const navLinks = document.querySelectorAll('.nav-item:not(.dropdown) .nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // 如果是移动端，点击链接后关闭整个菜单
                    if (window.innerWidth <= 768) {
                        navMenu.classList.remove('active');
                        
                        // 移除所有下拉菜单的active状态
                        dropdowns.forEach(dropdown => {
                            dropdown.classList.remove('active');
                        });
                    }
                    
                    // 更新活动链接状态
                    updateActiveLink(this.getAttribute('href'));
                });
            });
            
            // 点击页面其他地方关闭菜单
            document.addEventListener('click', function(e) {
                // 如果是移动端
                if (window.innerWidth <= 768) {
                    // 如果点击的不是菜单按钮和菜单内容
                    if (mobileMenuBtn && navMenu && 
                        !mobileMenuBtn.contains(e.target) && 
                        !navMenu.contains(e.target)) {
                        navMenu.classList.remove('active');
                        
                        // 移除所有下拉菜单的active状态
                        dropdowns.forEach(dropdown => {
                            dropdown.classList.remove('active');
                        });
                    }
                }
            });
            
            // 窗口调整大小时重置菜单状态
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    navMenu.classList.remove('active');
                    
                    // 移除所有下拉菜单的active状态
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });
            
            // 初始化：根据当前URL高亮对应链接
            function updateActiveLink(targetUrl) {
                const allNavLinks = document.querySelectorAll('.nav-link');
                allNavLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // 找到当前页面对应的链接
                const currentPath = window.location.pathname;
                allNavLinks.forEach(link => {
                    const linkHref = link.getAttribute('href');
                    if (linkHref === currentPath || 
                        (currentPath === '/' && linkHref === '/') ||
                        (targetUrl && linkHref === targetUrl)) {
                        link.classList.add('active');
                    }
                });
            }
            
            // 页面加载时初始化活动链接
            updateActiveLink();
        }
    });
})();

