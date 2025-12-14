/* ----- MODERN THEME MANAGEMENT ----- */
class ThemeManager {
  constructor() {
    this.body = document.body
    this.themeIcon = document.getElementById("theme-icon")
    this.init()
  }

  init() {
    this.loadSavedTheme()
    this.setupEventListeners()
  }

  toggleTheme() {
    const isDark = this.body.getAttribute("data-theme") === "dark"

    if (isDark) {
      this.setLightTheme()
    } else {
      this.setDarkTheme()
    }
  }

  setDarkTheme() {
    this.body.setAttribute("data-theme", "dark")
    this.updateIcon("uil-sun", "uil-moon")
    localStorage.setItem("theme", "dark")
    this.announceThemeChange("Dark theme activated")
  }

  setLightTheme() {
    this.body.removeAttribute("data-theme")
    this.updateIcon("uil-moon", "uil-sun")
    localStorage.setItem("theme", "light")
    this.announceThemeChange("Light theme activated")
  }

  updateIcon(addClass, removeClass) {
    this.themeIcon?.classList.remove(removeClass)
    this.themeIcon?.classList.add(addClass)
  }

  loadSavedTheme() {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")

    if (savedTheme === "dark") {
      this.setDarkTheme()
    }
  }

  announceThemeChange(message) {
    // For screen readers
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message
    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  setupEventListeners() {
    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          e.matches ? this.setDarkTheme() : this.setLightTheme()
        }
      })
  }
}

// Global function for backward compatibility
function toggleTheme() {
  window.themeManager?.toggleTheme()
}

/* ----- MODERN NAVIGATION MANAGER ----- */
class NavigationManager {
  constructor() {
    this.navMenu = document.getElementById("myNavMenu")
    this.hamburger = document.querySelector(".nav-menu-btn i")
    this.navMenuBtn = document.querySelector(".nav-menu-btn")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.isOpen = false
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupKeyboardNavigation()
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu()
  }

  openMenu() {
    this.navMenu?.classList.add("responsive")
    this.hamburger?.classList.replace("uil-bars", "uil-times")
    this.navMenuBtn?.setAttribute("aria-expanded", "true")
    this.isOpen = true

    // Focus first nav link for keyboard users
    this.navLinks[0]?.focus()

    // Add click outside listener
    document.addEventListener("click", this.handleClickOutside.bind(this))
  }

  closeMenu() {
    this.navMenu?.classList.remove("responsive")
    this.hamburger?.classList.replace("uil-times", "uil-bars")
    this.navMenuBtn?.setAttribute("aria-expanded", "false")
    this.isOpen = false

    // Remove click outside listener
    document.removeEventListener("click", this.handleClickOutside.bind(this))
  }

  handleClickOutside(event) {
    if (
      !this.navMenu?.contains(event.target) &&
      !this.navMenuBtn?.contains(event.target)
    ) {
      this.closeMenu()
    }
  }

  setupEventListeners() {
    // Close menu when clicking nav links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (this.isOpen) {
          this.closeMenu()
        }
      })
    })

    // Handle resize events
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu()
      }
    })
  }

  setupKeyboardNavigation() {
    // Escape key closes menu
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu()
        this.navMenuBtn?.focus()
      }
    })

    // Tab navigation within menu
    this.navLinks.forEach((link, index) => {
      link.addEventListener("keydown", (e) => {
        if (e.key === "Tab" && this.isOpen) {
          if (e.shiftKey && index === 0) {
            e.preventDefault()
            this.navLinks[this.navLinks.length - 1].focus()
          } else if (!e.shiftKey && index === this.navLinks.length - 1) {
            e.preventDefault()
            this.navLinks[0].focus()
          }
        }
      })
    })
  }
}

// Global function for backward compatibility
function myMenuFunction() {
  window.navigationManager?.toggleMenu()
}

/* ----- MODERN SCROLL MANAGER ----- */
class ScrollManager {
  constructor() {
    this.header = document.getElementById("header")
    this.lastScrollY = window.scrollY
    this.ticking = false
    this.init()
  }

  init() {
    this.setupScrollListener()
    this.updateHeaderShadow() // Initial call
  }

  setupScrollListener() {
    window.addEventListener(
      "scroll",
      () => {
        this.lastScrollY = window.scrollY
        this.requestTick()
      },
      { passive: true }
    )
  }

  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateHeaderShadow()
        this.ticking = false
      })
      this.ticking = true
    }
  }

  updateHeaderShadow() {
    const scrollThreshold = 50
    const isScrolled = this.lastScrollY > scrollThreshold

    if (this.header) {
      this.header.classList.toggle("scrolled", isScrolled)
    }
  }
}

/* ----- MODERN TYPING EFFECT ----- */
class TypingEffect {
  constructor() {
    this.element = document.querySelector(".typedText")
    this.strings = ["Cloud Engineer", "Problem Solver", "Tech Innovator"]
    this.currentStringIndex = 0
    this.currentCharIndex = 0
    this.isDeleting = false
    this.typeSpeed = 100
    this.deleteSpeed = 50
    this.pauseDelay = 2000
    this.init()
  }

  init() {
    if (this.element) {
      this.type()
    }
  }

  type() {
    const currentString = this.strings[this.currentStringIndex]

    if (this.isDeleting) {
      this.element.textContent = currentString.substring(
        0,
        this.currentCharIndex - 1
      )
      this.currentCharIndex--
    } else {
      this.element.textContent = currentString.substring(
        0,
        this.currentCharIndex + 1
      )
      this.currentCharIndex++
    }

    let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed

    if (!this.isDeleting && this.currentCharIndex === currentString.length) {
      delay = this.pauseDelay
      this.isDeleting = true
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false
      this.currentStringIndex =
        (this.currentStringIndex + 1) % this.strings.length
    }

    setTimeout(() => this.type(), delay)
  }
}

// Fallback to Typed.js if available
function initTypingEffect() {
  if (typeof Typed !== "undefined") {
    new Typed(".typedText", {
      strings: [
        "Full-Stack Developer",
        "Problem Solver",
        "Tech Innovator",
        "UI/UX Enthusiast"
      ],
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      smartBackspace: true
    })
  } else {
    new TypingEffect()
  }
}

/* ----- MODERN INTERSECTION OBSERVER ANIMATIONS ----- */
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }
    this.init()
  }

  init() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      this.setupScrollAnimations()
    }
  }

  setupScrollAnimations() {
    // Fallback to ScrollReveal if available
    if (typeof ScrollReveal !== "undefined") {
      this.initScrollReveal()
    } else {
      this.initIntersectionObserver()
    }
  }

  initScrollReveal() {
    const sr = ScrollReveal({
      origin: "top",
      distance: "60px",
      duration: 1000,
      reset: false,
      viewFactor: 0.1
    })

    // Hero animations
    sr.reveal(".hero-text", { delay: 100 })
    sr.reveal(".hero-image", { delay: 200, origin: "right" })

    // Section animations
    sr.reveal(".section-header", { delay: 100 })
    sr.reveal(".about-card", { delay: 200, origin: "left" })
    sr.reveal(".skill-category", { delay: 100, interval: 150 })
    sr.reveal(".project-card", { delay: 100, interval: 200 })
    sr.reveal(".contact-card", { delay: 200 })
  }

  initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
          observer.unobserve(entry.target)
        }
      })
    }, this.observerOptions)

    // Observe elements
    const animateElements = document.querySelectorAll(
      ".hero-text, .hero-image, .section-header, .about-card, .skill-category, .project-card, .contact-card"
    )

    animateElements.forEach((el) => {
      el.classList.add("animate-on-scroll")
      observer.observe(el)
    })
  }
}

/* ----- MODERN ACTIVE SECTION MANAGER ----- */
class ActiveSectionManager {
  constructor() {
    this.sections = document.querySelectorAll("section[id]")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.currentActive = null
    this.ticking = false
    this.init()
  }

  init() {
    this.setupScrollListener()
    this.updateActiveSection() // Initial call
  }

  setupScrollListener() {
    window.addEventListener(
      "scroll",
      () => {
        this.requestTick()
      },
      { passive: true }
    )
  }

  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateActiveSection()
        this.ticking = false
      })
      this.ticking = true
    }
  }

  updateActiveSection() {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    let activeSection = null

    // Check if at bottom of page
    if (scrollY + windowHeight >= documentHeight - 100) {
      activeSection = this.sections[this.sections.length - 1]
    } else {
      // Find active section based on scroll position
      this.sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100
        const sectionHeight = section.offsetHeight

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          activeSection = section
        }
      })
    }

    // Update active link if changed
    if (activeSection && activeSection !== this.currentActive) {
      this.currentActive = activeSection
      this.setActiveLink(activeSection.id)
    }
  }

  setActiveLink(activeId) {
    // Remove all active classes
    this.navLinks.forEach((link) => {
      link.classList.remove("active-link")
      link.removeAttribute("aria-current")
    })

    // Add active class to current section link
    const activeLink = document.querySelector(`a[href="#${activeId}"]`)
    if (activeLink) {
      activeLink.classList.add("active-link")
      activeLink.setAttribute("aria-current", "page")
    }
  }
}

/* ----- PERFORMANCE OPTIMIZATIONS ----- */
class PerformanceManager {
  constructor() {
    this.init()
  }

  init() {
    this.lazyLoadImages()
    this.preloadCriticalResources()
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]')

    if ("loading" in HTMLImageElement.prototype) {
      // Native lazy loading supported
      return
    }

    // Fallback for older browsers
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
    ]

    fontLinks.forEach((href) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "style"
      link.href = href
      document.head.appendChild(link)
    })
  }
}

/* ----- MODERN INITIALIZATION ----- */
class PortfolioApp {
  constructor() {
    this.managers = {}
    this.init()
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeManagers()
      )
    } else {
      this.initializeManagers()
    }
  }

  initializeManagers() {
    try {
      // Initialize core managers
      this.managers.theme = new ThemeManager()
      this.managers.navigation = new NavigationManager()
      this.managers.scroll = new ScrollManager()
      this.managers.activeSection = new ActiveSectionManager()
      this.managers.animation = new AnimationManager()
      this.managers.performance = new PerformanceManager()

      // Make managers globally accessible
      window.themeManager = this.managers.theme
      window.navigationManager = this.managers.navigation

      // Initialize typing effect
      initTypingEffect()

      // Setup smooth scrolling for anchor links
      this.setupSmoothScrolling()

      console.log("Portfolio app initialized successfully")
    } catch (error) {
      console.error("Error initializing portfolio app:", error)
    }
  }

  setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]')

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href").slice(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          e.preventDefault()

          const headerHeight =
            document.getElementById("header")?.offsetHeight || 80
          const targetPosition = targetElement.offsetTop - headerHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          })
        }
      })
    })
  }
}

// Initialize the app
new PortfolioApp()
