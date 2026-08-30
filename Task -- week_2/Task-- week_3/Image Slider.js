// ============ Image Slider / Carousel logic ============

document.addEventListener('DOMContentLoaded', function () {

  const slider       = document.getElementById('slider');
  const slides        = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap       = document.getElementById('sliderDots');
  const prevBtn        = document.getElementById('prevBtn');
  const nextBtn        = document.getElementById('nextBtn');
  const progressBar    = document.getElementById('sliderProgress');

  const AUTOPLAY_MS = 4000;
  let currentIndex = 0;
  let autoplayTimer = null;
  let progressTimer = null;

  // ---- Build dot indicators dynamically (one per slide) ----
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', function () {
      goToSlide(i);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  function goToSlide(index) {
    slides[currentIndex].classList.remove('is-active');
    dots[currentIndex].classList.remove('is-active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('is-active');
    dots[currentIndex].classList.add('is-active');
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  // ---- Autoplay with a visible progress bar ----
  function startProgress() {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // force reflow so the transition below actually restarts
    void progressBar.offsetWidth;
    progressBar.style.transition = 'width ' + AUTOPLAY_MS + 'ms linear';
    progressBar.style.width = '100%';
  }

  function startAutoplay() {
    startProgress();
    autoplayTimer = setInterval(function () {
      nextSlide();
      startProgress();
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    progressBar.style.transition = 'none';
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // ---- Controls ----
  nextBtn.addEventListener('click', function () {
    nextSlide();
    restartAutoplay();
  });
  prevBtn.addEventListener('click', function () {
    prevSlide();
    restartAutoplay();
  });

  // ---- Pause on hover, resume on mouse leave ----
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // ---- Init ----
  startAutoplay();
});