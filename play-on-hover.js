(function () {
  const videos = document.querySelectorAll('video.video-card-screen');

  videos.forEach(vid => {
    vid.addEventListener('mouseenter', () => vid.play());
    vid.addEventListener('mouseleave', () => vid.pause());
  });
})();
