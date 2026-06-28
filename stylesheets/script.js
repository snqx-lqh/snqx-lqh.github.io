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
    category: '软件使用',
    categoryLabel: 'VScode',
    title: 'VScode配置Java环境',
    description: '使用VS配置Java环境，配置JDK等内容',
    tags: ['VScode', 'Java'],
    url: 'software/vscode/vscode-java'
  },
  {
    id: 2,
    category: '软件使用',
    categoryLabel: 'VScode',
    title: 'VSCode配置C和C++环境',
    description: 'VSCode配置C和C++环境，配置编译器、调试器等内容',
    tags: ['VScode', 'C', 'C++'],
    url: 'software/vscode/vscode-c-cpp'
  },
  {
    id: 3,
    category: 'MCU',
    categoryLabel: 'ESP01S',
    title: 'STM32 使用 AT 指令驱动 ESP01S 进行 MQTT 通信',
    description: 'STM32 使用 AT 指令驱动 ESP01S 进行 MQTT 通信，适用于物联网应用',
    tags: ['STM32', 'ESP01S', 'MQTT'],
    url: 'mcu/esp01S/04_stm32_at_mqtt'
  }
];

/** 开源项目数据 */
const OPEN_SOURCE_PROJECTS = [
  {
    id: 'mcuboot',
    name: 'Stm32BalanceCar',
    description: '基于STM32C8T6的平衡车代码设计，使用CubeMX和FreeRTOS的一个项目',
    tags: ['C', 'STM32', 'ESP01S'],
    stars: 38,
    iconId: 'monitor',
    url: 'https://github.com/snqx-lqh/Stm32BalanceCar'
  },
  {
    id: 'embedcli',
    name: 'ProteusAnd89C51',
    description: '使用Proteus8.9仿真51单片机的一些实例，包含数码管、LCD1602、步进电机、矩阵键盘、DS1302、超声波测距、DS18B20、蜂鸣器、EEPROM等',
    tags: ['51', 'Proteus'],
    stars: 11,
    iconId: 'code',
    url: 'https://github.com/snqx-lqh/ProteusAnd89C51'
  },
  {
    id: 'iothub',
    name: 'RaspberryPiSmartHome',
    description: '树莓派智能家居项目，学习树莓派的wiringpi用C语言开发，并且组合成一个智能家居项目，使用的是树莓派3B+',
    tags: ['C++', 'RaspberryPi', 'MQTT'],
    stars: 10,
    iconId: 'wifi',
    url: 'https://github.com/snqx-lqh/RaspberryPiSmartHome'
  },
  {
    id: 'qthmi',
    name: 'Stm32RemoteControl',
    description: '基于STM32F103cbt6的遥控器，使用FreeRTOS实时操作系统，通信使用NRF24L01',
    tags: ['C', 'FreeRTOS', 'NRF24L01'],
    stars: 6,
    iconId: 'monitor',
    url: 'https://github.com/snqx-lqh/Stm32RemoteControl'
  }
];

/** 精选专栏数据 */
const FEATURED_COLUMNS = [
  {
    id: 'stm32',
    name: 'STM32 专栏',
    description: '从入门到进阶，系统掌握 STM32 开发',
    count: 6,
    iconId: 'chip',
    url: 'mcu/stm32'
  },
  {
    id: 'esp32',
    name: 'ESP01S 专栏',
    description: '物联网实战，WiFi 与蓝牙应用',
    count: 5,
    iconId: 'wifi',
    url: 'mcu/esp01S'
  },
  {
    id: 'cpp',
    name: 'VSCode 专栏',
    description: 'VSCode 配置与使用技巧',
    count: 2,
    iconId: 'terminal',
    url: 'software/vscode'
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
