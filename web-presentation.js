/* Browser presentation only; native Windows and Android keep their own shells. */
(function () {
  'use strict';
  if (window.desktopWindow || window.AndroidHost || window.AndroidGameRuntime ||
      (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) return;
  var content = document.querySelector('#screen');
  if (!content) return;
  var reminder = '本页面为尚未公开发行的开发测试版本，仅向受邀测试者开放';
  var mobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var desktopLayout = false;
  document.body.classList.add('web-preview');
  var stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'web-presentation.css';
  document.head.appendChild(stylesheet);
  function update() {
    var hint = content.querySelector('.zero-menu.abnormal-game-menu .game-bgm-hint');
    if (hint && hint.textContent !== reminder) hint.textContent = reminder;
    var archive = content.querySelector('.ending-gallery.ending-archive, .ending-detail-page.ending-archive');
    if (archive && !archive.querySelector('.android-archive-back')) {
      var detail = archive.classList.contains('ending-detail-page');
      var navigation = document.createElement('nav');
      navigation.className = 'android-archive-back';
      var back = document.createElement('button');
      back.type = 'button';
      back.className = 'icon-button';
      back.setAttribute('data-action', detail ? 'ending-gallery' : 'ending-gallery-back');
      back.setAttribute('aria-label', detail ? '返回图鉴' : '返回游戏主页');
      back.innerHTML = icon('back');
      navigation.appendChild(back);
      archive.insertBefore(navigation, archive.firstChild);
    }
    var guides = content.querySelectorAll('[data-author-playlist-guide]');
    for (var i = 0; i < guides.length; i++) {
      var guide = guides[i];
      if (guide.querySelector('[data-web-playlist-link]')) continue;
      var label = document.createElement('span');
      label.textContent = guide.textContent;
      label.appendChild(document.createElement('br'));
      var link = document.createElement('a');
      link.href = 'https://163cn.tv/bhMY8KCM';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('data-web-playlist-link', '');
      link.textContent = '点击此处跳转歌单';
      label.appendChild(link);
      guide.textContent = '';
      guide.appendChild(label);
    }
    var opening = !!content.querySelector('.creation-notice');
    var menu = typeof view !== 'undefined' && (view === 'game-menu' || view === 'nodes');
    var creating = typeof mobileCreating !== 'undefined' && mobileCreating;
    document.body.classList.toggle('pc-phone-mode', desktopLayout && !opening && (!menu || creating));
  }
  function resize() {
    desktopLayout = !mobileDevice && window.innerWidth >= 768;
    document.body.classList.toggle('web-desktop-layout', desktopLayout);
    if (desktopLayout) {
      var scale = Math.min(1.2, Math.max(1, (innerHeight - 48) / 940), Math.max(1, (innerWidth - 36) / 470));
      document.body.style.setProperty('--pc-phone-scale', String(scale));
    } else {
      document.body.style.removeProperty('--pc-phone-scale');
    }
    update();
  }
  new MutationObserver(update).observe(content, { childList: true, subtree: true });
  window.addEventListener('resize', resize);
  document.addEventListener('fullscreenchange', resize);
  resize();
})();
