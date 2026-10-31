/**
 * 页脚访问统计：本站总访问量 / 今日访问量
 *
 * 数据来源：https://cdn.busuanzi.cc
 * 说明：
 *   - 线上域名可以正常计数；
 *   - 127.0.0.1 / localhost 会被该服务禁用，此时保留占位符 "--"，
 *     不会把错误提示显示到页面上；
 *   - 统计服务不可用时静默失败，不影响页面其他功能。
 */
(function () {
  'use strict';

  var API = 'https://cdn.busuanzi.cc/api.php';

  function render(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    // 只有正常返回数字时才更新，错误响应（字符串）保持 "--"
    if (typeof value === 'number' && isFinite(value)) {
      el.textContent = value.toLocaleString('zh-CN');
    }
  }

  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: window.location.href,
      referrer: document.referrer
    })
  })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      render('busuanzi_site_pv', data.busuanzi_site_pv);
      render('busuanzi_today_pv', data.busuanzi_today_pv);
    })
    .catch(function () {
      /* 统计失败时保持占位符，不打扰读者 */
    });
})();
