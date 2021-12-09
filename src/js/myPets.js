/*Раскрытие блока с пометами*/

$(document).ready(function() {
  $('.pets_item_result_more').click(function(){
    if ($(this).hasClass('active')){
      $(this).removeClass('active');
      $(this).parent().next().removeClass('active');
    } else {
      $(this).addClass('active');
      $(this).parent().next().addClass('active');
    }
  });
});