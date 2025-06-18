  window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
      } else {
          navbar.classList.remove('scrolled');
      }
  });

  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
   mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
  });

  document.querySelectorAll('.mobile-menu .nav-link, .mobile-menu .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
          mobileToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
      });
  });

  document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
      }
  });

  const videos = document.querySelectorAll('.background-video');
  const indicators = document.querySelectorAll('.indicator');
  let currentVideoIndex = 0;
  const videoDuration = 8000; // 8 seconds per video
   function switchVideo(index) {

      videos.forEach(video => video.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));

      videos[index].classList.add('active');
      indicators[index].classList.add('active');
      
      currentVideoIndex = index;
  }
   function nextVideo() {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      switchVideo(nextIndex);
  }

  setInterval(nextVideo, videoDuration);
  indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
          switchVideo(index);
      });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {

              const navbarHeight = 70;
              const targetPosition = target.offsetTop - navbarHeight;
              
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });

  window.addEventListener('load', () => {
      videos.forEach((video, index) => {
          video.addEventListener('loadeddata', () => {
              if (index === 0) {
                  video.play().catch(e => {
                      console.log('Video autoplay prevented:', e);
                  });
              }
          });
          
          video.load();
      });
  });

  videos.forEach(video => {
      video.addEventListener('canplaythrough', () => {
          video.style.filter = 'none';
      });
      
      video.addEventListener('waiting', () => {
          video.style.filter = 'blur(2px)';
      });
  })