(function(){
  // ---- Hero name letter reveal ----
  var name = "Lirith Vikraman N";
  var target = document.getElementById('hero-name');
  var delay = 0;
  name.split('').forEach(function(ch){
    var span = document.createElement('span');
    span.className = 'ch';
    span.style.animationDelay = delay + 's';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    if (ch === ' ' ) span.style.marginRight = '0.28em';
    target.appendChild(span);
    delay += 0.028;
  });
  // line break after "Lirith"
  // (kept single line via CSS wrapping on narrow screens)

  // ---- Scroll progress / scan readout ----
  var fill = document.getElementById('scan-fill');
  var readout = document.getElementById('scan-readout');
  function onScroll(){
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var height = h.scrollHeight - h.clientHeight;
    var pct = height > 0 ? Math.min(100, Math.round((scrolled / height) * 100)) : 0;
    fill.style.width = pct + '%';
    readout.textContent = 'SCAN ' + pct + '%';

    var topBtn = document.getElementById('top-btn');
    if (scrolled > 500) topBtn.classList.add('show'); else topBtn.classList.remove('show');
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  document.getElementById('top-btn').addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // ---- Hero scanline sweep ----
  var scanline = document.getElementById('scanline');
  var svg = document.getElementById('hero-grid');
  function sizeSvg(){
    var rect = svg.parentElement.getBoundingClientRect();
    svg.setAttribute('width', rect.width);
    svg.setAttribute('height', rect.height);
    svg.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);
  }
  sizeSvg();
  window.addEventListener('resize', sizeSvg);
  var sy = 0, sh = 1, dir = 1;
  function animateScan(){
    var rect = svg.getBoundingClientRect();
    sy += dir * (rect.height / 420);
    if (sy > rect.height || sy < 0) dir *= -1;
    scanline.setAttribute('y1', sy);
    scanline.setAttribute('y2', sy);
    requestAnimationFrame(animateScan);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    requestAnimationFrame(animateScan);
  }

  // ---- Active nav link tracking ----
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var sections = navLinks.map(function(l){ return document.querySelector(l.getAttribute('href')); });
  var navObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        var id = '#' + entry.target.id;
        navLinks.forEach(function(l){ l.classList.toggle('active', l.getAttribute('href') === id); });
      }
    });
  }, {rootMargin:'-40% 0px -50% 0px', threshold:0});
  sections.forEach(function(s){ if (s) navObserver.observe(s); });

  // ---- Reveal-on-scroll (headers / blocks, once) ----
  var revealObserver = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ revealObserver.observe(el); });

  // ---- Console replay when scrolled into view ----
  var consoleEl = document.getElementById('console');
  var consoleObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        consoleEl.classList.remove('replay');
        void consoleEl.offsetWidth; // restart animation
        consoleEl.classList.add('replay');
      }
    });
  }, {threshold:0.6});
  consoleObserver.observe(consoleEl);

  // ---- Project card cursor spotlight + hover flow animation ----
  document.querySelectorAll('[data-tilt]').forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
    card.addEventListener('mouseenter', function(){ card.classList.add('animate-flow'); });
    card.addEventListener('mouseleave', function(){ card.classList.remove('animate-flow'); });
  });
})();