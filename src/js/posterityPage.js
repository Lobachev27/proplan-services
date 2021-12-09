$(document).ready(function() {
  if ($(".posterityPage")){
    $("body").addClass("dtp");
  }

  $(".dropzone").click(function(){
    $('.dz-remove').attr('data-dz-remove').val("Удалить файл");
  });

});

/*Количество питомцев в помете*/
var count = 1;
var countEl = document.querySelector(".posterityPage_input.count");
function plus(){
  count++;
  countEl.value = count;
}
function minus(){
  if (count > 1) {
    count--;
    countEl.value = count;
  }
}

/*Кастомный селект*/

$(document).ready(function() {
  var breed;

  $('#petPageBreed').on('changed', function(e){
    breed = this.value;
    console.log(breed);
    return breed;
  });

  $('#posterityPageFather, #posterityPageMother').each(function(){
    var $this = $(this), numberOfOptions = $(this).children('option').length;

    $this.addClass('select-hidden');
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next('div.select-styled');
    $styledSelect.text($this.children('option').eq(0).text());

    var $list = $('<ul />', {
      'class': 'select-options'
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $('<li />', {
        text: $this.children('option').eq(i).text(),
        rel: $this.children('option').eq(i).val()
      }).appendTo($list);
    }

    var $listItems = $list.children('li');

    $styledSelect.click(function(e) {
      e.stopPropagation();
      $('div.select-styled.active').not(this).each(function(){
        $(this).removeClass('active').next('ul.select-options').hide();
      });
      $(this).toggleClass('active').next('ul.select-options').toggle();
    });

    $listItems.click(function(e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass('active');
      $styledSelect.attr('rel', $(this).attr('rel'));
      $this.val($(this).attr('rel'));
      $list.hide();
      $this.trigger('changed');
    });

    $(document).click(function() {
      $styledSelect.removeClass('active');
      $list.hide();
    });
  });
});

/*Форма добавления помета*/

$(document).ready(function() {
  $.extend(jQuery.validator.messages, {
    required: "Это поле обязательно для заполнения.",
    minlength: "Пожалуйста введите не менее {0} символов",
  });

  $('#posterityForm').validate({
    rules:{
      name: {
        required : true,
        checkSymbols: true,
        minlength: 3,
      },
      date:{
        required: true,
      },
      mother:{
        required: true,
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
          open_modal('massageModal');
          /*var message = 'Помет успешно добавлен';
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

/*$(function() {
  Dropzone.autoDiscover = false;
  $(document).ready(function () {
    Dropzone.options.myAwesomeDropzone = {
      maxFilesize: 5,
      addRemoveLinks: true,
      dictResponseError: 'Server not Configured',
      acceptedFiles: ".png,.jpg,.gif,.bmp,.jpeg",
      init:function(){
        var self = this;
        // config
        self.options.addRemoveLinks = true;
        self.options.dictRemoveFile = "Delete";
        //New file added
        self.on("addedfile", function (file) {
          console.log('new file added ', file);
        });
        // Send file starts
        self.on("sending", function (file) {
          console.log('upload started', file);
          $('.meter').show();
        });

        // File upload Progress
        self.on("totaluploadprogress", function (progress) {
          console.log("progress ", progress);
          $('.roller').width(progress + '%');
        });

        self.on("queuecomplete", function (progress) {
          $('.meter').delay(999).slideUp(999);
        });

        // On removing file
        self.on("removedfile", function (file) {
          console.log(file);
        });
      }
    };
  });
})*/

/*Инпут выбор даты*/

$(document).ready(function() {
  /*$(".form_calendar").datepicker({
      dateFormat: "dd.mm.yy",
      minDate: null,
      showButtonPanel: true,
      changeMonth: false,
      changeYear: false,
      defaultDate: "+1w",
    },
  );*/
  $.datepicker.regional['ru'] = {
    closeText: 'Закрыть',
    prevText: '<',
    nextText: '>',
    currentText: 'Сегодня',
    monthNames: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    monthNamesShort: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    weekHeader: 'Нед',
    dateFormat: 'dd.mm.y',
    firstDay: 1,
    minDate: null,
    isRTL: false,
    showMonthAfterYear: false,
    showButtonPanel: true,
    yearSuffix: '',
    changeYear: false,
    changeMonth: false
  };
  $.datepicker.setDefaults($.datepicker.regional['ru']);
  $(".posterityPage_calendar").datepicker($.datepicker.regional["ru"]);
  $(".posterityPage_calendar").datepicker().datepicker("setDate", new Date());
  /*return datepicker.regional['ru'];*/
});

/*Dropzone*/

Dropzone.autoDiscover = false;
Dropzone.prototype.defaultOptions.dictFileTooBig = "Файл слишком большой ({{filesize}}MB). Максимальный размер файла: {{maxFilesize}}MB.";
Dropzone.prototype.defaultOptions.dictFallbackMessage = "Ваш браузер не поддерживает drag'n'drop загрузку файлов.";
Dropzone.prototype.defaultOptions.dictFallbackText = "Что-то пошло не так.";
Dropzone.prototype.defaultOptions.dictInvalidFileType = "Неверный формат файла. Разрешенные форматы: png, jpg, jpeg";
Dropzone.prototype.defaultOptions.dictResponseError = "Что-то пошло не так";
Dropzone.prototype.defaultOptions.dictMaxFilesExceeded = "Что-то пошло не так";

$(document).ready(function() {

  $("#posterityImgDropzone").dropzone({
    url: "/file/post",
    autoProcessQueue: false,
    uploadMultiple: false,
    addRemoveLinks: true,
    /*parallelUploads: 1,*/
    maxFiles: 1,
    maxFilesize: 3,
    acceptedFiles: ".png, .jpg, .jpeg",
    init: function() {
      this.on("error", function(file){
        $(file.previewElement).remove();
        this.removeFile(file);
      });
      this.on("maxfilesexceeded", function(file) {
        this.removeAllFiles();
        this.addFile(file);
      });
    },
  });

  $("#metricsDropzone").dropzone({
    url: "/file/post",
    autoProcessQueue: false,
    uploadMultiple: true,
    addRemoveLinks: true,
    parallelUploads: 20,
    maxFiles: 20,
    acceptedFiles: ".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx",
    init: function() {
      this.on("error", function(file){
        $(file.previewElement).remove();
        this.removeFile(file);
      });
      this.on("maxfilesexceeded", function(file) {
        this.removeAllFiles();
        this.addFile(file);
      });
    },
  });

});
