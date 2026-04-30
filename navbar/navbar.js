// navbar.js - 修复移动端下拉菜单问题
(function() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        console.log('加载顶栏组件...');
        
        // 移动端菜单切换
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn && navMenu) {
            console.log('找到菜单元素');
            
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止事件冒泡
                navMenu.classList.toggle('active');
                console.log('切换菜单状态:', navMenu.classList.contains('active'));
            });
            
            // 移动端下拉菜单处理
            const dropdowns = document.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                const dropdownLink = dropdown.querySelector('.nav-link');
                
                if (dropdownLink) {
                    dropdownLink.addEventListener('click', function(e) {
                        // 只在移动端处理
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            e.stopPropagation(); // 阻止事件冒泡
                            
                            console.log('点击下拉菜单:', this.textContent);
                            
                            // 切换当前下拉菜单的active状态
                            dropdown.classList.toggle('active');
                            
                            // 关闭其他打开的下拉菜单
                            dropdowns.forEach(otherDropdown => {
                                if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
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
                link.addEventListener('click', function(e) {
                    console.log('点击下拉菜单链接:', this.textContent);
                    
                    // 如果是移动端，点击链接后关闭整个菜单
                    if (window.innerWidth <= 768) {
                        navMenu.classList.remove('active');
                        
                        // 移除所有下拉菜单的active状态
                        dropdowns.forEach(dropdown => {
                            dropdown.classList.remove('active');
                        });
                    }
                    
                    // 更新活动链接状态
                    const href = this.getAttribute('href');
                    if (href) {
                        updateActiveLink(href);
                    }
                });
            });
            
            // 点击普通导航链接（非下拉菜单）
            const navLinks = document.querySelectorAll('.nav-item:not(.dropdown) .nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    console.log('点击普通菜单链接:', this.textContent);
                    
                    // 如果是移动端，点击链接后关闭整个菜单
                    if (window.innerWidth <= 768) {
                        navMenu.classList.remove('active');
                    }
                    
                    // 更新活动链接状态
                    const href = this.getAttribute('href');
                    if (href) {
                        updateActiveLink(href);
                    }
                });
            });
            
            // 点击页面其他地方关闭菜单
            document.addEventListener('click', function(e) {
                // 只在移动端处理
                if (window.innerWidth <= 768) {
                    // 如果点击的不是菜单按钮和菜单内容
                    if (mobileMenuBtn && navMenu && 
                        !mobileMenuBtn.contains(e.target) && 
                        !navMenu.contains(e.target)) {
                        
                        if (navMenu.classList.contains('active')) {
                            navMenu.classList.remove('active');
                            console.log('点击页面其他位置，关闭菜单');
                            
                            // 移除所有下拉菜单的active状态
                            dropdowns.forEach(dropdown => {
                                dropdown.classList.remove('active');
                            });
                        }
                    }
                }
            });
            
            // 窗口调整大小时
            window.addEventListener('resize', function() {
                console.log('窗口大小改变:', window.innerWidth);
                
                if (window.innerWidth > 768) {
                    // 桌面端：确保菜单显示
                    navMenu.classList.remove('active');
                    
                    // 移除所有下拉菜单的active状态
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                    
                    console.log('切换到桌面端模式');
                } else {
                    console.log('切换到移动端模式');
                }
            });
            
            // 初始化：根据当前URL高亮对应链接
            function updateActiveLink(targetUrl) {
                const allNavLinks = document.querySelectorAll('.nav-link');
                
                // 找到当前页面对应的链接
                const currentPath = window.location.pathname;
                let foundActive = false;
                
                allNavLinks.forEach(link => {
                    const linkHref = link.getAttribute('href');
                    
                    // 检查是否匹配当前URL
                    if (linkHref === currentPath || 
                        (currentPath === '/' && linkHref === '/') ||
                        (targetUrl && linkHref === targetUrl)) {
                        
                        link.classList.add('active');
                        foundActive = true;
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // 如果没有找到匹配的链接，高亮首页
                if (!foundActive && allNavLinks.length > 0) {
                    const homeLink = document.querySelector('.nav-link[href="/"], .nav-link[href="#"], .nav-link[href="index.html"]');
                    if (homeLink) {
                        homeLink.classList.add('active');
                    }
                }
            }
            
            // 页面加载时初始化活动链接
            updateActiveLink();
            
            console.log('顶栏初始化完成');
        } else {
            console.error('找不到菜单元素');
        }
    });
})();
