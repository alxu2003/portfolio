(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
  if (sections.length < 2) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SNAP_DURATION = 540;     // eased snap-to-section animation duration
  var WHEEL_SETTLE_MS = 1200;   // pause after the last wheel tick before snapping
  var FLING_VELOCITY_MULTIPLIER = 120; // projects touch release velocity forward before snapping

  var sectionTops = [];
  function measure() {
    sectionTops = sections.map(function (section) {
      return section.getBoundingClientRect().top + window.scrollY;
    });
  }
  measure();

  // Coalesced to one remeasure per frame — resize fires far faster than that.
  var resizeScheduled = false;
  window.addEventListener('resize', function () {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(function () {
      resizeScheduled = false;
      measure();
    });
  });

  var animFrame = null;

  function cancelAnim() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  // Evaluates a CSS-style cubic-bezier(x1, y1, x2, y2) timing function at progress x.
  function cubicBezier(x1, y1, x2, y2) {
    function a(v1, v2) { return 1.0 - 3.0 * v2 + 3.0 * v1; }
    function b(v1, v2) { return 3.0 * v2 - 6.0 * v1; }
    function c(v1) { return 3.0 * v1; }

    function calc(t, v1, v2) {
      return ((a(v1, v2) * t + b(v1, v2)) * t + c(v1)) * t;
    }

    function slope(t, v1, v2) {
      return 3.0 * a(v1, v2) * t * t + 2.0 * b(v1, v2) * t + c(v1);
    }

    function tForX(x) {
      var t = x;
      for (var i = 0; i < 4; i++) {
        var currentSlope = slope(t, x1, x2);
        if (currentSlope === 0) return t;
        t -= (calc(t, x1, x2) - x) / currentSlope;
      }
      return t;
    }

    return function (x) {
      return calc(tForX(x), y1, y2);
    };
  }

  var ease = cubicBezier(.6, .33, .53, .79);

  function closestIndex(y) {
    var best = 0;
    var bestDist = Infinity;
    sectionTops.forEach(function (top, i) {
      var dist = Math.abs(top - y);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }

  // Eased scroll animation, cancelable so new input always interrupts cleanly.
  function animateScrollTo(target, duration) {
    cancelAnim();

    if (prefersReducedMotion) {
      window.scrollTo(0, target);
      return;
    }

    var start = window.scrollY;
    var distance = target - start;
    var startTime = null;

    function frame(now) {
      if (startTime === null) startTime = now;
      var t = Math.min(1, (now - startTime) / duration);
      window.scrollTo(0, start + distance * ease(t));

      if (t < 1) {
        animFrame = requestAnimationFrame(frame);
      } else {
        animFrame = null;
      }
    }
    animFrame = requestAnimationFrame(frame);
  }

  function snapToIndex(index) {
    var clamped = Math.max(0, Math.min(sections.length - 1, index));
    animateScrollTo(sectionTops[clamped], SNAP_DURATION);
  }

  // ---- Wheel: track input 1:1, then snap to the nearest section once it settles ----
  var wheelTimer = null;

  window.addEventListener('wheel', function (e) {
    cancelAnim();

    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(function () {
      snapToIndex(closestIndex(window.scrollY));
    }, WHEEL_SETTLE_MS);
  }, { passive: true });

  // ---- Touch: drag 1:1, then fling + snap to the nearest section on release ----
  var touchY = null;
  var lastY = null;
  var lastTime = 0;
  var velocity = 0;

  window.addEventListener('touchstart', function (e) {
    cancelAnim();
    touchY = e.touches[0].clientY;
    lastY = touchY;
    lastTime = performance.now();
    velocity = 0;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (touchY === null) return;
    e.preventDefault();

    var y = e.touches[0].clientY;
    window.scrollTo(0, window.scrollY + (touchY - y));
    touchY = y;

    var now = performance.now();
    var dt = now - lastTime || 1;
    velocity = (lastY - y) / dt; // px per ms, positive = scrolling down
    lastY = y;
    lastTime = now;
  }, { passive: false });

  window.addEventListener('touchend', function () {
    if (touchY === null) return;
    touchY = null;

    var projected = window.scrollY + velocity * FLING_VELOCITY_MULTIPLIER;
    snapToIndex(closestIndex(projected));
  });

  // Exposed so other scripts (e.g. footer dot navigation) can trigger the same eased snap.
  window.snapToSection = snapToIndex;
})();
