"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 *  Модуль занимается синхронизацией тестового поля и селектов фенотипа
 *  Также он устанвливает в document.male и document.female массивы выбранных значений в селектах
 */
(function ($) {
  $.extend($.fn, {
    phenotypic: function phenotypic() {
      $(this).each(function () {
        var form = $(this),
          selects = $('.js-phen-select', form),
          selectValues = {},
          textCode = $('.js-text-code', form);
        selects.on('changed updated-handle', function () {
          var select = $(this),
            name = select.attr('name');
          selectValues[name] = select.val();
          var keys = ['breed', 'color', 'silver', 'white', 'image', 'points'];
          var valuesArr = keys.map(function (key) {
            return selectValues[key] && !['hide', 'no drawing', 'no spots', 'no silver', 'no points'].includes(selectValues[key]) ? (key === 'breed' || key === 'silver' && selectValues['color'] && selectValues['color'] !== 'hide' ? '' : ' ') + selectValues[key] : null;
          }).filter(function (item) {
            return !!item;
          });
          textCode.val(valuesArr.join(''));
          setResult(selectValues);

          if (name === 'white' && !['hide', 'no spots'].includes(select.val())) {
            var colorSelect = selects.filter('[name="color"]');

            if (colorSelect.val() === 'w') {
              colorSelect.val('hide').trigger('updated-handle');
            }
          }

          if (name === 'color') {
            var whiteSelect = selects.filter('[name="white"]');

            if (select.val() !== 'w') {
              if (whiteSelect.val() === 'hide') {
                whiteSelect.val('no spots').trigger('updated-handle');
              }
            } else {
              whiteSelect.val('hide').trigger('updated-handle');
            }
          }
        });
        selects.on('updated', function () {
          var select = $(this),
            name = select.attr('name');
          selectValues[name] = select.val();
          setResult(selectValues);
        });
        textCode.on('input', function () {
          var reg = /([a-zA-Z]{3})?\s?([a-zA-Z])?\s?([sS]?)\s?(\d{2})?\s?(\d{2})?\s?(\d{2})?/,
            values = $(this).val().match(reg),
            numbers = [values[4], values[5], values[6]],
            numbersSorted = _toConsumableArray(new Array(3));

          if (values[2] && values[2].toLowerCase() === 's' && !values[3]) {
            values[3] = values[2];
            values[2] = '';
          }

          for (var i = 0; i < numbers.length; i++) {
            if (!numbers[i]) continue;
            var number = numbers[i],
              dec = Math.floor(number / 10);
            numbersSorted[dec - 1 < 0 ? 0 : dec - 1] = number || undefined;
          }

          var valuesHash = values ? {
            breed: values[1],
            color: values[2],
            silver: values[3],
            white: numbersSorted[0],
            image: numbersSorted[1],
            points: numbersSorted[2]
          } : {
            'breed': ''
          };
          selects.each(function () {
            var $this = $(this),
              name = $this.attr('name'),
              value = valuesHash[name] && valuesHash[name][name === 'breed' ? 'toUpperCase' : 'toLowerCase']() || 'hide';

            if ($this.val() !== value) {
              $this.val(value).triggerHandler('updated');
            }
          });
        });

        function setResult(selectValues) {
          var result = {};
          Object.keys(selectValues).map(function (key) {
            return result[key] = selectValues[key] !== 'hide' ? selectValues[key] : '';
          });
          document[form.data('value')] = result;
        }
      });
    }
  });
})(jQuery);
"use strict";

(function ($) {
  $.extend($.fn, {
    select: function select() {
      $(this).each(function () {
        var $this = $(this);
        $this.addClass('select-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');
        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());
        var $list = $('<ul />', {
          'class': 'select-options'
        }).insertAfter($styledSelect);
        $styledSelect.click(function (e) {
          if ($styledSelect.is('.mod_disabled')) {
            return false;
          }

          e.stopPropagation();
          $('div.select-styled.active').not(this).each(function () {
            $(this).removeClass('active').next('ul.select-options').hide();
          });
          $(this).toggleClass('active').next('ul.select-options').toggle();
        });
        $(document).click(function () {
          $styledSelect.removeClass('active');
          $list.hide();
        });
        generateOptions();
        $this.on('options-updated', function () {
          return generateOptions(true);
        });

        function generateOptions(regenerate) {
          $list.empty();
          $this.off('updated');
          var options = $this.children('option');

          for (var i = 0; i < options.length; i++) {
            var optVal = $this.children('option').eq(i).val();
            $('<li />', {
              "class": optVal !== 'T' && (optVal === 'Ta' || /^[A-Z]+$/.test(optVal)) ? 'not_recessive' : '',
              text: $this.children('option').eq(i).text(),
              rel: optVal
            }).appendTo($list);
          }

          var $listItems = $list.children('li');
          $listItems.click(function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $styledSelect.attr('rel', $(this).attr('rel'));
            $this.val($(this).attr('rel'));
            $list.hide();
            $this.attr('data-value', $this.val());
            $this.trigger('changed');
          });
          $listItems.on('set', function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            var rel = $(this).attr('rel');

            if (rel === 'hide') {
              $styledSelect.removeAttr('rel');
            } else {
              $styledSelect.attr('rel', rel);
            }

            $this.val($(this).attr('rel'));
            $list.hide();
            $this.attr('data-value', $this.val());
            $this.trigger('setted');
          });
          $this.on('updated', function () {
            $listItems.filter('[rel="' + $this.val() + '"]').trigger('set');
          });
          $this.on('updated-handle', function () {
            $listItems.filter('[rel="' + $this.val() + '"]').trigger('set');
          });

          if (!$listItems.filter('[rel="' + $this.val() + '"]').length) {
            $this.val('hide');
            $this.triggerHandler('updated');
          }

          if (regenerate && $listItems.length === 2) {
            $listItems.eq(1).trigger('set');
          }
        }
      });
    }
  });
})(jQuery);
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

(function ($) {
  var formModules = $('.js-form-module'),
    phenSelects = $('.formPhenotypic_select_item select'),
    genSelects = $('.formPhenotypic_genotype_item select'),
    moreArrows = $('.formPhenotypic_more');
  var ajax;
  phenSelects.select();
  genSelects.select();
  formModules.phenotypic();
  phenSelects.on('changed updated', function () {
    var keys = ['breed', 'color', 'silver', 'white', 'image', 'points'],
      data = {};
    data.m = document.male ? keys.map(function (key) {
      return document.male[key];
    }).filter(function (item) {
      return !!item;
    }) : [];
    data.f = document.female ? keys.map(function (key) {
      return document.female[key];
    }).filter(function (item) {
      return !!item;
    }) : [];
    genSelects.next('.select-styled').addClass('mod_loading');
    ajax = $.ajax({
      url: 'https://stag.proplan.ru/breeders/breedcalc/genotype/',
      //'/js/response.json',//
      type: 'post',
      data: JSON.stringify(data),
      dataType: 'json',
      processData: false,
      contentType: false,
      beforeSend: function beforeSend() {
        if (ajax) {
          ajax.abort();
        }
      },
      success: function success(res) {
        genSelects.next('.select-styled').removeClass('mod_loading');

        if (res.result === "success") {
          setGenSelects(res.data);
        }
      }
    });
  });
  moreArrows.on('click', function () {
    var $this = $(this),
      block = $this.closest('.formPhenotypic_cat').find('.formPhenotypic_select_list');
    $this.add(block).toggleClass('active');
  });
  var maleForm = $('.js-form-module-male'),
    maleGenSelects = $('.js-gen-select', maleForm),
    femaleForm = $('.js-form-module-female'),
    femaleGenSelects = $('.js-gen-select', femaleForm);
  /**
   * Сохранение дефолтных опшенов генов
   */

  var mDefaultGenSelects = [];
  var fDefaultGenSelects = [];
  maleGenSelects.each(function (i) {
    mDefaultGenSelects[i] = [];
    $(this.options).each(function () {
      if (this.value !== 'hide') mDefaultGenSelects[i].push(this.value);
    });
  });
  femaleGenSelects.each(function (i) {
    fDefaultGenSelects[i] = [];
    $(this.options).each(function () {
      if (this.value !== 'hide') fDefaultGenSelects[i].push(this.value);
    });
  });
  /**
   *  Функция установливает опшены для селектов генов, на основе полученных от сервера данных
   *  Вызывается при изменении слектов фенотипа, после получения ответа от сервера
   */

  function setGenSelects(data) {
    var malePairs = data.maleGenes,
      femalePairs = data.femaleGenes;

    var generateOptions = function generateOptions(_ref) {
      var pairsList = _ref.pairsList,
        selects = _ref.selects;
      pairsList.map(function (pairs, index) {
        var select1 = selects.eq(index * 2),
          select2 = selects.eq(index * 2 + 1);

        var select1Options = _toConsumableArray(new Set(pairs.length && pairs.filter(function (item) {
            return !!item[0] && item[0] !== '_';
          }).map(function (item) {
            return item[0];
          }).sort())),
          select2Options = _toConsumableArray(new Set(pairs.length && pairs.filter(function (item) {
            return !!item[1] && item[1] !== '_';
          }).map(function (item) {
            return item[1];
          }).sort()));

        if (!select1Options.length) {
          select1Options = mDefaultGenSelects[index * 2];
          select2Options = fDefaultGenSelects[index * 2 + 1];
        }

        select1.find('option').not('[value="hide"]').remove();
        select2.find('option').not('[value="hide"]').remove();
        select1Options.map(function (item) {
          select1.append($('<option/>', {
            value: item
          }).text(item));
        });
        select2Options.map(function (item) {
          select2.append($('<option/>', {
            value: item
          }).text(item));
        });
        select1.triggerHandler('options-updated');
        select2.triggerHandler('options-updated');
      });
    };

    generateOptions({
      pairsList: malePairs,
      selects: maleGenSelects
    });
    generateOptions({
      pairsList: femalePairs,
      selects: femaleGenSelects
    });
  }
  /**
   *  Проверка на рецессивность гена в паре
   */


  var recessiveGens = function recessiveGens(_ref2) {
    var selects = _ref2.selects;
    selects.on('changed', function () {
      var select = $(this),
        value = select.val(),
        index = selects.index(select),
        nextSelect = selects.eq(index + 1),
        nextStyled = nextSelect.next('.select-styled'),
        isFirstInPair = index % 2 === 0,
        isRecessive = ["a", "b", "b'", "cb", "cs", "d", "i", "o", "T", "tb", "Ws", "w"].includes(value);
      nextStyled.removeClass('mod_disabled').siblings('.select-options').removeClass('mod_recessive');

      if (isFirstInPair && isRecessive && nextSelect.children("[value=\"".concat(value, "\"]")).length) {
        if (!['Ws'].includes(value)) {
          nextSelect.val(value).triggerHandler('updated');
        }

        if (!['b', 'cb', 'T', 'Ws'].includes(value)) {
          nextStyled.addClass('mod_disabled');
        } else {
          nextStyled.siblings('.select-options').addClass('mod_recessive');
        }
      }
    });
  };

  recessiveGens({
    selects: maleGenSelects
  });
  recessiveGens({
    selects: femaleGenSelects
  });
  /**
   * Блок обрабатывает значения селектов генов
   * Проверяет, выполнены ли минимальные требования для рассчетов
   * Если выполнены, разблокирует кнопку показа результатов
   */

  var calculateBtn = $('.js-calculate-btn'),
    colorGenIndexes = [11, 12],
    imageGenIndexes = [1, 2, 13, 14],
    silverGenIndexes = [9, 10],
    whiteGenIndexes = [15, 16],
    pointGenIndexes = [5, 6];

  var maleAllSelectedGens = [],
    femaleAllSelectedGens = [],
    maleSelectedGens = {
      colorGens: {
        list: [],
        filled: false
      },
      imageGens: {
        list: [],
        filled: false
      },
      silverGens: {
        list: [],
        filled: false
      },
      whiteGens: {
        list: [],
        filled: false
      },
      pointGens: {
        list: [],
        filled: false
      }
    },
    femaleSelectedGens = _objectSpread({}, maleSelectedGens);

  maleGenSelects.on('changed setted', function (e) {
    var values = {},
      getGens = function getGens(indexes) {
        return indexes.map(function (index) {
          return values[index];
        }).filter(function (item) {
          return !!item;
        });
      },
      setSelectedGens = function setSelectedGens(_ref3) {
        var type = _ref3.type,
          indexes = _ref3.indexes;
        var gens = getGens(indexes);
        maleSelectedGens = _objectSpread({}, maleSelectedGens, {}, _defineProperty({}, type, {
          list: gens,
          filled: gens.length === indexes.length
        }));
      };

    maleAllSelectedGens = [];
    maleGenSelects.each(function (index) {
      var select = $(this),
        value = select.attr('data-value');
      maleAllSelectedGens = [].concat(_toConsumableArray(maleAllSelectedGens), [['hide', '_'].includes(value) ? '' : value]);

      if (!['hide', '_'].includes(value)) {
        values[index + 1] = value;
      }
    });
    setSelectedGens({
      type: 'colorGens',
      indexes: colorGenIndexes
    });
    setSelectedGens({
      type: 'imageGens',
      indexes: imageGenIndexes
    });
    setSelectedGens({
      type: 'silverGens',
      indexes: silverGenIndexes
    });
    setSelectedGens({
      type: 'whiteGens',
      indexes: whiteGenIndexes
    });
    setSelectedGens({
      type: 'pointGens',
      indexes: pointGenIndexes
    });
    compareMaleAndFemaleGens();
    if (e.type === 'changed') setPhenSelects();
  });
  femaleGenSelects.on('changed setted', function (e) {
    var values = {},
      getGens = function getGens(indexes) {
        return indexes.map(function (index) {
          return values[index];
        }).filter(function (item) {
          return !!item;
        });
      },
      setSelectedGens = function setSelectedGens(_ref4) {
        var type = _ref4.type,
          indexes = _ref4.indexes;
        var gens = getGens(indexes);
        femaleSelectedGens = _objectSpread({}, femaleSelectedGens, {}, _defineProperty({}, type, {
          list: gens,
          filled: gens.length === indexes.length
        }));
      };

    femaleAllSelectedGens = [];
    femaleGenSelects.each(function (index) {
      var select = $(this),
        value = select.attr('data-value');
      femaleAllSelectedGens = [].concat(_toConsumableArray(femaleAllSelectedGens), [['hide', '_'].includes(value) ? '' : value]);

      if (!['hide', '_'].includes(value)) {
        values[index + 1] = value;
      }
    });
    setSelectedGens({
      type: 'colorGens',
      indexes: colorGenIndexes
    });
    setSelectedGens({
      type: 'imageGens',
      indexes: imageGenIndexes
    });
    setSelectedGens({
      type: 'silverGens',
      indexes: silverGenIndexes
    });
    setSelectedGens({
      type: 'whiteGens',
      indexes: whiteGenIndexes
    });
    setSelectedGens({
      type: 'pointGens',
      indexes: pointGenIndexes
    });
    compareMaleAndFemaleGens();
    if (e.type === 'changed') setPhenSelects();
  });

  var compareMaleAndFemaleGens = function compareMaleAndFemaleGens() {
    var types = Object.keys(maleSelectedGens);
    var maleFilledGenTypes = types.map(function (type) {
      return maleSelectedGens[type].filled;
    });
    var femaleFilledGenTypes = types.map(function (type) {
      return femaleSelectedGens[type].filled;
    });
    var resultsCanBeShowed = maleFilledGenTypes.filter(function (item, index) {
      return item && femaleFilledGenTypes[index] === item;
    }).length;

    if (resultsCanBeShowed) {
      calculateBtn.removeAttr('disabled');
    } else {
      calculateBtn.attr('disabled', true);
    }
  };

  var malePhenSelects = formModules.filter('.male').find('.formPhenotypic_select_item select'),
    femalePhenSelects = formModules.filter('.female').find('.formPhenotypic_select_item select');
  var phenAjax;

  var setPhenSelects = function setPhenSelects() {
    var maleGenSelectsVal = [],
      femaleGenSelectsVal = [];
    maleGenSelects.each(function () {
      maleGenSelectsVal.push(this.value);
    });
    femaleGenSelects.each(function () {
      femaleGenSelectsVal.push(this.value);
    });
    var mailGensPairs = maleGenSelectsVal.map(function (item) {
        return item !== 'hide' && item || '_';
      }),
      femailGensPairs = femaleGenSelectsVal.map(function (item) {
        return item !== 'hide' && item || '_';
      });
    var data = {
      m: mailGensPairs,
      f: femailGensPairs
    };
    phenAjax = $.ajax({
      url: 'https://stag.proplan.ru/breeders/breedcalc/fenotype/',
      type: 'post',
      data: JSON.stringify(data),
      dataType: 'json',
      processData: false,
      contentType: false,
      beforeSend: function beforeSend() {
        if (phenAjax) {
          phenAjax.abort();
        }
      },
      success: function success(response) {
        if (response.result === 'success') {
          var _response$data = response.data,
            maleFenotype = _response$data.maleFenotype,
            femaleFenotype = _response$data.femaleFenotype;
          maleFenotype.forEach(function (item) {
            return malePhenSelects.each(function () {
              var option = $(this).children('option').filter("[value=\"".concat(item, "\"]"));
              if (option.length) $(this).val(item).trigger('updated-handle');
            });
          });
          femaleFenotype.forEach(function (item) {
            return femalePhenSelects.each(function () {
              var option = $(this).children('option').filter("[value=\"".concat(item, "\"]"));
              if (option.length) $(this).val(item).trigger('updated-handle');
            });
          });
        }
      },
      error: function error(err) {},
      complete: function complete() {}
    });
  };
  /**
   * Получение шансов
   */


  calculateBtn.on('click', function () {
    var maleGenSelectsVal = [],
      femaleGenSelectsVal = [];
    maleGenSelects.each(function () {
      maleGenSelectsVal.push($(this).attr('data-value'));
    });
    femaleGenSelects.each(function () {
      femaleGenSelectsVal.push($(this).attr('data-value'));
    });
    var mailGensPairs = maleGenSelectsVal.map(function (item) {
        return item !== 'hide' && item || '_';
      }),
      femailGensPairs = femaleGenSelectsVal.map(function (item) {
        return item !== 'hide' && item || '_';
      });
    var data = {
      m: mailGensPairs,
      f: femailGensPairs
    };
    $.ajax({
      url: 'https://stag.proplan.ru/breeders/breedcalc/chances/',
      //'/js/response.json',//
      type: 'post',
      data: JSON.stringify(data),
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function success(response) {
        if (response.result === 'success') {
          setChances(response.data);
        }
      },
      error: function error(err) {},
      complete: function complete() {}
    });
  });
  var chancesContainer = $('#chancesContainer'),
    chancesArea = $('#chancesArea'),
    phenOptions = phenSelects.find('option'),
    blockCaptions = {
      'mainColorChances': 'Основной окрас',
      'drawingChances': 'Рисунок окраса',
      'silverChances': 'Серебро в окрасе',
      'spotChances': 'Белые пятна в окрасе',
      'pointChances': 'Поинтовый окрас'
    };

  var setChances = function setChances(data) {
    var needIndexes = ['mainColorChances', 'drawingChances', 'silverChances', 'spotChances', 'pointChances'],
      blocksData = Object.entries(data).map(function (item) {
        var name = item[0],
          chances = item[1];
        var blockItems = [];

        if (needIndexes.includes(name)) {
          if (name === 'mainColorChances') {
            var m = chances.m,
              f = chances.f;
            var items = m || {};
            blockItems = Object.entries(items).map(function (item) {
              var itemName = item[0],
                itemValue = item[1],
                fItemValue = f[itemName],
                itemCaption = phenOptions.filter("[value=\"".concat(itemName, "\"]")).eq(0).text();
              if ((!itemValue || itemValue === '0%') && (!fItemValue || fItemValue === '0%')) return null;
              return "\n                <li class=\"resultPhenotypic_item base\">\n                  <div class=\"resultPhenotypic_name\" data-value=\"".concat(itemName, "\">").concat(itemCaption, "</div>\n                  <div class=\"resultPhenotypic_row\">\n                    <div class=\"resultPhenotypic_gender\">\u041A\u043E\u0442\u044B</div>\n                    <div class=\"resultPhenotypic_value\">").concat(itemValue, "</div>\n                  </div>\n                  <div class=\"resultPhenotypic_row\">\n                    <div class=\"resultPhenotypic_gender\">\u041A\u043E\u0448\u043A\u0438</div>\n                    <div class=\"resultPhenotypic_value\">").concat(fItemValue, "</div>\n                  </div>\n                </li>\n              ");
            });
          } else {
            var _items = chances.length && chances[0] || {},
              sortedItems = [];
            /*Object.keys(items)
              .sort((a, b) => parseInt(a, 10) || 0 - parseInt(b, 10) || 0)
              .forEach(key => sortedItems[key] = items[key])*/


            blockItems = Object.entries(_items).map(function (item) {
              var itemName = item[0],
                itemValue = item[1],
                itemCaption = phenOptions.filter("[value=\"".concat(itemName, "\"]")).eq(0).text();
              if (!itemValue || itemValue === '0%') return null;
              return "\n                <li class=\"resultPhenotypic_item\">\n                  <div class=\"resultPhenotypic_row\">\n                    <div class=\"resultPhenotypic_name\" data-value=\"".concat(itemName, "\">").concat(itemCaption, "</div>\n                    <div class=\"resultPhenotypic_value\">").concat(itemValue, "</div>\n                  </div>\n                </li>\n              ");
            });
          }

          return "\n            <div class=\"resultPhenotypic_box\">\n              <div class=\"resultPhenotypic_caption\">".concat(blockCaptions[name] || name, "</div>\n              <ul class=\"resultPhenotypic_list\">\n                ").concat(blockItems.join(''), "\n              </ul>\n            </div>\n          ");
        }

        return null;
      });
    chancesContainer.empty().append(blocksData.join(''));
    chancesArea.show();

    var top = $(chancesArea).offset().top;
    $('body,html').animate({scrollTop: top}, 1500);
  };
})(jQuery);