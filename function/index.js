// functions/index.js

async function fetchText(path) {
  return await fetch(path).then(res => res.text());
}

async function fetchJson(path) {
  return await fetch(path).then(res => res.json());
}

// 打印菜单（不再修改链接，只打印）
function printMenu(items) {
  let output = '====== TourTi Navbar ======\n\n';
  
  items.forEach(item => {
    // 链接保持原样
    output += `- <a href="${item.link}">${item.text}</a>\n`;
    if (item.children) {
      item.children.forEach(child => {
        output += `  - <a href="${child.link}">${child.text}</a>\n`;
      });
    }
  });
  
  // 👇 这里是重点：只是显示一段文字给用户看，不处理逻辑
  output += '\n--------------------------------';
  output += '\n（把URL从 ? 开始的文字都替换成 ?get=navbaroff，关闭 navbar）';
  return output;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const action = url.searchParams.get('get');

  // 1. 默认：显示真首页
  if (!action) {
    const homeContent = await fetchText('/static/home.txt');
    return new Response(`<pre>${homeContent}</pre>`);
  }

  // 2. 执行导航：显示菜单
  if (action === 'navbar') {
    const navData = await fetchJson('/static/navbar.json');
    let html = '<html><body><pre>';
    html += printMenu(navData);
    html += '</pre></body></html>';
    return new Response(html);
  }

  // 3. 关闭导航：返回主页
  if (action === 'navbaroff') {
    return Response.redirect('/', 302);
  }

  return new Response('Error: Unknown command.', { status: 404 });
}

