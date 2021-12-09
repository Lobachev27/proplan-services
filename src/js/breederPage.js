/*Форма обратной связи*/

$(document).ready(function() {
  $.validator.addMethod('checkSymbols', function (value, element) {
    return this.optional(element) || /^[а-яА-ЯеЁa-zA-Z-]*$/i.test(value);
  }, 'Только русские, латинские символы и тире');

  $.validator.addMethod('checkEmail', function (value, element) {
    var re = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;
    return this.optional(element) || re.test(String(value).toLowerCase());
  }, 'Некорректный email');

  $.validator.addMethod('checkTelephone', function (value, element) {
    var re = /^7[0-9]{10}$/g;
    return this.optional(element) ||re.test(String(value).toLowerCase());
  }, 'Телефон в формате 7XXXXXXXXXX');

  $.extend(jQuery.validator.messages, {
    required: "Это поле обязательно для заполнения.",
    number: "Только цифры",
    minlength: "Пожалуйста введите не менее {0} символов",
    maxlength: "Пожалуйста введите не более {0} символов",
  });

  $('#formConnect').validate({
    rules:{
      name: {
        required : true,
        checkSymbols: true,
        minlength: 2,
      },
      surname:{
        required: true,
        checkSymbols: true,
        minlength: 2,
      },
      phone:{
        required: true,
        checkTelephone: true,
        number: true,
      },
      email:{
        required: true,
        email:false,
        checkEmail: true,
      },
      theme: {
        required : true,
        minlength: 20,
        maxlength: 100,
      },
      comment: {
        required : true,
        minlength: 100,
        maxlength: 1000,
      },
      personalConfirm:{
        required: true,
      },
      communication:{
        required: true,
      },
      messageEmail:{
        required: true,
      },
      messagePhone:{
        required: true,
      },
      stock:{
        required: true,
      }
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
          open_modal('massageModal')
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
});