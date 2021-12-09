$(document).ready(function() {
  if ($(".posterityPage")){
    $("body").addClass("dtpPet");
  }
});

/*Форма добавления питомца*/

$(document).ready(function() {
  $.validator.addMethod('checkSymbols', function (value, element) {
    return this.optional(element) || /^[а-яА-ЯеЁa-zA-Z0-9-]*$/i.test(value);
  }, 'Только русские, латинские символы, цифры и тире');

  $.extend(jQuery.validator.messages, {
    required: "Это поле обязательно для заполнения.",
    minlength: "Пожалуйста введите не менее {0} символов",
  });

  $('#petForm').validate({
    rules:{
      name: {
        required : true,
        checkSymbols: true,
        minlength: 3,
      },
      date:{
        required: true,
      },
      breed:{
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
          /*var message = 'Питомец успешно добавлен';
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

/*Dropzone*/

Dropzone.autoDiscover = false;
Dropzone.prototype.defaultOptions.dictFileTooBig = "Файл слишком большой ({{filesize}}MB). Максимальный размер файла: {{maxFilesize}}MB.";
Dropzone.prototype.defaultOptions.dictFallbackMessage = "Ваш браузер не поддерживает drag'n'drop загрузку файлов.";
Dropzone.prototype.defaultOptions.dictFallbackText = "Что-то пошло не так.";
Dropzone.prototype.defaultOptions.dictInvalidFileType = "Неверный формат файла. Разрешенные форматы: png, jpg, jpeg";
Dropzone.prototype.defaultOptions.dictResponseError = "Что-то пошло не так";
Dropzone.prototype.defaultOptions.dictMaxFilesExceeded = "Что-то пошло не так";

$(document).ready(function() {

  $("#petImgDropzone").dropzone({
    url: "/",
    autoProcessQueue: false,
    uploadMultiple: false,
    addRemoveLinks: true,
    parallelUploads: 1,
    maxFiles: 1,
    maxFilesize: 3,
    acceptedFiles: ".png,.jpg,.jpeg",
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
  $(".petPage_calendar").datepicker($.datepicker.regional["ru"]);
  $(".petPage_calendar").datepicker().datepicker("setDate", new Date());
  /*return datepicker.regional['ru'];*/
});

/*Смена селектов и стилей при нажатии radio button */

$(document).ready(function() {
  $.each(pets.cats, function (index, item) {
    $('#petPageBreed').append($("<option value=\"" + item + "\">" + item + "</option>"));
  });

  $('.radio').on('change', radioChange);

  function radioChange() {
    if($("#radioCats").is(":checked")){
      $('#petPageBreed').empty();
      $('.select-styled, .select-options').remove();
      $.each(pets.cats, function (index, item) {
        $('#petPageBreed').append($("<option value=\"" + item + "\">" + item + "</option>"));
      });
      selectChange();
    } if ($("#radioDogs").is(":checked")){
      $('#petPageBreed').empty();
      $('.select-styled, .select-options').remove();
      $.each(pets.dogs, function (index, item) {
        $('#petPageBreed').append($("<option value=\"" + item + "\">" + item + "</option>"));
      });
      selectChange();
    };
  }

  function selectChange() {
    $('#petPageBreed').each(function(){
      var $this = $(this), numberOfOptions = $(this).children('option').length;
      $this.removeClass('select-hidden');

      $this.addClass('select-hidden');
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
  }
});

/*Кастомный селект*/

$(document).ready(function() {
  var breed;

  $('#petPageBreed').on('changed', function(e){
    breed = this.value;
    console.log(breed);
    return breed;
  });

  $('#petPageBreed').each(function(){
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

/*Список пород*/

var pets = {
  cats: ["Абиссинская", "Австралийский мист", "Азиатская (табби)", "Американская жесткошерстная", "Американская короткошерстная",
  "Американский бобтейл", "Американский керл короткошерстный", "Американский керл длинношерстный", "Анатолийская", "Аравийский мау",
  "Балинезийская", "Бенгальская", "Бирманская", "Бомбейская", "Бразильская длинношерстная", "Бразильская короткошерстная ",
  "Британская короткошерстная", "Британская длинношерстная", "Бурманская", "Бурмилла длинношерстная", "Бурмилла короткошерстная",
  "Гавана браун", "Гигантская афродита", "Гималайская", "Девон-рекс", "Домашняя", "Донской сфинкс", "Европейская короткошерстная",
  "Египетский мау", "Йорк", "Калифорнийская сияющая", "Канаани", "Канадский сфинкс", "Као мани", "Карельский бобтейл", "Карликовый бобтейл",
  "Картезианская", "Кельтская", "Кимрик", "Колорпойнт", "Корат", "Корниш-рекс", "Курильский бобтейл", "Лаперм длинношерстный",
  "Лаперм короткошерстный", "Ликой", "Мандарин", "Манчкин длинношерстная", "Манчкин короткошерстная", "Мейн-кун", "Меконгский бобтейл",
  "Минскин", "Мэнкс", "Мэнская кошка", "Наполеон", "Невская маскарадная", "Немецкий рекс", "Нибелунг", "Норвежская лесная", "Орегон-рекс",
  "Ориентальная короткошерстная", "Ориентальная длинношерстная", "Оцикет", "Персидская", "Петерболд", "Петербургский сфинкс",
  "Пикси-боб длинношерстный", "Писки-боб короткошерстный", "Рагамаффин", "Русская голубая", "Рэгдолл", "Саванна", "Священная бирма",
  "Сейшельская длинношерстная", "Сейшельская короткошерстная", "Селкирк-рекс длинношерстный", "Селкирк-рекс короткошерстный", "Серенгети",
  "Сиамская", "Сибирская", "Сингапурская", "Скоттиш страйт", "Скукум", "Сноу-шу", "Сококе", "Сомалийская", "Сфинкс", "Тайская", "Той-боб",
  "Тойгер", "Тонкинская", "Турецкая ангора", "Турецкий ван", "Украинский левкой", "Уральский рекс длинношерстный", "Уральский рекс короткошерстный",
  "Форин вайт", "Хайленд фолд", "Цейлонская", "Чаузи", "Шантильи тиффани", "Шартрез", "Шиншилла", "Шотландская вислоухая", "Шотландская кошка",
  "Шотландская прямоухая", "Эгейская кошка", "Экзотическая", "Эльф", "Яванская", "Японский бобтейл длинношерстный", "Японский бобтейл короткошерстный",
  ],
  dogs: ["Австралийская овчарка", "Австралийская короткохвостая пастушья собака", "Австралийский келпи", "Австралийский силки терьер",
  "Австралийский терьер", "Австралийский хиллер", "Австралийский шелковистый терьер", "Азавак", "Акита", "Алабай", "Аляскинский маламут",
  "Американская акита", "Американская жесткошерстная", "Американская миниатюрная овчарка", "Американский бульдог", "Американский водяной спаниель",
  "Американский голый терьер", "Американский кокер-спаниель", "Американский стаффордширский терьер", "Американский фоксхаунд",
  "Английский бульдог", "Английский кокер-спаниель", "Английский мастиф", "Английский пойнтер", "Английский спрингер-спаниель",
  "Английский той терьер", "Англо-французская малая гончая", "Аргентинский дог", "Арьежский бракк", "Аусси", "Афганская борзая", "Аффенпинчер",
  "Барбет", "Басенджи", "Бассет хаунд", "Бедлингтон-терьер", "Белая швейцарская овчарка", "Бельгийская овчарка", "Бельгийский гриффон",
  "Бернский зенненхуд", "Бивер терьер", "Бигль харьер", "Бишгль", "Бишон фризе", "Бладхаунд", "Богемская овчарка", "Болонез",
  "Большая англо-французская бело-оранжевая гончая", "Большая англо-французская бело-черная гончая", "Большая англо-французская трехцветная гончая",
  "Большой вандейский грифон", "Большой мюнстерлендер", "Большой швейцарский зенненхунд", "Бордер терьер", "Бордер-колли", "Бордоский дог",
  "Бородатая колли", "Босерон", "Бразильский терьер", "Бретонский эпаньоль", "Бриар", "Брохольмер", "Брюссельский гриффон", "Бульдог",
  "Бульмастиф", "Бультерьер", "Бультерьер миниатюрный", "Бурбонский бракк", "Бурбуль", "Бургосская легавая", "Бурят-монгольская собака",
  "Веймаранер", "Веймаранер длиннокошерстный", "Веймаранер короткошерстный", "Вельш терьер", "Вельш-корги-кардиган", "Вельш-корги-пемброк",
  "Вельш-спрингер-спаниель", "Венгерская выжла", "Венгерская жесткошёрстная выжла", "Вест хайленд уаит терьер", "Веттерхун",
  "Восточно - европейская овчарка", "Голландская овчарка", "Голландский схапендоес", "Голубой пикардийский спаниель", "Горная собака атласа",
  "Грейхаунд", "Гренландская собака", "Гриффон Кортальса", "Далматин", "Датский брохольмер", "Датско-шведская фермерская собака",
  "Дворняжка", "Денди динмонт терьер", "Джек рассел терьер", "Дирхаунд", "Доберман", "Дратхаар", "Дрентская куропаточная собака", "Евразиер",
  "Европейская короткошерстная", "Золотистый ретривер", "Ирландский водяной спаниель", "Ирландский волкодав", "Ирландский глен оф имал терьер",
  "Ирландский красно-белый сеттер", "Ирландский красный сеттер", "Ирландский мягкошерстный пшеничный терьер", "Ирландский терьер",
  "Исландская овчарка", "Испанская водяная собака", "Итальянский бракк", "Итальянский сегуджио короткошерстный", "Йоркширский терьер",
  "Ка де бо", "Кавалер-кинг-чарльз-спаниель", "Кавказская овчарка", "Кай", "Кангальская овчарка", "Кане-корсо", "Кастро лаборейру",
  "Керн терьер", "Керри-блю-терьер", "Кинг-чарльз-спаниель", "Кисю", "Китайская хохлатая собака", "Кламбер-спаниель", "Коикерхондье",
  "Колли длинношерстный", "Колли короткошерстный", "Комондор", "Континентальный бульдог", "Корейская собака джиндо", "Крашская овчарка",
  "Кроличья такса гладкошерстная", "Кроличья такса длинношерстная", "Кроличья такса жесткошерстная", "Ксолоитскуинтли", "Кувас", "Курцхаар",
  "Курчавошёрстный ретривер", "Лабрадор-ретривер", "Лавретка", "Лаготто-романьоло", "Лайкленд-терьер", "Лангхаар", "Ландзир",
  "Ланкаширский хилер", "Лапландская оленегонная собака", "Лейкленд терьер", "Леонбергер", "Малый брабансон", "Мальтезе", "Мареммо-абруцкая овчарка",
  "Маремо-абруцкая овчарка", "Мастиф", "Миниатюрный бультерьер", "Мопс", "Московская сторожевая", "Муди", "Мюнстерлендер малый",
  "Неаполитанский мастиф", "Немецкая овчарка", "Немецкая щетинистая легавая", "Немецкий боксер", "Немецкий брак", "Немецкий вахтельхунд",
  "Немецкий док", "Немецкий дратхаар", "Немецкий охотничий терьер", "Немецкий пинчер", "Немецкий шпиц", "Немецкий ягдтерьер",
  "Новошотландский ретривер", "Норботен шпиц", "Норвежский бухунд", "Норвежский линдехунд", "Норвежский элькхунд серый", "Норвежский элькхунд черный",
  "Норвич терьер", "Норфолк-терьер", "Ньюфаундленд", "Овернская легавая", "Оленегонный шпиц", "Оттерхауно", "Парсон рассел терьер", "Пекинес",
  "Перуанская голая собака", "Пикардийская овчарка", "Пикардийский спаниель", "Пиренейская горная собака", "Пиренейская овчарка длинношерстная",
  "Пиренейская овчарка краткошерстная", "Пиренейский мастиф", "Поденко ибиценко", "Польская гончая", "Польская низинная овчарка",
  "Польская подгалянская овчарка", "Померанский шпиц", "Понт-одемерский спаниель", "Португальская водяная собака", "Португальская овчарка",
  "Португальский бракк", "Пражский крысарик", "Преса канарио", "Прямошёрстный ретривер", "Пудель", "Пудель-пойнтер", "Пули", "Пуми",
  "Ризеншнауцер", "Родезийский риджбек", "Ротвейлер", "Румынская карпатская овчарка", "Румынская овчарка Миоритик", "Русская псовая борзая",
  "Русская салонная собака", "Русская цветная болонка", "Русский той", "Русский черный терьер", "Салюки", "Самоед", "Сегуджио мареммано",
  "Сенбернар", "Сен-жерменский брак", "Сен-мигельский фила", "Сеттер Льюэллина", "Сиба", "Сибирский хаски", "Сибирский хаски", "Сикоку",
  "Силихем терьер", "Скай терьер", "Скотч терьер", "Словацкий грубошёрстный ставач", "Словацкий чувач", "Слюги", "Спиноне",
  "Среднеазиатская овчарка", "Стабихун", "Старо-английская овчарка Бобтейл", "Староанглийская овчарка", "Стародатский пойнтер",
  "Стаффордширский бультерьер", "Суссекс-спаниель", "Схиперке", "Тазы", "Тайваньская собака", "Тайган", "Тайский бангкэу", "Тайский риджбек",
  "Такса гладкошерстная", "Такса длинношерстная", "Такса жесткошерстная", "Такса карликовая гладкошерстная", "Такса карликовая длиннокошерстная",
  "Такса карликовая жесткошерстная", "Тибетский мастиф", "Той-фоктерьер", "Тоса", "Уиппет", "Уругвайский симаррон", "Фараонова собака",
  "Филд-спаниель", "Фландрский бувье", "Фогстерьер", "Фокстерьер гладкошерстный", "Фокстерьер длинношерстный", "Французская бело-оранжевая гончая",
  "Французский бракк", "Французский бульдог", "Французский эпаньёль", "Хальденская гончая", "Ханаанская собака", "Харьер", "Хоккайдо",
  "Хорватская овчарка", "Хортая борзая", "Хотошо", "Хюгенхунд", "Цвергпинчер", "Цвергшнауцер", "Чау-чау", "Черногорская гора гончая",
  "Черно-подпалый кунхаунд", "Чесапик бэй ретривер", "Чехословацкая волчья собака", "Чешский терьер", "Чешский фоусек", "Чирнеко дэль’Этна",
  "Чукотская ездовая", "Чунцин", "Шакало-псовая собака-Шалайка", "Шведский Вальхунд", "Шелти", "Шарпей", "Шнауцер", "Шотландский сеттер",
  "Энтлебухер зенненхуд", "Эрдельтерьер", "Эштрельская горная собака", "Южнорусская овчарка", "Якутская лайка", "Японский терьер",
  "Японский хин", "Японский шпиц",]
}