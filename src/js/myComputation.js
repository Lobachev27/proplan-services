/*Переключение табов расчетов*/

$(document).ready(function() {
  $(".computation_link").on("click", function() {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  $(function () {
    var tabContainers = $('.computation_container > div');
    tabContainers.hide().filter(':first').show();
    $('.computation_link').click(function () {
      tabContainers.hide();
      tabContainers.filter(this.hash).show();
      $('.computation_link').removeClass('selected');
      $(this).addClass('selected');
      return false;
    }).filter(':first').click();
  });
});