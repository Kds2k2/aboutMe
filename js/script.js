const header = document.getElementById("myHeader");
const aboutSection = document.getElementById("about");
let navRevealPoint = 0;

function calculateNavRevealPoint() {
  if (!header || !aboutSection) {
    navRevealPoint = 0;
    return;
  }

  const headerRect = header.getBoundingClientRect();
  const headerHeight = headerRect.height || header.offsetHeight || 0;
  const aboutOffset = aboutSection.getBoundingClientRect().top + window.pageYOffset;
  // Small buffer prevents flicker when the section edge meets the viewport
  navRevealPoint = Math.max(aboutOffset - headerHeight - 16, 0);
}

function toggleHeader() {
  if (!header) {
    return;
  }

  if (window.pageYOffset >= navRevealPoint) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

function updateHeaderState() {
  calculateNavRevealPoint();
  toggleHeader();
}

calculateNavRevealPoint();
toggleHeader();

window.addEventListener('load', updateHeaderState);
window.addEventListener('resize', updateHeaderState);
window.addEventListener('scroll', toggleHeader, { passive: true });
// Auto resize input
function resizeInput() {
    $(this).attr('size', $(this).val().length);
}

$('input[type="text"], input[type="email"]')
    // event handler
    .keyup(resizeInput)
    // resize on page load
    .each(resizeInput);


console.clear();
// Adapted from georgepapadakis.me/demo/expanding-textarea.html
(function(){
  
  var textareas = document.querySelectorAll('.expanding'),
      
      resize = function(t) {
        t.style.height = 'auto';
        t.style.overflow = 'hidden'; // Ensure scrollbar doesn't interfere with the true height of the text.
        t.style.height = (t.scrollHeight + t.offset ) + 'px';
        t.style.overflow = '';
      },
      
      attachResize = function(t) {
        if ( t ) {
          console.log('t.className',t.className);
          t.offset = !window.opera ? (t.offsetHeight - t.clientHeight) : (t.offsetHeight + parseInt(window.getComputedStyle(t, null).getPropertyValue('border-top-width')));

          resize(t);

          if ( t.addEventListener ) {
            t.addEventListener('input', function() { resize(t); });
            t.addEventListener('mouseup', function() { resize(t); }); // set height after user resize
          }

          t['attachEvent'] && t.attachEvent('onkeyup', function() { resize(t); });
        }
      };
  
  // IE7 support
  if ( !document.querySelectorAll ) {
  
    function getElementsByClass(searchClass,node,tag) {
      var classElements = new Array();
      node = node || document;
      tag = tag || '*';
      var els = node.getElementsByTagName(tag);
      var elsLen = els.length;
      var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
      for (i = 0, j = 0; i < elsLen; i++) {
        if ( pattern.test(els[i].className) ) {
          classElements[j] = els[i];
          j++;
        }
      }
      return classElements;
    }
    
    textareas = getElementsByClass('expanding');
  }
  
  for (var i = 0; i < textareas.length; i++ ) {
    attachResize(textareas[i]);
  }
  
})();

const faders = document.querySelectorAll('.fade-in');

function fadeOnScroll() {
  faders.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', fadeOnScroll, { passive: true });
fadeOnScroll(); // Trigger once on load

function typeWriter(text, i, fnCallback) {
  const el = document.querySelector(".first_line");
  if (i < text.length) {
    el.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
    setTimeout(function () {
      typeWriter(text, i + 1, fnCallback);
    }, 50); // faster speed (was 75ms)
  } else {
    el.innerHTML = text + '<span class="cursor blink">|</span>';
    if (typeof fnCallback === "function") fnCallback();
  }
}


document.addEventListener("DOMContentLoaded", function () {
  var el = document.querySelector(".first_line");
  var introText = el.innerText || el.textContent;
  el.innerHTML = ""; // clear existing content
  typeWriter(introText, 0);
});




document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetSelector = this.getAttribute('href');

    if (!targetSelector || targetSelector === '#') {
      return;
    }

    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
      return;
    }

    e.preventDefault();
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

const scrollVanishElements = document.querySelectorAll('.scroll-vanish');
let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

function handleScrollVanish() {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollingDown = currentScrollTop > lastScrollTop;

  scrollVanishElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

    if (isVisible) {
      el.classList.add('visible');
      el.classList.remove('fade-up');
      el.classList.remove('fade-down');
    } else {
      el.classList.remove('visible');
      if (scrollingDown) {
        el.classList.add('fade-down');
        el.classList.remove('fade-up');
      } else {
        el.classList.add('fade-up');
        el.classList.remove('fade-down');
      }
    }
  });

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

window.addEventListener('scroll', handleScrollVanish, { passive: true });
window.addEventListener('load', handleScrollVanish);

let skillsAnimated = false;

function revealCardsOnScroll() {
  const section = document.querySelector('.skills-experience-container');
  const cards = section.querySelectorAll('.card');
  const rect = section.getBoundingClientRect();
  const triggerPoint = window.innerHeight * 0.85;

  // When the section is in view
  if (rect.top < triggerPoint && rect.bottom > 100) {
    if (!skillsAnimated) {
      cards.forEach(card => {
        card.classList.remove('animate'); // reset first
        void card.offsetWidth; // force reflow to restart animation
        card.classList.add('animate');
      });
      skillsAnimated = true;
    }
  } else {
    // If it's completely out of view, allow re-animation
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      skillsAnimated = false;
      cards.forEach(card => card.classList.remove('animate'));
    }
  }
}

window.addEventListener('scroll', revealCardsOnScroll, { passive: true });
window.addEventListener('load', revealCardsOnScroll);

function handleSectionVisibility() {
  const sections = document.querySelectorAll('.section-fade');

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 100;

    if (isVisible) {
      section.classList.add('visible');
    } else {
      section.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', handleSectionVisibility, { passive: true });
window.addEventListener('load', handleSectionVisibility);

document.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.querySelector('[data-about-tabs]');
  if (!aboutSection) {
    return;
  }

  const tabButtons = Array.from(aboutSection.querySelectorAll('[data-about-target]'));
  const panels = Array.from(aboutSection.querySelectorAll('[data-about-panel]'));

  if (!tabButtons.length || !panels.length) {
    return;
  }

  const activateTab = (targetId) => {
    tabButtons.forEach(button => {
      const isActive = button.getAttribute('data-about-target') === targetId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panels.forEach(panel => {
      const isActive = panel.getAttribute('data-about-panel') === targetId;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
  };

  const focusTab = (index) => {
    if (!tabButtons.length) {
      return;
    }

    const clampedIndex = (index + tabButtons.length) % tabButtons.length;
    const targetButton = tabButtons[clampedIndex];
    if (targetButton) {
      targetButton.focus();
      activateTab(targetButton.getAttribute('data-about-target'));
    }
  };

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      activateTab(button.getAttribute('data-about-target'));
    });

    button.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          focusTab(index + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          focusTab(index - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusTab(0);
          break;
        case 'End':
          event.preventDefault();
          focusTab(tabButtons.length - 1);
          break;
        default:
          break;
      }
    });
  });

  const initialButton = tabButtons.find(button => button.classList.contains('active')) || tabButtons[0];
  if (initialButton) {
    activateTab(initialButton.getAttribute('data-about-target'));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const heroCard = document.getElementById('hello');
  if (!heroCard) {
    return;
  }

  const body = document.body;
  const aboutTriggers = document.querySelectorAll('[data-hero-about]');
  const heroResetters = document.querySelectorAll('[data-hero-reset]');
  let hasLeftHero = false;

  const activateHeroAbout = () => {
    heroCard.classList.add('hero-card--about');
    body.classList.add('hero-about-active');
    hasLeftHero = false;
  };

  const resetHeroAbout = () => {
    heroCard.classList.remove('hero-card--about');
    body.classList.remove('hero-about-active');
    hasLeftHero = false;
  };

  aboutTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      activateHeroAbout();
    });
  });

  heroResetters.forEach(trigger => {
    trigger.addEventListener('click', () => {
      resetHeroAbout();
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (hasLeftHero) {
            resetHeroAbout();
          }
        } else if (body.classList.contains('hero-about-active')) {
          hasLeftHero = true;
        }
      });
    }, { threshold: 0 });

    observer.observe(heroCard);
  } else {
    window.addEventListener('scroll', () => {
      const bounds = heroCard.getBoundingClientRect();
      const fullyVisible = bounds.top >= 0 && bounds.bottom <= (window.innerHeight || document.documentElement.clientHeight);
      if (fullyVisible) {
        resetHeroAbout();
      }
    }, { passive: true });
  }
});

// Project filtering
$(document).ready(function(){
  $('.filter-btn').click(function(){
    var filter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    $('.project-category').each(function(){
      var $cat = $(this);
      var cat = $cat.data('category');
      $cat.stop(true, true); // prevent queued animations
      if(filter === cat){
        $cat.removeClass('hide').fadeIn(300);
      } else {
        $cat.fadeOut(300, function(){
          $cat.addClass('hide');
        });
      }
    });
  });
});

const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');

if (navToggle && navLinks) {
  const closeNav = () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('is-open', !isExpanded);
  });

  navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('is-open')) {
        closeNav();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && navLinks.classList.contains('is-open')) {
      closeNav();
    }
  });
}
