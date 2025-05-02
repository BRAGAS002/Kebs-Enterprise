// Add debounce function at the top
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

// Hero section animations with advanced timeline
export function animateHero() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  window.anime.timeline({
    easing: 'easeOutCubic',
  })
  .add({
    targets: '.hero-content h2',
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800
  })
  .add({
    targets: '.hero-content h3',
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800
  }, '-=400')
  .add({
    targets: '.hero-content p',
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800
  }, '-=400')
  .add({
    targets: '.hero-buttons',
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800
  }, '-=400');
}

// Service cards animation
export function animateServiceCards() {
  const cards = document.querySelectorAll('.service-card, .service-preview-card');
  if (!cards.length) return;

  window.anime({
    targets: cards,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    delay: window.anime.stagger(100),
    easing: 'easeOutCubic',
    complete: function(anim) {
      // Add hover animation
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          window.anime({
            targets: card,
            scale: 1.02,
            duration: 300,
            easing: 'easeOutCubic'
          });
        });
        card.addEventListener('mouseleave', () => {
          window.anime({
            targets: card,
            scale: 1,
            duration: 300,
            easing: 'easeOutCubic'
          });
        });
      });
    }
  });
}

// Gallery items animation
export function animateGalleryItems() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  window.anime({
    targets: items,
    opacity: [0, 1],
    scale: [0.98, 1],
    duration: 800,
    delay: window.anime.stagger(100),
    easing: 'easeOutCubic',
    complete: function(anim) {
      // Add hover animation
      items.forEach(item => {
        item.addEventListener('mouseenter', () => {
          window.anime({
            targets: item,
            scale: 1.02,
            duration: 300,
            easing: 'easeOutCubic'
          });
        });
        item.addEventListener('mouseleave', () => {
          window.anime({
            targets: item,
            scale: 1,
            duration: 300,
            easing: 'easeOutCubic'
          });
        });
      });
    }
  });
}

// Team members animation
export function animateTeamMembers() {
  const members = document.querySelectorAll('.team-member');
  if (!members.length) return;

  window.anime({
    targets: members,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    delay: window.anime.stagger(100),
    easing: 'easeOutCubic',
    complete: function(anim) {
      // Add hover animation
      members.forEach(member => {
        member.addEventListener('mouseenter', () => {
          window.anime({
            targets: member,
            translateY: -3,
            duration: 300,
            easing: 'easeOutCubic'
          });
        });
        member.addEventListener('mouseleave', () => {
          window.anime({
            targets: member,
            translateY: 0,
            duration: 300,
            easing: 'easeOutCubic'
          });
        });
      });
    }
  });
}

// Contact form animation
export function animateContactForm() {
  const formElements = document.querySelectorAll('.contact-form .form-group');
  if (!formElements.length) return;

  window.anime({
    targets: formElements,
    opacity: [0, 1],
    translateX: [-20, 0],
    duration: 800,
    delay: window.anime.stagger(100),
    easing: 'easeOutCubic'
  });
}

// Header animation
export function animateHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  const handleScroll = debounce(() => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      if (currentScroll > lastScroll) {
        // Scrolling down
        window.anime({
          targets: header,
          translateY: -100,
          duration: 300,
          easing: 'easeOutCubic'
        });
      } else {
        // Scrolling up
        window.anime({
          targets: header,
          translateY: 0,
          duration: 300,
          easing: 'easeOutCubic'
        });
      }
    } else {
      window.anime({
        targets: header,
        translateY: 0,
        duration: 300,
        easing: 'easeOutCubic'
      });
    }
    lastScroll = currentScroll;
  }, 100); // Increased debounce time

  window.addEventListener('scroll', handleScroll);
}

// Footer animation
export function animateFooter() {
  const footerElements = document.querySelectorAll('.footer-content > div');
  if (!footerElements.length) return;

  window.anime({
    targets: footerElements,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    delay: window.anime.stagger(100),
    easing: 'easeOutCubic'
  });
}

// Success message animation
export function animateSuccessMessage(element) {
  if (!element) return;

  window.anime({
    targets: element,
    opacity: [0, 1],
    scale: [0.98, 1],
    duration: 400,
    easing: 'easeOutCubic',
    complete: function(anim) {
      setTimeout(() => {
        window.anime({
          targets: element,
          opacity: 0,
          scale: 0.98,
          duration: 400,
          easing: 'easeInCubic',
          complete: () => element.remove()
        });
      }, 5000);
    }
  });
}

// Initialize all animations
export function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        if (target.classList.contains('hero-content')) {
          animateHero();
          observer.unobserve(target); // Only animate once
        } else if (target.classList.contains('service-card') || target.classList.contains('service-preview-card')) {
          animateServiceCards();
          observer.unobserve(target);
        } else if (target.classList.contains('gallery-item')) {
          animateGalleryItems();
          observer.unobserve(target);
        } else if (target.classList.contains('team-member')) {
          animateTeamMembers();
          observer.unobserve(target);
        } else if (target.classList.contains('contact-form')) {
          animateContactForm();
          observer.unobserve(target);
        } else if (target.classList.contains('footer-content')) {
          animateFooter();
          observer.unobserve(target);
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '50px'
  });

  // Observe elements
  document.querySelectorAll('.hero-content, .service-card, .service-preview-card, .gallery-item, .team-member, .contact-form, .footer-content').forEach(el => {
    observer.observe(el);
  });

  // Initialize header animation
  animateHeader();
} 