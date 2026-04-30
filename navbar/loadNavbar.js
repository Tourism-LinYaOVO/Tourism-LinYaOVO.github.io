// loadNavbar.js - 动态加载顶栏组件
(function() {
    // 动态加载CSS
    function loadNavbarCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'navbar/navbar.css'; // 修改为您的CSS文件路径
        link.type = 'text/css';
        document.head.appendChild(link);
    }
    
    // 动态加载HTML
    function loadNavbarHTML(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'navbar/navbar.html', true); // 修改为您的HTML文件路径
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const navbarContainer = document.createElement('div');
                navbarContainer.id = 'navbar-container';
                navbarContainer.innerHTML = xhr.responseText;
                
                // 插入到body最前面
                document.body.insertBefore(navbarContainer, document.body.firstChild);
                
                // 添加body padding-top
                document.body.style.paddingTop = '80px';
                
                if (callback) callback();
            }
        };
        xhr.send();
    }
    
    // 动态加载JS
    function loadNavbarJS() {
        const script = document.createElement('script');
        script.src = 'navbar/navbar.js'; // 修改为您的JS文件路径
        script.type = 'text/javascript';
        document.body.appendChild(script);
    }
    
    // 初始化加载
    document.addEventListener('DOMContentLoaded', function() {
        loadNavbarCSS();
        loadNavbarHTML(loadNavbarJS);
    });
})();

