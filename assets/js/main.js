// Code JavaScript for responsive menu

document.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.querySelector('.menu-btn');
    var slides = document.querySelectorAll('.video-slide');
    var navigation = document.querySelector('.navigation');
    var btns = document.querySelectorAll('.nav-btn');
    var contents = document.querySelectorAll('.content');
    var sliderNav = function(manual){
        btns.forEach((btn)=>{
            btn.classList.remove('active');
        });
        slides.forEach((slide)=>{
            slide.classList.remove('active');
        });
        contents.forEach((content)=>{
            content.classList.remove('active');
        });
        btns[manual].classList.add('active');
        slides[manual].classList.add('active');
        contents[manual].classList.add('active');

    }
    btns.forEach((btn, i)=>{
        btn.addEventListener('click', ()=>{
            sliderNav(i);
        })
    })
    menuBtn.addEventListener('click', function() {
      menuBtn.classList.toggle('active');
      navigation.classList.toggle('active');
    });
  });

var TrandingSlider = new Swiper('.tranding-slider', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2.5,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});
