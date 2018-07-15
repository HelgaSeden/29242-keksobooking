'use strict';

(function () {

  var offerTypeRus = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var PRICE_BY_TYPE = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 100000
  };

  var getMinPriceByType = function (type) {
    return PRICE_BY_TYPE[type];
  };

  window.data = {
    offerTypeRus: offerTypeRus,
    minPrice: getMinPriceByType
  };
})();
