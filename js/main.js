'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_MAIN_COORDS = {X: 570, Y: 375};
  var TOP_BORDER = 130;
  var BOTTOM_BORDER = 630;
  var POINT_PIN = 22;

  var adForm = document.querySelector('.ad-form');
  var mapSection = document.querySelector('.map');
  var typeSelect = adForm.querySelector('#type');
  var checkInSelect = adForm.querySelector('#timein');
  var checkOutSelect = adForm.querySelector('#timeout');
  var capacitySelect = adForm.querySelector('#capacity');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var mapPins = mapSection.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var addressForm = adForm.address;

  window.map.disabledMap(true);
  window.form.disabledForm(true);

  var onClosePopup = function (event) {
    if (typeof event !== 'undefined') {
      event.preventDefault();
    }
    if (window.currentCard !== null) {
      window.currentCard.remove();
    }
    document.removeEventListener('keydown', window.card.escape);
  };

  var doActivationPage = function () {
    window.map.disabledMap(false);
    window.form.disabledForm(false);
    mapPins.insertBefore(window.map.create(window.data.ads, pinTemplate), mapPinMain);
  };

  var onActivationPage = function (event) {
    event.preventDefault();
    if (mapSection.classList.contains('map--faded')) {
      doActivationPage();
    }
  };

  var onClickReset = function (event) {
    event.preventDefault();
    window.map.disabledMap(true);
    window.form.disabledForm(true);
    window.map.clearMap();
    window.form.clearForm();
    window.pins.position();
    onClosePopup();

    mapPinMain.style.left = PIN_MAIN_COORDS.X + 'px';
    mapPinMain.style.top = PIN_MAIN_COORDS.Y + 'px';
    window.pins.position();
    mapPinMain.addEventListener('mouseup', onActivationPage);
  };

  window.form.test();
  typeSelect.addEventListener('change', window.form.changeType);
  checkInSelect.addEventListener('change', window.form.changeCheckIn);
  checkOutSelect.addEventListener('change', window.form.changeCheckOut);
  capacitySelect.addEventListener('change', window.form.changeCapacity);
  resetButton.addEventListener('click', onClickReset);

  mapPinMain.addEventListener('click', onActivationPage);

  var onMouseMove = function (event) {
    event.preventDefault();
    var mapPinMainParent = mapPinMain.offsetParent;
    var shift = {
      x: startCoords.x - event.clientX,
      y: startCoords.y - event.clientY

    };
    startCoords = {
      x: event.clientX,
      y: event.clientY
    };

    var borders = {
      top: TOP_BORDER - PIN_HEIGHT - POINT_PIN,
      bottom: BOTTOM_BORDER - PIN_HEIGHT - POINT_PIN,
      left: mapPinMainParent.offsetLeft - PIN_WIDTH / 2,
      right: mapPinMainParent.offsetWidth - PIN_WIDTH / 2
    };

    var calculationNewPositionPin = function () {
      var newCoords = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };
      if (newCoords.x > borders.right) {
        newCoords.x = borders.right;
      }
      if (newCoords.x < borders.left) {
        newCoords.x = borders.left;
      }
      if (newCoords.y > borders.bottom) {
        newCoords.y = borders.bottom;
      }
      if (newCoords.y < borders.top) {
        newCoords.y = borders.top;
      }
      return newCoords;
    };

    var newPinCoodrs = calculationNewPositionPin();
    mapPinMain.style.left = newPinCoodrs.x + 'px';
    mapPinMain.style.top = newPinCoodrs.y + 'px';
    addressForm.value = (newPinCoodrs.x + PIN_WIDTH / 2) + ', ' + (newPinCoodrs.y + PIN_HEIGHT);
  };

  var startCoords = {};

  var onMouseDown = function (event) {
    if (event !== null) {
      event.preventDefault();
    }
    if (!mapSection.classList.contains('map--faded')) {
      startCoords = {
        x: event.clientX,
        y: event.clientY
      };
      document.addEventListener('mousemove', onMouseMove);
    }
  };

  var onMouseUp = function (event) {
    event.preventDefault();
    window.pins.position();
    document.removeEventListener('mousemove', onMouseMove);
  };

  mapPinMain.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);


  window.main = {
    closePopup: onClosePopup
  };
})();
