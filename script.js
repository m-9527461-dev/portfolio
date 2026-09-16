const filterButtons = document.querySelectorAll('[data-filter]');
const projectItems = document.querySelectorAll('.project-item');
let backgroundMusic;

const topbar = document.querySelector('.topbar');
const navLinks = document.querySelector('.nav-links');

if (topbar && navLinks) {
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-toggle';
    menuButton.type = 'button';
    menuButton.setAttribute('aria-label', 'Buka menu navigasi');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<span></span><span></span><span></span>';
    topbar.querySelector('.nav')?.append(menuButton);

    const closeMenu = () => {
        navLinks.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Buka menu navigasi');
    };

    menuButton.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    });

    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) closeMenu();
    });
}

const musicMarkup = `
    <span class="audio-icon" aria-hidden="true">♪</span>
    <audio class="background-music" controls loop preload="auto" aria-label="Kawalan audio">
        <source src="assets/music/background.mp3" type="audio/mpeg">
        Pelayar anda tidak menyokong audio.
    </audio>`;

const existingAudioDock = document.querySelector('.header-audio');
if (existingAudioDock) {
    existingAudioDock.innerHTML = musicMarkup;
} else if (topbar?.querySelector('.nav')) {
    const audioDock = document.createElement('div');
    audioDock.className = 'header-audio';
    audioDock.setAttribute('aria-label', 'Kawalan muzik latar');
    audioDock.innerHTML = musicMarkup;
    topbar.querySelector('.nav').append(audioDock);
}

backgroundMusic = document.querySelector('.background-music');

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.append(scrollProgress);

const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.textContent = '↑';
backToTop.setAttribute('aria-label', 'Kembali ke atas');
document.body.append(backToTop);

const updateScrollUi = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
    backToTop.classList.toggle('is-visible', window.scrollY > 420);
};

window.addEventListener('scroll', updateScrollUi, { passive: true });
updateScrollUi();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const revealItems = document.querySelectorAll('.page-hero, .page-content .card, .hero-content, .avatar-card, .section .card');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (backgroundMusic) {
    const audioDock = backgroundMusic.closest('.header-audio');
    backgroundMusic.addEventListener('play', () => audioDock?.classList.add('is-playing'));
    backgroundMusic.addEventListener('pause', () => audioDock?.classList.remove('is-playing'));
    window.addEventListener('pagehide', () => backgroundMusic.pause());
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;

        projectItems.forEach((project) => {
            project.hidden = filter !== 'all' && project.dataset.category !== filter;
        });
    });
});

const projectList = document.querySelector('.project-list');
if (projectList && !document.querySelector('.tiktok-section')) {
    const tiktokSection = document.createElement('section');
    tiktokSection.className = 'section tiktok-section';
    tiktokSection.innerHTML = '<div class="container"><div class="cta"><span class="eyebrow">VIDEO PROJEK</span><h2>Hasil kerja di TikTok</h2><p>Tonton video projek multimedia saya melalui pautan di bawah.</p></div></div>';

    const tiktokLink = document.createElement('a');
    tiktokLink.className = 'btn primary tiktok-project-link';
    tiktokLink.href = 'https://www.tiktok.com/@budak.ksk.kvkluang/video/7508194675866504455?is_from_webapp=1&sender_device=pc';
    tiktokLink.target = '_blank';
    tiktokLink.rel = 'noopener';
    tiktokLink.textContent = 'Buka video TikTok';
    tiktokSection.querySelector('.cta').append(tiktokLink);
    document.querySelector('.project-video-section')?.after(tiktokSection);
}

document.querySelector('#contactForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector('#formStatus').textContent = 'Terima kasih. Mesej anda telah direkodkan untuk demo.';
    event.target.reset();
});
