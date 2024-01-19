// Code JavaScript for responsive menu
document.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.querySelector('.menu-btn');
    var slides = document.querySelectorAll('.video-slide');
    var navigation = document.querySelector('.navigation');
    var btns = document.querySelectorAll('.nav-btn');
    var contents = document.querySelectorAll('.content ');
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
