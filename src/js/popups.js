(function ($) {

    /*function removeParam() {
        location.href = location.origin + location.pathname;
      }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };*/

    /*$('.js-open__popup').click(function(e){
        e.preventDefault();
        $('.popup-overlay').removeClass('popup-overlay-hide').addClass('popup-overlay-show');
        $('.popup__'+$(this).data('popup')).show();
    });

    $('.js-close__popup').click(function(e){
        e.preventDefault();
        $('.popup-overlay').removeClass('popup-overlay-show').addClass('popup-overlay-hide');
        if($(this).data('popup') === 'goto_profile'){
            $('.profile__tabs-header .tab[data-tab=4]').click();
        }
        if($(this).data('popup') === 'confirm_prize'){
            $('.popup__'+$(this).data('popup')).children('.popup__title').html('');
            /!*$('.popup__'+$(this).data('popup')).children('.popup__desc').html('');*!/
            $('.popup__'+$(this).data('popup')).find('.popup__radio--list-item[data-id="price"]').html('');
            $('.popup__'+$(this).data('popup')).children('.js-open__other_popup').removeAttr('data-objname');
            $(this).removeAttr('data-popup');
        }
        if($(this).data('popup') === 'delete_account'){
          $.ajax({
              type: "GET",
              url: "/vet/reco/delete",
              success: function (response) {
                $.ajax({
                    type: "GET",
                    url: "/vet/reco/logout",
                    success: function (response) {
                        location.reload();
                    },
                });
              },
          });
        }
        if($(this).data('popup') === 'choose_contacts'){
            $('.popup__'+$(this).data('popup')+' form')[0].reset();
            $('.popup__'+$(this).data('popup')+' form input[type=radio]').val('');
            $(this).removeAttr('data-popup');
        }
        if($(this).data('popup') === 'info_prize'){
            $('.popup__'+$(this).data('popup')).children('.popup__title').html('');
            $('.popup__'+$(this).data('popup')).children('.popup__desc').html('');
            $(this).removeAttr('data-popup');
        }
        if($(this).data('popup') === 'message'){
            $('.popup__'+$(this).data('popup')).children('.popup__title').html('');
            $('.popup__'+$(this).data('popup')).children('.popup__desc').text('');
            if ($(this).data('act') && $(this).data('act') === "show_status" && $('.form__passport-content').length){
                var status = "<div class='form__passport-status under_consideration'><div class='icon'></div><p>На рассмотрении</p></div>";
                $('.form__passport-content').animate({
                    step: $('.form__passport-content').slideUp(300)
                }, 300, function(){
                    $('.form__passport-content').html(status);
                    $('.form__passport-content').slideDown(300)
                });
            }
        }

        if (getUrlParameter('first') === 'true') {
            removeParam();
        }


        $('.popup').hide();

    });
    $('.js-open__other_popup').click(function(e){
        e.preventDefault();
        var datapopup = $(this).data('popup');
        $('.popup').animate({
            step: $('.popup').hide(300)
        }, 300, function(){
            $('.popup').hide();
            $('.popup__'+datapopup).show(300);
        });
    });




    if (window.location.search){
        if (getUrlParameter('first') === 'true') {
            $('.popup-overlay').removeClass('popup-overlay-hide').addClass('popup-overlay-show');
            $('.popup__first_login').show();
        }
    }*/


})(jQuery);


function open_modal(e) {
  $('#'+ e).addClass('show');
  $('body').addClass('ov-hid');
}
function close_modal() {
  $('.modalDialog').removeClass('show');
  $('body').removeClass('ov-hid');
  remove_hash_from_url();
}
function remove_hash_from_url()
{
  var uri = window.location.toString();
  if (uri.indexOf("#") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("#"));
    window.history.replaceState({}, document.title, clean_uri);
  }
}

$(document).ready(function() {
  $.validator.addMethod('checkSymbols', function (value, element) {
    return this.optional(element) || /^[а-яА-ЯеЁa-zA-Z0-9-]*$/i.test(value);
  }, 'Только русские, латинские символы, цифры и тире');

  $.extend(jQuery.validator.messages, {
    required: "Это поле обязательно для заполнения.",
    minlength: "Пожалуйста введите не менее {0} символов",
  });

  $('#formSaveCalendar').validate({
    rules:{
      name: {
        required : true,
        minlength: 3,
      },
    },
    focusInvalid: true,
    errorClass: "validate-error",
    errorElement: "span",
    onfocusout: function (element) {
      this.element(element);
    },
    submitHandler: function(form) {
      $.ajax({
        type: "POST",
        url: '',
        success: function success(response) {
          close_modal();
          open_modal('massageModal');
          /*var message = 'Обращение успешно отправлено';
          if (response[0].message){
            message = response[0].message;
          }
          $('.popup__message .popup__desc').text(message);
          $('.popup__message').show();
          $('.popup-overlay').removeClass('popup-overlay-hide').addClass('popup-overlay-show');*/
        },
        error: function error(response) {}
      });
    }
  });

  $('#formAddParent').validate({
    rules:{
      name: {
        required : true,
        checkSymbols: true,
        minlength: 3,
      },
    },
    focusInvalid: true,
    errorClass: "validate-error",
    errorElement: "span",
    onfocusout: function (element) {
      this.element(element);
    },
    submitHandler: function(form) {
      $.ajax({
        type: "POST",
        url: '',
        success: function success(response) {
          if ($("#myPet").is(":checked")){
            setTimeout(() => {
              window.location.href = "/myPets.html";
            }, 300);
          } else {
            close_modal();
          }
        },
        error: function error(response) {}
      });
    }
  });

  $('#formDeleteParent').validate({
    submitHandler: function(form) {
      $.ajax({
        type: "POST",
        url: '',
        success: function success(response) {
          close_modal();
          open_modal('massageModal');
        },
        error: function error(response) {}
      });
    }
  });

  $('#formDeletePosterity').validate({
    submitHandler: function(form) {
      $.ajax({
        type: "POST",
        url: '',
        success: function success(response) {
          close_modal();
          open_modal('massageModal');
        },
        error: function error(response) {}
      });
    }
  });

  $('#formDeleteComputation').validate({
    submitHandler: function(form) {
      $.ajax({
        type: "POST",
        url: '',
        success: function success(response) {
          close_modal();
          open_modal('massageModal');
        },
        error: function error(response) {}
      });
    }
  });
});