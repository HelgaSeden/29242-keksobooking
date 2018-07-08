'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var mapPinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var addressForm = adForm.address;


  var calculationPositionPin = function () {
    var positionPin = {};
    positionPin.x = Math.round(mapPinMain.offsetLeft + PIN_WIDTH / 2);
    positionPin.y = Math.round(mapPinMain.offsetTop + PIN_HEIGHT);
    addressForm.value = positionPin.x + ', ' + positionPin.y;
    addressForm.readOnly = true;
  };

  calculationPositionPin();

  window.pins = {
    position: calculationPositionPin,
  };

})();
