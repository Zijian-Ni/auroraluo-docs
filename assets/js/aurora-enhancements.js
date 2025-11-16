/**
 * Aurora Luo 网站增强脚本
 * 包含：打字机效果、粒子背景、平滑滚动动画、视差效果等
 */

(function() {
  'use strict';

  // 等待 DOM 加载完成
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // 打字机效果
  function typewriterEffect(element, text, speed = 50) {
    if (!element) return;

    let i = 0;
    element.textContent = '';
    element.style.opacity = '1';

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // 观察元素进入视口
  function observeElements() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, options);

    // 观察所有需要动画的元素
    document.querySelectorAll('.timeline > p, .scenario-grid > p, .markdown-section > h1, .markdown-section > h2, .markdown-section > h3').forEach(el => {
      observer.observe(el);
    });
  }

  // 添加粒子背景效果
  function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';

    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 50;

    // 设置画布大小
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // 边界检查
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
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

    // 动画循环
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // 绘制连线
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 77, 255, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // 平滑滚动到锚点
  function smoothScrollToAnchor() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute('href').substring(1);
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  // 阅读进度条
  function updateReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;

      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // 回到顶部按钮
  function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    function toggleButton() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    window.addEventListener('scroll', toggleButton, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    toggleButton();
  }

  // 动态标题颜色
  function dynamicTitleColor() {
    const gradientText = document.querySelector('.gradient-text');
    if (!gradientText) return;

    let hue = 0;

    setInterval(() => {
      hue = (hue + 1) % 360;
      gradientText.style.filter = `hue-rotate(${hue}deg)`;
    }, 50);
  }

  // 卡片悬停 3D 效果
  function card3DEffect() {
    const cards = document.querySelectorAll('.scenario-grid > p');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // 时间线动画延迟
  function staggerTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline > p');

    timelineItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });
  }

  // Emoji 动画效果
  function animateEmojis() {
    const emojiElements = document.querySelectorAll('.aurora-logo');

    emojiElements.forEach(emoji => {
      emoji.addEventListener('mouseenter', () => {
        emoji.style.transform = 'scale(1.2) rotate(10deg)';
      });

      emoji.addEventListener('mouseleave', () => {
        emoji.style.transform = '';
      });
    });
  }

  // 主题切换动画
  function enhanceThemeSwitch() {
    const themeBtn = document.getElementById('theme-switch-btn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
      document.body.style.transition = 'background 0.5s ease, color 0.5s ease';

      // 添加涟漪效果
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.top = '0';
      ripple.style.left = '0';
      ripple.style.width = '100%';
      ripple.style.height = '100%';
      ripple.style.background = 'radial-gradient(circle, rgba(124, 77, 255, 0.3), transparent)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9999';
      ripple.style.opacity = '0';
      ripple.style.transition = 'opacity 0.5s ease';

      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.style.opacity = '1';
      }, 10);

      setTimeout(() => {
        ripple.style.opacity = '0';
        setTimeout(() => ripple.remove(), 500);
      }, 300);
    });
  }

  // 添加代码块复制提示
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach(block => {
      block.addEventListener('mouseenter', () => {
        block.style.borderColor = 'var(--theme-color)';
      });

      block.addEventListener('mouseleave', () => {
        block.style.borderColor = 'var(--border)';
      });
    });
  }

  // 初始化所有功能
  function init() {
    console.log('🌌 Aurora Luo 增强功能已加载');

    // 基础功能
    observeElements();
    smoothScrollToAnchor();
    updateReadingProgress();
    setupBackToTop();

    // 视觉效果
    createParticles();
    staggerTimelineAnimation();
    animateEmojis();
    enhanceThemeSwitch();
    enhanceCodeBlocks();

    // 在首页添加特殊效果
    if (window.location.hash === '' || window.location.hash === '#/') {
      setTimeout(() => {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
          const originalText = subtitle.textContent;
          typewriterEffect(subtitle, originalText, 50);
        }
      }, 1000);

      // 卡片3D效果
      setTimeout(card3DEffect, 500);
    }
  }

  // 监听 Docsify 路由变化
  if (window.$docsify) {
    window.$docsify.plugins = [].concat(window.$docsify.plugins || [], [
      function(hook) {
        hook.doneEach(function() {
          // 每次页面切换后重新初始化部分功能
          setTimeout(() => {
            observeElements();
            card3DEffect();
            staggerTimelineAnimation();
            animateEmojis();
            enhanceCodeBlocks();
          }, 100);
        });
      }
    ]);
  }

  // 页面加载完成后初始化
  onReady(init);

})();
