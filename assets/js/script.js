(function () {
    /* Menu mobile */
    let btn = document.getElementById('menuBtn');
    let menu = document.getElementById('mobileMenu');
    if (btn && menu) {
        btn.addEventListener('click', function () {
            var open = menu.classList.toggle('hidden') === false;
            menu.classList.toggle('flex', open);
            btn.setAttribute('aria-expanded', String(open));
        });
        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* Carrossel */
    let carousel = document.querySelector('.carousel');
    if (!carousel) return;
    let track = carousel.querySelector('.carousel-track');
    let slides = carousel.querySelectorAll('.carousel-slide');
    let dotsWrap = carousel.querySelector('.carousel-dots');
    let prev = carousel.querySelector('.carousel-arrow--prev');
    let next = carousel.querySelector('.carousel-arrow--next');
    let delay = parseInt(carousel.dataset.autoplay, 10) || 4500;
    let index = 0, timer = null, startX = 0;

    let dots = Array.prototype.map.call(slides, function (_, i) {
        let d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-label', 'Foto ' + (i + 1));
        d.className = 'h-2 w-2 rounded-full bg-bone/30 transition-all duration-300';
        d.addEventListener('click', function () { go(i); restart(); });
        dotsWrap.appendChild(d);
        return d;
    });

    function go(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        dots.forEach(function (d, n) {
            let active = n === index;
            d.classList.toggle('bg-gold', active);
            d.classList.toggle('w-6', active);
            d.classList.toggle('bg-bone/30', !active);
            d.classList.toggle('w-2', !active);
            d.setAttribute('aria-selected', String(active));
        });
    }
    function start() { stop(); timer = setInterval(function () { go(index + 1); }, delay); }
    function stop() { if (timer) clearInterval(timer); }
    function restart() { start(); }

    prev.addEventListener('click', function () { go(index - 1); restart(); });
    next.addEventListener('click', function () { go(index + 1); restart(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
        let diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) go(diff < 0 ? index + 1 : index - 1);
        start();
    });

    go(0);
    start();
})();
