/*Всплыающая подсказка*/

$(document).ready(function() {
  $('.modalDialog_note').hover(function(){
    $(this).next('.modalDialog_note_desc').addClass('active');
  },function(){
    $(this).next('.modalDialog_note_desc').removeClass('active');
  });
});

/*При клике плюс открывается соответствующее модалка с соответствующими данными*/

$(function() {
  var gender,
      breed,
      name,
      parentBox;

  $(".genealogy_element_plus").on('click', function() {
    parentBox = $(this).parent().parent().parent().parent();

    if(parentBox.hasClass("one")){
      if($(".genealogyPet_gender").hasClass("male")){
        gender = "male";
        $(".modalDialog_gender").addClass(gender);
        console.log(gender);
      };
      if($(".genealogyPet_gender").hasClass("female")){
        gender = "female";
        $(".modalDialog_gender").addClass(gender);
      };

      breed = $(".genealogyPet_breed").text();
      $(".modalDialog_breed").text(breed);

      name = $(".genealogyPet_name").text();
      $(".modalDialog_name").text(name);
    } else{
      if(($(this).parent().parent().parent().parent().prev()).hasClass("male")){
        gender = "male";
        $(".modalDialog_gender").addClass(gender);
      };
      if(($(this).parent().parent().parent().parent().prev()).hasClass("female")){
        gender = "female";
        $(".modalDialog_gender").addClass(gender);
      };

      breed = $($(this).parent().parent().parent().parent().prev().children().children()[0]).text();
      $(".modalDialog_breed").text(breed);

      name = $($(this).parent().parent().parent().parent().prev().children().children()[1]).text();
      $(".modalDialog_name").text(name);
    }
  });

  $('.closeModal').click(function(){
    $(".modalDialog_gender").removeClass("male");
    $(".modalDialog_gender").removeClass("female");
    $(".modalDialog_breed").text("");
    $(".modalDialog_name").text("");
  });
});