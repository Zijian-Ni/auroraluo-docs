/**
 * Aurora Luo 网站增强脚本 - 优化版
 * 版本: 2.0
 * 特性: 性能优化、响应式适配、用户偏好设置、降级策略
 */

(function() {
  'use strict';

  // ========== 配置与状态管理 ==========
  const config = {
    particles: {
      count: {
        desktop: 40,
        tablet: 25,
        mobile: 15
      },
      connectionDistance: 120,
      speed: 0.3
    },
    animations: {
      typewriterSpeed: 60,
      scrollThrottle: 100,
      particleFps: 30
    },
    performance: {
      enableParticles: true,
      enable3DEffects: true,
      enableHeavyAnimations: true
    }
  };

  // 检测设备类型
  const deviceType = (() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  })();

  // 性能检测
  const isLowPerformance = (() => {
    // 检测设备内存（如果可用）
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
    // 检测硬件并发数
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
    // 移动设备默认使用低性能模式
    if (deviceType === 'mobile') return true;
    return false;
  })();

  // 根据性能调整配置
  if (isLowPerformance) {
    config.performance.enableParticles = false;
    config.performance.enable3DEffects = false;
    config.particles.count.desktop = 20;
    config.particles.count.tablet = 15;
  }

  // ========== 工具函数 ==========

  // 节流函数
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  }

  // 防抖函数
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // 检查元素是否在视口中
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // 获取主题色
  function getThemeColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-color').trim() || '#7c4dff';
  }

  // ========== 核心功能 ==========

  // 1. 优化的打字机效果
  function typewriterEffect(element, text, speed = config.animations.typewriterSpeed) {
    if (!element || !text) return;

    let i = 0;
    const originalText = text;
    element.textContent = '';
    element.style.opacity = '1';

    // 使用 requestAnimationFrame 而不是 setTimeout
    let lastTime = 0;

    function type(currentTime) {
      if (!lastTime) lastTime = currentTime;
      const elapsed = currentTime - lastTime;

      if (elapsed >= speed && i < originalText.length) {
        element.textContent += originalText.charAt(i);
        i++;
        lastTime = currentTime;
      }

      if (i < originalText.length) {
        requestAnimationFrame(type);
      }
    }

    requestAnimationFrame(type);
  }

  // 2. 优化的粒子背景系统
  function createParticlesSystem() {
    if (!config.performance.enableParticles) {
      console.log('🌌 粒子效果已禁用（性能优化）');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.4;
    `;

    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d', { alpha: true });
    let particles = [];
    let animationId;
    let lastFrameTime = 0;
    const fps = config.animations.particleFps;
    const frameInterval = 1000 / fps;

    const particleCount = config.particles.count[deviceType];

    // 设置画布大小
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 重新初始化粒子位置
      particles.forEach(p => {
        if (p.x > canvas.width) p.x = canvas.width;
        if (p.y > canvas.height) p.y = canvas.height;
      });
    }

    // 粒子类
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * config.particles.speed;
        this.vy = (Math.random() - 0.5) * config.particles.speed;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // 边界反弹
        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

        // 保持在边界内
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 77, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 动画循环（带 FPS 限制）
    function animate(currentTime) {
      animationId = requestAnimationFrame(animate);

      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;

      lastFrameTime = currentTime - (elapsed % frameInterval);

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // 绘制连线（优化：只绘制距离较近的）
      const maxDistance = config.particles.connectionDistance;
      particles.forEach((p1, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 0.15 * (1 - distance / maxDistance);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 77, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    }

    // 初始化
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 300));
    animate(0);

    // 页面不可见时暂停动画
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate(0);
      }
    });

    console.log(`🌌 粒子系统已启动 (${particleCount} 粒子)`);
  }

  // 3. 视口观察器（滚动动画）
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      console.log('⚠️ 浏览器不支持 IntersectionObserver');
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          // 一次性动画，观察后即可取消
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 观察元素
    const selectors = [
      '.timeline > p',
      '.scenario-grid > p',
      '.feature-card',
      '.metric-card',
      '.persona-card'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('aos-element');
        observer.observe(el);
      });
    });
  }

  // 4. 阅读进度条
  function setupReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    const updateProgress = throttle(() => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min((scrolled / documentHeight) * 100, 100);

      progressBar.style.width = `${progress}%`;
    }, config.animations.scrollThrottle);

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // 5. 回到顶部按钮
  function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const toggleButton = throttle(() => {
      btn.classList.toggle('show', window.scrollY > 300);
    }, 100);

    window.addEventListener('scroll', toggleButton, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggleButton();
  }

  // 6. 卡片 3D 倾斜效果
  function setup3DCards() {
    if (!config.performance.enable3DEffects || deviceType === 'mobile') {
      console.log('🎴 3D 卡片效果已禁用');
      return;
    }

    const cards = document.querySelectorAll('.scenario-grid > p, .persona-card, .metric-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 5; // 限制角度
        const rotateY = ((centerX - x) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // 7. 平滑锚点滚动
  function setupSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#' || href === '#/') return;

      e.preventDefault();
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        const offsetTop = target.offsetTop - 80; // 留出顶部空间
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }

  // 8. 主题切换增强
  function enhanceThemeSwitch() {
    const themeBtn = document.getElementById('theme-switch-btn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
      // 添加过渡动画
      document.documentElement.classList.add('theme-transitioning');

      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    });
  }

  // 9. 代码块增强
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach(block => {
      // 添加复制提示
      block.title = '点击复制代码';

      // 悬停效果
      block.addEventListener('mouseenter', () => {
        block.style.borderColor = 'var(--theme-color)';
      });

      block.addEventListener('mouseleave', () => {
        block.style.borderColor = 'var(--border)';
      });
    });
  }

  // 10. Logo 动画
  function setupLogoAnimation() {
    const logos = document.querySelectorAll('.aurora-logo, .aurora-animation');

    logos.forEach(logo => {
      logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'scale(1.15) rotate(5deg)';
        logo.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      });

      logo.addEventListener('mouseleave', () => {
        logo.style.transform = '';
      });

      // 点击彩蛋
      let clickCount = 0;
      logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
          console.log('🌌 你发现了一个彩蛋！小落向你挥手～');
          logo.style.animation = 'spin 0.5s ease-in-out';
          clickCount = 0;
          setTimeout(() => {
            logo.style.animation = '';
          }, 500);
        }
      });
    });
  }

  // 11. 时间线动画交错
  function setupTimelineStagger() {
    const items = document.querySelectorAll('.timeline > p');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.15}s`;
    });
  }

  // 12. 图片懒加载优化
  function setupImageLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
      // 浏览器原生支持
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
      });
    } else {
      // 使用 IntersectionObserver 回退
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // 13. 键盘快捷键
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ESC 键回到顶部
      if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Ctrl/Cmd + K 打开搜索（如果存在）
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBtn = document.getElementById('cmdk-open-btn');
        if (searchBtn) searchBtn.click();
      }
    });
  }

  // ========== 初始化 ==========
  function init() {
    console.log(`
╔═══════════════════════════════════════╗
║   🌌 Aurora Luo 增强功能 v2.0        ║
║   设备: ${deviceType.toUpperCase().padEnd(8)} 性能: ${isLowPerformance ? '优化' : '标准'}      ║
╚═══════════════════════════════════════╝
    `);

    // 核心功能（始终启用）
    setupReadingProgress();
    setupBackToTop();
    setupSmoothScroll();
    initScrollAnimations();
    enhanceThemeSwitch();
    enhanceCodeBlocks();
    setupLogoAnimation();
    setupTimelineStagger();
    setupImageLazyLoad();
    setupKeyboardShortcuts();

    // 性能敏感功能（条件启用）
    if (config.performance.enableParticles) {
      createParticlesSystem();
    }

    if (config.performance.enable3DEffects) {
      setTimeout(setup3DCards, 500);
    }

    // 首页特殊效果
    const isHomePage = !window.location.hash || window.location.hash === '#/';
    if (isHomePage) {
      setTimeout(() => {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle && subtitle.textContent) {
          const text = subtitle.textContent;
          typewriterEffect(subtitle, text);
        }
      }, 1200);
    }
  }

  // ========== Docsify 集成 ==========
  if (window.$docsify) {
    window.$docsify.plugins = [].concat(window.$docsify.plugins || [], [
      function(hook) {
        hook.doneEach(function() {
          // 路由切换后重新初始化部分功能
          setTimeout(() => {
            initScrollAnimations();
            enhanceCodeBlocks();
            setupLogoAnimation();
            setupTimelineStagger();
            setup3DCards();
          }, 150);
        });
      }
    ]);
  }

  // ========== 启动 ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 添加 spin 动画（logo 彩蛋）
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.2); }
      100% { transform: rotate(360deg) scale(1); }
    }

    .aos-element {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .aos-element.aos-animate {
      opacity: 1;
      transform: translateY(0);
    }

    .theme-transitioning * {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);

})();
