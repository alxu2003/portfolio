(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('footer .dot'));
  if (!sections.length || !dots.length) return;

  function setActive(index) {
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });
  }

  function goToSection(index) {
    if (window.snapToSection) {
      window.snapToSection(index);
    } else if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  }

  dots.forEach(function (dot, i) {
    dot.setAttribute('aria-label', 'Go to project ' + (i + 1));

    dot.addEventListener('click', function () {
      goToSection(i);
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var index = sections.indexOf(entry.target);
      if (index !== -1 && index < dots.length) {
        setActive(index);
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(function (section) {
    observer.observe(section);
  });

  setActive(0);
})();
