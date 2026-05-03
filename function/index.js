// functions/index.js

// 1. 定义一个普通函数来获取文本
function getHomeText(origin) {
  // 用 XMLHttpRequest 代替 fetch (iOS 更稳)
  var xhr = new XMLHttpRequest();
  xhr.open('GET', origin + '/static/home.txt', false); // false 表示同步
  xhr.send();
  return xhr.responseText;
}

// 2. 定义处理函数
function handleRequest(request) {
  var url = new URL(request.url);
  var action = url.searchParams.get('get');

  // 强制不缓存头
  var headers = new Headers();
  headers.append('Content-Type', 'text/html; charset=utf-8');
  headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');

  // 默认：显示真首页
  if (!action) {
    var text = getHomeText(url.origin);
    return new Response('<pre>' + text + '</pre>', { headers: headers });
  }

  // 关闭导航
  if (action === 'navbaroff') {
    return Response.redirect('/', 302);
  }

  // 导航栏（暂时写死，避免 JSON 解析错误）
  if (action === 'navbar') {
    var menu = 
      '====== TourTi Navbar ======\n\n' +
      '- <a href="/">1. 返回首页</a>\n' +
      '- <a href="/chat">2. 进入聊天室</a>\n\n' +
      '（把URL从 ? 开始的文字都替换成 ?get=navbaroff，关闭 navbar）';
    
    return new Response('<pre>' + menu + '</pre>', { headers: headers });
  }

  return new Response('Error: Unknown command.', { status: 404, headers: headers });
}

// 3. 导出（Cloudflare 标准写法）
addEventListener('fetch', function(event) {
  event.respondWith(handleRequest(event.request));
});
