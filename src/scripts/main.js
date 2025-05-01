// Wait for DOM to load before executing scripts
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeader();
  
  // Initialize components based on current page
  if (document.querySelector('.testimonial-card')) {
    initTestimonialSlider();
  }
  
  // Initialize gallery filters if on gallery page
  if (document.querySelector('.gallery-filters')) {
    initGalleryFilters();
  }
  
  initScrollTop();
  
  if (document.querySelector('#contactForm')) {
    initContactForm();
  }
  
  initMobileMenu();
  
  initFileUpload();
});

// Header scroll behavior
function initHeader() {
  const header = document.getElementById('header');
  const scrollThreshold = 100;

  window.addEventListener('scroll', function() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Active navigation link highlighting based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && linkHref === 'index.html') {
      link.classList.add('active');
    }
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Transform hamburger to X
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
      
      if (navLinks.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'true');
      } else {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // Close menu when clicking on a link
  const links = navLinks ? navLinks.querySelectorAll('a') : [];
  
  links.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => span.classList.remove('active'));
      
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Testimonial slider functionality
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;
  
  // Set initial active testimonial
  setActiveTestimonial(currentIndex);
  
  // Set up click event on dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setActiveTestimonial(index);
    });
  });
  
  // Set up prev/next buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      setActiveTestimonial(prevIndex);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      setActiveTestimonial(nextIndex);
    });
  }
  
  // Auto slide function
  function autoSlide() {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    setActiveTestimonial(nextIndex);
  }
  
  // Set active testimonial
  function setActiveTestimonial(index) {
    // Remove all active classes
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.remove('active', 'previous', 'next');
      
      if (i < index) {
        testimonial.classList.add('previous');
      } else if (i > index) {
        testimonial.classList.add('next');
      }
    });
    
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Add active class to current testimonial and dot
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Update current index
    currentIndex = index;
  }
  
  // Set auto slide interval
  const slideInterval = setInterval(autoSlide, 5000);
  
  // Pause auto slide on hover
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', () => {
      setInterval(autoSlide, 5000);
    });
  }
}

// Gallery filter functionality
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterBtns.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Show/hide gallery items based on filter with animation
      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Scroll to top button functionality
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  const scrollThreshold = 300;
  
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > scrollThreshold) {
        scrollTopBtn.classList.add('active');
      } else {
        scrollTopBtn.classList.remove('active');
      }
    });
    
    scrollTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Contact form functionality
async function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    // Load saved form data if it exists
    const { loadFormData, saveFormData, submitFormToSupabase, uploadFile } = await import('../../config/supabase.js');
    const savedData = loadFormData();
    
    if (savedData) {
      Object.keys(savedData).forEach(key => {
        const input = contactForm.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = savedData[key];
        }
      });
    }
    
    // Save form data on input change
    contactForm.addEventListener('input', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        const formData = new FormData(this);
        saveFormData(formData);
      }
    });

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      try {
        const formData = new FormData(this);
        
        // Handle file uploads first
        const fileInput = document.getElementById('attachments');
        const files = fileInput.files;
        const fileUrls = [];
        
        for (const file of files) {
          const result = await uploadFile(file);
          if (result.success) {
            fileUrls.push(result);
          } else {
            throw new Error(`Failed to upload file: ${file.name}`);
          }
        }
        
        // Add file URLs to form data
        formData.append('attachments', JSON.stringify(fileUrls));
        
        // Submit form data to Supabase
        const result = await submitFormToSupabase(formData);
        
        if (result.success) {
          showSuccessMessage(formData.get('name'));
          contactForm.reset();
          document.getElementById('fileList').innerHTML = '';
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        alert(error.message || 'Sorry, there was an error sending your message. Please try again later.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    });
  }
}

function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let isValid = true;
  let errorMessage = '';
  
  if (!name) {
    isValid = false;
    errorMessage += 'Name is required.\n';
    highlightField('name');
  }
  
  if (!email) {
    isValid = false;
    errorMessage += 'Email is required.\n';
    highlightField('email');
  } else if (!isValidEmail(email)) {
    isValid = false;
    errorMessage += 'Please enter a valid email address.\n';
    highlightField('email');
  }
  
  if (!message) {
    isValid = false;
    errorMessage += 'Message is required.\n';
    highlightField('message');
  }
  
  if (!isValid) {
    alert('Please correct the following errors:\n' + errorMessage);
  }
  
  return isValid;
}

// Helper functions for form validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function highlightField(fieldId) {
  const field = document.getElementById(fieldId);
  field.style.borderColor = '#f44336';
  field.addEventListener('input', function() {
    field.style.borderColor = '';
  }, { once: true });
}

function showSuccessMessage(name) {
  // Create success message element
  const successMessage = document.createElement('div');
  successMessage.className = 'success-message';
  successMessage.innerHTML = `
    <p>Thank you, ${name}! Your message has been sent.</p>
    <p>We'll get back to you as soon as possible.</p>
  `;
  
  // Style the success message
  successMessage.style.backgroundColor = '#d4edda';
  successMessage.style.color = '#155724';
  successMessage.style.padding = '15px';
  successMessage.style.marginTop = '20px';
  successMessage.style.borderRadius = '8px';
  successMessage.style.textAlign = 'center';
  
  // Find the form and add the message after it
  const contactForm = document.getElementById('contactForm');
  contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
  
  // Scroll to the success message
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Remove the success message after 5 seconds
  setTimeout(() => {
    successMessage.style.opacity = '0';
    successMessage.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      successMessage.remove();
    }, 500);
  }, 5000);
}

// Theme switching functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved theme from localStorage or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
} else if (prefersDarkScheme.matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

function initFileUpload() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('attachments');
  const fileList = document.getElementById('fileList');
  
  if (!uploadArea || !fileInput || !fileList) return;

  // Handle drag and drop events
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    uploadArea.classList.add('dragover');
  }

  function unhighlight() {
    uploadArea.classList.remove('dragover');
  }

  // Handle dropped files
  uploadArea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  // Handle file input change
  fileInput.addEventListener('change', function() {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    const validFiles = validateFiles(Array.from(files));
    if (validFiles.length > 0) {
      updateFileList(validFiles);
    }
  }

  function validateFiles(files) {
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    return files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`File type not allowed: ${file.name}`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });
  }

  function updateFileList(files) {
    fileList.innerHTML = '';
    files.forEach(file => {
      const fileItem = createFileItem(file);
      fileList.appendChild(fileItem);
    });
  }

  function createFileItem(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const icon = getFileIcon(file.type);
    const size = formatFileSize(file.size);
    
    fileItem.innerHTML = `
      <span class="file-item-icon">${icon}</span>
      <span class="file-item-name">${file.name}</span>
      <span class="file-item-size">${size}</span>
      <button type="button" class="file-item-remove">×</button>
    `;
    
    fileItem.querySelector('.file-item-remove').addEventListener('click', () => {
      fileItem.remove();
      updateFileInput();
    });
    
    return fileItem;
  }

  function getFileIcon(type) {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    return '📎';
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function updateFileInput() {
    // This function would be called if we need to sync the file list with the input
    // For now, we'll let the FormData handle the files directly
  }
}
