/**
 * Aurora Luo - 小雨风格交互系统
 * Version: 4.0
 * Design: Futuristic + Narrative-Driven
 */

// ========== 工具函数 ==========
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ========== 导航栏管理 ==========
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.init();
  }

  init() {
    this.handleScroll();
    this.handleActiveLink();
    this.setupSmoothScroll();
    window.addEventListener('scroll', throttle(() => {
      this.handleScroll();
      this.handleActiveLink();
    }, 100));
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  handleActiveLink() {
    let current = '';
    const scrollY = window.pageYOffset;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
}

// ========== 滚动进度条 ==========
class ScrollProgress {
  constructor() {
    this.progressBar = document.getElementById('scrollProgress');
    this.init();
  }

  init() {
    window.addEventListener('scroll', throttle(() => {
      this.updateProgress();
    }, 50));
  }

  updateProgress() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    this.progressBar.style.transform = `scaleX(${scrolled / 100})`;
  }
}

// ========== 返回顶部按钮 ==========
class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.init();
  }

  init() {
    window.addEventListener('scroll', throttle(() => {
      this.toggle();
    }, 100));

    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  toggle() {
    if (window.scrollY > 500) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }
}

// ========== AOS 滚动动画 ==========
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-aos]');
    this.init();
  }

  init() {
    this.observeElements();
  }

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
  }
}

// ========== 实时仪表板动画 ==========
class DashboardAnimations {
  constructor() {
    this.metrics = document.querySelectorAll('.metric-value');
    this.bars = document.querySelectorAll('.metric-fill');
    this.init();
  }

  init() {
    this.observeDashboard();
  }

  observeDashboard() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          this.animateMetrics();
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.3
    });

    const dashboard = document.querySelector('.dashboard-container');
    if (dashboard) {
      observer.observe(dashboard);
    }
  }

  animateMetrics() {
    // 动画化数值
    this.metrics.forEach((metric, index) => {
      const text = metric.textContent;
      const hasPercent = text.includes('%');
      const hasMs = text.includes('ms');
      const hasM = text.includes('M');

      // 跳过非数字值
      if (text === 'MAX' || text === '∞' || text.includes('24/7') || text.includes('<')) {
        return;
      }

      const targetValue = parseFloat(text);
      if (isNaN(targetValue)) return;

      let currentValue = 0;
      const duration = 2000;
      const steps = 60;
      const increment = targetValue / steps;
      const stepDuration = duration / steps;

      const counter = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(counter);
        }

        let displayValue = currentValue.toFixed(hasPercent || hasM ? 1 : 0);
        if (hasPercent) {
          displayValue += '<span style="font-size: 1.5rem;">%</span>';
        } else if (hasMs) {
          displayValue += '<span style="font-size: 1.5rem;">ms</span>';
        } else if (hasM) {
          displayValue += '<span style="font-size: 1.5rem;">M</span>';
        } else if (targetValue === 4.9) {
          displayValue += '<span style="font-size: 1.5rem;">/5</span>';
        }
        metric.innerHTML = displayValue;
      }, stepDuration);
    });

    // 动画化进度条
    this.bars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      }, index * 100);
    });
  }
}

// ========== 伙伴关系动画 ==========
class PartnershipAnimations {
  constructor() {
    this.avatars = document.querySelectorAll('.ai-avatar');
    this.init();
  }

  init() {
    this.avatars.forEach((avatar, index) => {
      avatar.addEventListener('mouseenter', () => {
        this.highlightAvatar(avatar);
      });

      avatar.addEventListener('mouseleave', () => {
        this.resetAvatar(avatar);
      });
    });
  }

  highlightAvatar(avatar) {
    const circle = avatar.querySelector('.avatar-circle');
    circle.style.transform = 'scale(1.1) rotate(5deg)';
  }

  resetAvatar(avatar) {
    const circle = avatar.querySelector('.avatar-circle');
    circle.style.transform = 'scale(1) rotate(0deg)';
  }
}

// ========== 性能监控 ==========
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.detectPerformance();
  }

  detectPerformance() {
    const isLowPerformance = (() => {
      // 检测设备内存
      if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;

      // 检测 CPU 核心数
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;

      // 检测移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) return true;

      return false;
    })();

    if (isLowPerformance) {
      this.enableLowPerformanceMode();
    }
  }

  enableLowPerformanceMode() {
    document.body.classList.add('low-performance');

    // 减少动画
    const style = document.createElement('style');
    style.textContent = `
      .cyber-glow {
        opacity: 0.05 !important;
        filter: blur(50px) !important;
      }
      .gradient-blob {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// ========== 键盘快捷键 ==========
class KeyboardShortcuts {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      // Esc - 返回顶部
      if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Ctrl/Cmd + K - 跳转到小雨
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.open('https://zijian-ni.github.io/aurorayu-docs/', '_blank');
      }
    });
  }
}

// ========== 彩蛋：Konami Code ==========
class EasterEgg {
  constructor() {
    this.sequence = [];
    this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      this.sequence.push(e.key);
      this.sequence = this.sequence.slice(-this.konamiCode.length);

      if (this.sequence.join(',') === this.konamiCode.join(',')) {
        this.activateEasterEgg();
      }
    });
  }

  activateEasterEgg() {
    // 创建特效
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      .easter-egg-active {
        animation: rainbow 3s linear infinite !important;
      }
    `;
    document.head.appendChild(style);

    // 应用彩虹效果
    document.querySelectorAll('.hero-title, .section-title').forEach(el => {
      el.classList.add('easter-egg-active');
    });

    // 显示消息
    const message = document.createElement('div');
    message.textContent = '🌈 你发现了小落的秘密！';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2rem 3rem;
      background: var(--gradient-aurora);
      color: white;
      font-size: 2rem;
      font-weight: 800;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 212, 255, 0.5);
      z-index: 99999;
      animation: slideIn 0.5s ease;
    `;
    document.body.appendChild(message);

    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transition = 'opacity 0.5s ease';
      setTimeout(() => message.remove(), 500);
    }, 3000);
  }
}

// ========== 移动端菜单 ==========
class MobileMenu {
  constructor() {
    this.navLinks = document.getElementById('navLinks');
    this.init();
  }

  init() {
    // 创建汉堡菜单按钮
    const button = document.createElement('button');
    button.className = 'mobile-menu-toggle';
    button.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    button.setAttribute('aria-label', '菜单');

    const navActions = document.querySelector('.nav-actions');
    navActions.insertBefore(button, navActions.firstChild);

    // 切换菜单
    button.addEventListener('click', () => {
      this.navLinks.classList.toggle('active');
      button.classList.toggle('active');
    });

    // 点击链接关闭菜单
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.navLinks.classList.remove('active');
        button.classList.remove('active');
      });
    });
  }
}

// ========== 初始化所有模块 ==========
class AuroraApp {
  constructor() {
    this.modules = [];
    this.init();
  }

  init() {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeModules());
    } else {
      this.initializeModules();
    }
  }

  initializeModules() {
    console.log('🌌 Aurora Luo 系统启动...');

    try {
      this.modules.push(new NavigationManager());
      this.modules.push(new ScrollProgress());
      this.modules.push(new BackToTop());
      this.modules.push(new ScrollAnimations());
      this.modules.push(new DashboardAnimations());
      this.modules.push(new PartnershipAnimations());
      this.modules.push(new PerformanceMonitor());
      this.modules.push(new KeyboardShortcuts());
      this.modules.push(new EasterEgg());
      this.modules.push(new MobileMenu());

      console.log('✨ 所有系统已就绪！');

      // 性能统计
      if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`⚡ 页面加载时间: ${loadTime}ms`);
      }
    } catch (error) {
      console.error('❌ 模块初始化错误:', error);
    }
  }
}

// 启动应用
const app = new AuroraApp();

// 暴露到全局（用于调试）
window.AuroraApp = app;
