// Code JavaScript for responsive menu
document.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.querySelector('.menu-btn');
    var navigation = document.querySelector('.navigation');
    var btns = document.querySelectorAll('.nav.btn');
    var sliderNav = function(manual){
        btns.forEach(function(btn){
            btn.classList.remove('active');
        })
        btns[manual].classList.add('active');
    }
    btns.forEach(function(btn, i){
        btn.addEventListener('click', function(){
            
            sliderNav(i);
        })
    })
    menuBtn.addEventListener('click', function() {
      menuBtn.classList.toggle('active');
      navigation.classList.toggle('active');
    });
  });
