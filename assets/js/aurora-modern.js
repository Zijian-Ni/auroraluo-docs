/**
 * Aurora Luo - 现代化交互系统
 * Version: 3.0
 */

(function() {
  'use strict';

  // ========== 工具函数 ==========
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ========== 主题切换 ==========
  class ThemeManager {
    constructor() {
      this.toggle = $('#themeToggle');
      this.currentTheme = localStorage.getItem('theme') || 'light';
      this.init();
    }

    init() {
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      if (this.toggle) {
        this.toggle.addEventListener('click', () => this.toggleTheme());
      }
    }

    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);

      // 添加过渡动画
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    }
  }

  // ========== 导航栏 ==========
  class Navigation {
    constructor() {
      this.nav = $('.magnetic-nav');
      this.mobileToggle = $('#mobileMenuToggle');
      this.navLinks = $('.nav-links');
      this.links = $$('.nav-link');
      this.init();
    }

    init() {
      this.setupScrollEffect();
      this.setupMobileMenu();
      this.setupActiveLink();
    }

    setupScrollEffect() {
      let lastScroll = 0;

      window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
          this.nav.classList.add('scrolled');
        } else {
          this.nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
      }, 10));
    }

    setupMobileMenu() {
      if (this.mobileToggle) {
        this.mobileToggle.addEventListener('click', () => {
          this.navLinks.classList.toggle('active');
          this.mobileToggle.classList.toggle('active');

          // 动画汉堡图标
          const spans = this.mobileToggle.querySelectorAll('span');
          spans.forEach((span, i) => {
            if (this.navLinks.classList.contains('active')) {
              if (i === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
              if (i === 1) span.style.opacity = '0';
              if (i === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
              span.style.transform = '';
              span.style.opacity = '';
            }
          });
        });

        // 点击链接时关闭菜单
        this.links.forEach(link => {
          link.addEventListener('click', () => {
            this.navLinks.classList.remove('active');
            this.mobileToggle.classList.remove('active');
          });
        });
      }
    }

    setupActiveLink() {
      const sections = $$('section[id]');

      window.addEventListener('scroll', debounce(() => {
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          const id = section.getAttribute('id');

          if (scrollPos >= top && scrollPos < top + height) {
            this.links.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      }, 100));
    }
  }

  // ========== 滚动动画 AOS ==========
  class ScrollAnimations {
    constructor() {
      this.elements = $$('[data-aos]');
      this.init();
    }

    init() {
      this.observeElements();
      window.addEventListener('load', () => this.observeElements());
    }

    observeElements() {
      const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            // 可选：一次性动画后停止观察
            // observer.unobserve(entry.target);
          }
        });
      }, options);

      this.elements.forEach(el => observer.observe(el));
    }
  }

  // ========== 滚动进度条 ==========
  class ScrollProgress {
    constructor() {
      this.progressBar = $('#scrollProgress');
      this.init();
    }

    init() {
      if (!this.progressBar) return;

      window.addEventListener('scroll', debounce(() => {
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / docHeight) * 100;

        this.progressBar.style.transform = `scaleX(${progress / 100})`;
      }, 10));
    }
  }

  // ========== 回到顶部 ==========
  class BackToTop {
    constructor() {
      this.button = $('#backToTop');
      this.init();
    }

    init() {
      if (!this.button) return;

      window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 300) {
          this.button.classList.add('show');
        } else {
          this.button.classList.remove('show');
        }
      }, 100));

      this.button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ========== 平滑滚动 ==========
  class SmoothScroll {
    constructor() {
      this.links = $$('a[href^="#"]');
      this.init();
    }

    init() {
      this.links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');

          if (href === '#' || href === '#/') return;

          e.preventDefault();
          const target = $(href);

          if (target) {
            const offsetTop = target.offsetTop - 80; // 导航栏高度

            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  }

  // ========== 性能监控 ==========
  class PerformanceMonitor {
    constructor() {
      this.init();
    }

    init() {
      // 检测设备性能
      const deviceMemory = navigator.deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;

      // 低性能设备优化
      if (deviceMemory < 4 || hardwareConcurrency < 4) {
        document.body.classList.add('low-performance');
        console.log('🔧 低性能模式已启用');
      }

      // Page Load Performance
      window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

        console.log('📊 页面加载时间:', `${pageLoadTime}ms`);

        if (pageLoadTime > 3000) {
          console.warn('⚠️ 页面加载较慢，建议优化资源');
        }
      });
    }
  }

  // ========== 视差效果 ==========
  class ParallaxEffect {
    constructor() {
      this.parallaxElements = $$('.floating-card, .aurora-sphere');
      this.init();
    }

    init() {
      if (window.innerWidth < 1024) return; // 移动设备禁用

      window.addEventListener('mousemove', debounce((e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        this.parallaxElements.forEach((el, index) => {
          const speed = (index + 1) * 10;
          const x = (mouseX - 0.5) * speed;
          const y = (mouseY - 0.5) * speed;

          el.style.transform = `translate(${x}px, ${y}px)`;
        });
      }, 16)); // ~60fps
    }
  }

  // ========== 键盘快捷键 ==========
  class KeyboardShortcuts {
    constructor() {
      this.init();
    }

    init() {
      document.addEventListener('keydown', (e) => {
        // Esc - 回到顶部
        if (e.key === 'Escape') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Cmd/Ctrl + K - 打开搜索（如果有）
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          const searchBtn = $('.search-toggle');
          if (searchBtn) searchBtn.click();
        }

        // T - 切换主题
        if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
          const themeBtn = $('#themeToggle');
          if (themeBtn && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            themeBtn.click();
          }
        }
      });
    }
  }

  // ========== 初始化 ==========
  function init() {
    console.log(`
╔═══════════════════════════════════════╗
║   🌌 Aurora Luo v3.0 已加载          ║
║   现代化设计 + 流体动画              ║
╚═══════════════════════════════════════╝
    `);

    // 核心功能
    new ThemeManager();
    new Navigation();
    new ScrollAnimations();
    new ScrollProgress();
    new BackToTop();
    new SmoothScroll();
    new PerformanceMonitor();
    new ParallaxEffect();
    new KeyboardShortcuts();

    // 页面加载完成
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      console.log('✅ 所有功能已初始化');
    });
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
