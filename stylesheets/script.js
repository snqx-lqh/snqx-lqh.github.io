/**
 * ================================================
 * 嵌入式博客主页 - 交互逻辑
 * 功能: 文章数据、动画控制、访问统计
 * ================================================
 */

'use strict';

// ================================================
// 数据层 (Data Layer)
// ================================================

/** 置顶文章数据 */
const PINNED_ARTICLES = [
  {
    id: 1,
    category: 'freeRTOS',
    categoryLabel: 'FreeRTOS',
    title: '从零开始编写 FreeRTOS 任务调度器',
    description: '深入理解 FreeRTOS 内核，手把手实现任务创建、切换与调度，剖析源码级实现细节。',
    tags: ['FreeRTOS', 'STM32', 'C'],
    url: '/嵌入式/1/1/'
  },
  {
    id: 2,
    category: 'esp32',
    categoryLabel: 'ESP32',
    title: 'ESP32 BLE 蓝牙实战：从配对到数据传输',
    description: '详解 ESP32 BLE 协议栈架构，实现手机与设备的双向数据通信，含完整示例工程。',
    tags: ['ESP32', 'BLE', 'IoT'],
    url: '/嵌入式/2/2/'
  },
  {
    id: 3,
    category: 'linux',
    categoryLabel: 'Linux',
    title: 'Linux 设备树（Device Tree）完全解读',
    description: '从 U-Boot 到内核启动，拆解设备树工作原理，基于 IMX6ULL 平台实战验证。',
    tags: ['Linux', 'IMX6ULL', '设备树'],
    url: '/嵌入式/1/1/'
  }
];

/** 开源项目数据 */
const OPEN_SOURCE_PROJECTS = [
  {
    id: 'mcuboot',
    name: 'MCUBoot',
    description: '通用嵌入式 Bootloader，支持 STM32 / ESP32 OTA 升级与安全回滚',
    tags: ['C', 'STM32', 'ESP32'],
    stars: 128,
    iconId: 'monitor',
    url: 'https://github.com'
  },
  {
    id: 'embedcli',
    name: 'EmbedCLI',
    description: '嵌入式命令行框架，提供串口交互、日志系统与脚本执行能力',
    tags: ['C', 'FreeRTOS'],
    stars: 96,
    iconId: 'code',
    url: 'https://github.com'
  },
  {
    id: 'iothub',
    name: 'IoTHub',
    description: 'ESP32 物联网网关，集成 MQTT、BLE Mesh 与 WiFi Manager',
    tags: ['C++', 'ESP32', 'MQTT'],
    stars: 203,
    iconId: 'wifi',
    url: 'https://github.com'
  },
  {
    id: 'qthmi',
    name: 'QtHMI',
    description: '跨平台嵌入式 HMI 框架，封装工业控件与 Modbus/串口通信',
    tags: ['C++', 'Qt', 'QML'],
    stars: 167,
    iconId: 'monitor',
    url: 'https://github.com'
  },
  {
    id: 'rtoskit',
    name: 'RTOS-Kit',
    description: 'FreeRTOS 中间件集合，含任务管理、消息队列与软件定时器封装',
    tags: ['C', 'FreeRTOS'],
    stars: 85,
    iconId: 'settings',
    url: 'https://github.com'
  },
  {
    id: 'linuxdrv',
    name: 'LinuxDrv',
    description: 'IMX6ULL 驱动开发示例库，覆盖 GPIO、I2C、SPI、UART 与帧缓冲',
    tags: ['C', 'Linux', 'IMX6ULL'],
    stars: 142,
    iconId: 'terminal',
    url: 'https://github.com'
  }
];

/** 精选专栏数据 */
const FEATURED_COLUMNS = [
  {
    id: 'stm32',
    name: 'STM32 专栏',
    description: '从入门到进阶，系统掌握 STM32 开发',
    count: 45,
    iconId: 'chip',
    url: '/嵌入式/1/1/'
  },
  {
    id: 'esp32',
    name: 'ESP32 专栏',
    description: '物联网实战，WiFi 与蓝牙应用',
    count: 38,
    iconId: 'wifi',
    url: '/嵌入式/2/2/'
  },
  {
    id: 'linux',
    name: 'Linux 专栏',
    description: '驱动开发与系统移植深度解析',
    count: 52,
    iconId: 'terminal',
    url: '/嵌入式/1/1/'
  },
  {
    id: 'qt',
    name: 'Qt 专栏',
    description: '跨平台嵌入式 HMI 界面开发',
    count: 27,
    iconId: 'window',
    url: '/嵌入式/1/1/'
  }
];

// ================================================
// SVG 图标集 (编译时内联)
// ================================================

const ICONS = {
  chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18h.01"/><path d="M9.17 15.17a4 4 0 015.66 0"/><path d="M6.34 12.34a8 8 0 0111.32 0"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  window: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  /* 开源项目图标 */
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
};

// ================================================
// DOM 操作 (View Layer)
// ================================================

/** 渲染置顶文章网格 */
function renderPinnedArticles() {
  const grid = document.getElementById('pinnedGrid');
  if (!grid) return;

  grid.innerHTML = PINNED_ARTICLES.map(article => `
    <article class="card article-card animate-on-scroll" data-category="${article.category}">
      <div class="article-card-header">
        <h3>${article.title}</h3>
        <span class="article-card-category">${article.categoryLabel}</span>
      </div>
      <p>${article.description}</p>
      <div class="article-card-tags">
        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="article-card-footer">
        <a href="${article.url}" class="read-link">
          阅读全文
          <span class="arrow">→</span>
        </a>
      </div>
    </article>
  `).join('');
}

/** 渲染精选专栏 */
function renderColumns() {
  const grid = document.getElementById('columnsGrid');
  if (!grid) return;

  grid.innerHTML = FEATURED_COLUMNS.map(col => `
    <a href="${col.url}" class="card column-card animate-on-scroll" data-column="${col.id}">
      <div class="column-icon">${ICONS[col.iconId]}</div>
      <h3>${col.name}</h3>
      <p class="column-desc">${col.description}</p>
      <span class="column-count">${col.count} 篇文章</span>
    </a>
  `).join('');
}

/** 渲染开源项目 */
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = OPEN_SOURCE_PROJECTS.map(project => `
    <a href="${project.url}" target="_blank" rel="noopener" class="card project-card animate-on-scroll" data-project="${project.id}">
      <div class="project-card-header">
        <div class="project-icon">${ICONS[project.iconId]}</div>
        <h3>${project.name}</h3>
      </div>
      <p>${project.description}</p>
      <div class="project-card-footer">
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <span class="project-stars">
          ${ICONS.star}
          ${project.stars}
        </span>
      </div>
    </a>
  `).join('');
}

// ================================================
// 滚动动画控制器
// ================================================

function initScrollAnimation() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if (!elements.length) return;

  // 优先使用 IntersectionObserver (现代浏览器)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // 一次性：只触发一次
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach(el => observer.observe(el));
  } else {
    // 降级方案：直接显示
    elements.forEach(el => el.classList.add('is-visible'));
  }
}

// ================================================
// 平滑滚动
// ================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ================================================
// 初始化 (应用入口)
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  // 渲染动态内容
  renderPinnedArticles();
  renderColumns();
  renderProjects();

  // 交互功能
  initScrollAnimation();
  initSmoothScroll();
});
