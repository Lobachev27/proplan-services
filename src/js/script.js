/*Выпадающее меню*/

$(document).ready(function() {
  $('.header_hamburger').click(function(){
    if ($('.header_hamburger').hasClass('active')) {
      $('.header_hamburger').removeClass('active');
      $('.header_mobile').removeClass('active');
      $('body').removeClass('ov-hid');
    } else {
      $('.header_hamburger').addClass('active');
      $('.header_mobile').addClass('active');
      $('body').addClass('ov-hid');
    }
  });
});