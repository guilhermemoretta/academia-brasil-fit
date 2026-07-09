document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const themeToggle = document.getElementById('themeToggle');
    const header = document.getElementById('header');

    function updateThemeIcon(isDark) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon-star');
        if (window.lucide) window.lucide.createIcons();
    }

    const savedTheme = localStorage.getItem('brasilfit-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    const isDarkTheme = initialTheme === 'dark';
    document.body.classList.toggle('dark-theme', isDarkTheme);
    updateThemeIcon(isDarkTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextIsDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('brasilfit-theme', nextIsDark ? 'dark' : 'light');
            updateThemeIcon(nextIsDark);
        });
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const willOpen = !navMenu.classList.contains('active');
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (event) => {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                event.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    window.scrollTo({ top: target.offsetTop - headerHeight - 12, behavior: 'smooth' });
                }
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

    const setActiveLink = () => {
        const sections = document.querySelectorAll('main section[id]');
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
            if (link && section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
                document.querySelectorAll('.nav-menu a').forEach(item => item.classList.remove('active'));
                link.classList.add('active');
            }
        });
    };

    setActiveLink();
    window.addEventListener('scroll', setActiveLink);

    const defaultMessage = encodeURIComponent('Olá! Quero agendar uma visita e conhecer a estrutura da Academia Brasil Fit.');
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        if (!link.getAttribute('href').includes('text=')) {
            link.setAttribute('href', `${link.getAttribute('href')}?text=${defaultMessage}`);
        }
    });
});
