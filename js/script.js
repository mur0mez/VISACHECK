jQuery(function ($) {
  $(document).ready(() => {
    $('.gallery__main-carousel').magnificPopup({
      delegate: 'a',
      type: 'image',
      fixedContentPos: true,
      gallery: {
        enabled: true,
      },
      callbacks: {
        elementParse: (item) => {
          item.type = item.el.hasClass('gallery__media--video')
            ? (item.type = 'iframe')
            : (item.type = 'image');
        },
        change: function () {
          if (this.currItem.type === 'iframe') {
            if (getFileExtension(this.currItem.src) === 'mov') {
              const iframe =
                this.content[0].getElementsByClassName('mfp-iframe')[0];
              const videoTag = document.createElement('video');
              videoTag.className = 'mfp-video';

              if (iframe !== undefined) {
                iframe.parentNode.replaceChild(videoTag, iframe);

                videoTag.setAttribute('controls', '');
                videoTag.setAttribute('autoplay', '0');
                videoTag.setAttribute('name', 'media');
                videoTag.setAttribute('type', 'video/mp4');
                videoTag.style.position = 'absolute';
                videoTag.style.inset = '0';
                videoTag.style.width = '100%';
                videoTag.style.height = '100%';
                videoTag.src = this.currItem.src;
              } else {
                const popupVideo =
                  this.content[0].getElementsByClassName('mfp-video')[0];

                if (popupVideo === undefined) return;

                popupVideo.src = this.currItem.src;
              }
            } else {
              if (
                this.content[0].getElementsByClassName('mfp-iframe')[0] ===
                undefined
              ) {
                const popupVideo =
                  this.content[0].getElementsByClassName('mfp-video')[0];

                if (popupVideo === undefined) return;

                const iframe = document.createElement('iframe');
                iframe.className = 'mfp-iframe';
                iframe.src = this.currItem.src;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', '');

                popupVideo.parentNode.replaceChild(iframe, popupVideo);
              }

              const videoElement = document.createElement('video');
              videoElement.src = this.currItem.src;

              videoElement.addEventListener('loadedmetadata', () => {
                if (videoElement.videoHeight > videoElement.videoWidth) {
                  const scaler = this.content[0];

                  if (window.innerWidth <= 1024) {
                    scaler.style.paddingTop = '65%';
                  }
                  if (window.innerWidth <= 768) {
                    scaler.style.paddingTop = '70%';
                  }
                  if (window.innerWidth <= 640) {
                    scaler.style.paddingTop = '80%';
                  }
                  if (window.innerWidth <= 500) {
                    scaler.style.paddingTop = '100%';
                  }
                }
              });

              setTimeout(() => {
                const video = this.content[0]
                  .getElementsByClassName('mfp-iframe')[0]
                  .contentWindow.document.getElementsByTagName('video')[0];

                if (video === undefined) return;

                video.style.width = '100%';
                video.style.height = '100%';
              }, 100);
            }
          }
        },
      },
    });
  });
});

// get file extension
const getFileExtension = (url) => {
  const parts = url.split('/');
  const fileName = parts.pop();
  const extension = fileName.split('.').pop();

  if (extension === fileName) {
    return '';
  }

  return extension;
};

// Throttle with delay function invoke
const throttled = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// handle fixed topbar
const handleFixedTopbar = () => {
  const topbar = document.getElementsByClassName('topbar')[0];
  const target = document.getElementsByClassName('hero-media')[0];

  if (topbar === undefined || target === undefined) return;

  const stickyPoint = !topbar.classList.contains('sticky')
    ? target.offsetHeight
    : topbar.offsetHeight;

  const toggleClasses = () => {
    if (window.scrollY > stickyPoint) {
      topbar.classList.add('sticky');
    } else {
      topbar.classList.remove('sticky');
    }
  };

  toggleClasses();
  window.addEventListener('scroll', throttled(toggleClasses, 300));
};

// handle video src
const handleVideosSrc = () => {
  const videos = document.getElementsByTagName('video');

  if (!videos.length) return;

  [...videos].forEach((video) => {
    const videoSource = video.getElementsByTagName('source')[0];

    if (videoSource !== undefined) {
      videoSource.setAttribute(
        'src',
        videoSource.getAttribute('src') + '#t=0.001'
      );
    }
  });
};

// handle testimonials carousel
const handleTestimonialCarousel = () => {
  const swiper = new Swiper('.testimonials__carousel', {
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      641: {
        slidesPerView: 2,
      },
      1025: {
        slidesPerView: 3,
      },
      1179: {
        slidesPerView: 4,
      },
    },
  });
};

// handle gallery carousel
const handleGalleryCarousel = () => {
  const thumbsSwiper = new Swiper('.gallery__thumbs-carousel', {
    slidesPerView: 'auto',
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      320: {
        spaceBetween: 4,
      },
      361: {
        spaceBetween: 10,
      },
    },
  });

  const mainSwiper = new Swiper('.gallery__main-carousel', {
    autoHeight: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: thumbsSwiper,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
  });
};

const main = () => {
  handleFixedTopbar();
  handleVideosSrc();
  handleTestimonialCarousel();
  handleGalleryCarousel();
};

window.onload = () => {
  main();
};
