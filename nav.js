(function () {
  var list = document.querySelector('#navbar ul');
  if (!list) return;

  var pill = document.createElement('span');
  pill.className = 'nav-pill';
  pill.setAttribute('aria-hidden', 'true');
  list.prepend(pill);

  var items = Array.prototype.slice.call(list.querySelectorAll('li'));

  function activeItem() {
    // .is-active lives on the <a> inside the <li>, not the <li> itself.
    return items.find(function (li) {
      return li.querySelector('.is-active');
    }) || items[0];
  }

  function movePillTo(li) {
    pill.style.transform = 'translateX(' + li.offsetLeft + 'px)';
    pill.style.width = li.offsetWidth + 'px';
    pill.style.opacity = '1';
  }

  items.forEach(function (li) {
    li.addEventListener('mouseenter', function () {
      movePillTo(li);
    });
  });

  // Listening on the <ul> (not each <li>) means moving between adjacent
  // links doesn't trigger a leave-then-enter flicker.
  list.addEventListener('mouseleave', function () {
    movePillTo(activeItem());
  });

  // Keep the pill aligned if a hovered link's position changes (e.g. resize),
  // falling back to the active link if nothing is currently hovered.
  // Coalesced to one measure+move per frame — resize fires far faster than that.
  var resizeScheduled = false;
  window.addEventListener('resize', function () {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(function () {
      resizeScheduled = false;
      var hovered = list.querySelector('li:hover');
      movePillTo(hovered || activeItem());
    });
  });

  // Place the pill under the active link immediately, with no transition,
  // so it doesn't visibly glide in from the left edge on first paint.
  pill.style.transition = 'none';
  movePillTo(activeItem());
  void pill.offsetHeight; // force a reflow before re-enabling the transition
  pill.style.transition = '';
})();
