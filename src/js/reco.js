/*Калькулятор баллов*/

$(document).ready(function() {
  let seed = document.querySelectorAll('.calc_input')[0],
    joey = document.querySelectorAll('.calc_input')[1],
    totalValue = document.getElementById('calc_result'),
    seedSum = 0,
    joeySum = 0,
    total = 0;

  if (totalValue){
    totalValue.innerHTML = 0;
  }

  seed.addEventListener('change', function(){
    seedSum = +this.value;
    total = seedSum * joeySum * 250;

    if (seed.value == '' || joey.value == ''){
      totalValue.innerHTML = 0;
    } else{
      totalValue.innerHTML = total;
    }
  });

  joey.addEventListener('change', function(){
    joeySum = +this.value;
    total = seedSum * joeySum * 250;

    if (seed.value == '' || joey.value == ''){
      totalValue.innerHTML = 0;
    } else{
      totalValue.innerHTML = total;
    }
  });
});

/*Cлайдер с призами*/

$(document).ready(function() {
  var swiper = undefined;
  function initSwiper() {
    swiper = new Swiper('.prize .swiper-container', {
      loop: true,
      /*autoplay: {
        delay: 3000
      },*/
      slidesPerView: 3,
      slidesPerGroup: 1,
      spaceBetween: 31,
      autoHeight: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      pagination: {
        el: ".prize .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: '.prize .swiper-button-next',
        prevEl: '.prize .swiper-button-prev'
      },
      breakpoints: {
        767: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        575: {
          slidesPerView: 1,
          spaceBetween: 40,
        }
      }
    });
  }

  initSwiper();

  $(".product_item, .product_box_top .product_box_name").click(function(e){
    e.preventDefault();
    console.log($(this).data('slide'));
    var slide = $(this).data('slide');
    swiper.slideTo(slide);
  })

});