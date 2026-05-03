// functions/index.js

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const action = url.searchParams.get('get');

  // 强制禁用缓存头
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0'
  };

  // 默认：显示真首页
  if (!action) {
    try {
      // 使用完整的 URL 来 fetch，避免路径错误
      const homeRes = await fetch(`${url.origin}/static/home.txt`);
      const homeText = await homeRes.text();
      return new Response(`<pre>${homeText}</pre>`, { headers });
    } catch (e) {
      return new Response(`Error loading home: ${e.message}`, { status: 500 });
    }
  }

  // 执行导航
  if (action === 'navbar') {
    try {
      const navRes = await fetch(`${url.origin}/static/navbar.json`);
      const navData = await navRes.json();
      
      let output = '====== TourTi Navbar ======\n\n';
      navData.forEach(item => {
        output += `- <a href="${item.link}">${item.text}</a>\n`;
      });
      output += '\n--------------------------------';
      output += '\n（把URL从 ? 开始的文字都替换成 ?get=navbaroff，关闭 navbar）';

      return new Response(`<pre>${output}</pre>`, { headers });
    } catch (e) {
      return new Response(`Error loading navbar: ${e.message}`, { status: 500 });
    }
  }

  // 关闭导航
  if (action === 'navbaroff') {
    return Response.redirect('/', 302);
  }

  return new Response('Error: Unknown command.', { status: 404, headers });
}
