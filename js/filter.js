'use strict';

(function () {

  var ANY_VALUE = 'any';
  var PINS_NUMBER = 5;

  var value = {
    LOW_PRICE: 10000,
    MIDDLE_PRICE: 50000
  };

  var valuePrice = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var filterForm = document.querySelector('.map__filters');
  var typeHouse = filterForm.querySelector('#housing-type');
  var priceHouse = filterForm.querySelector('#housing-price');
  var roomsHouse = filterForm.querySelector('#housing-rooms');
  var guestsHouse = filterForm.querySelector('#housing-guests');
  var featuresHouse = filterForm.querySelector('#housing-features');
  var features = featuresHouse.querySelectorAll('.map__checkbox');

  var getFeatures = function () {
    var checkedValues = [];
    Array.from(features).forEach(function (element) {
      if (element.checked) {
        checkedValues.push(element.value);
      }
    });
    return checkedValues;
  };

  var checkTypeHouse = function (element) {
    return typeHouse.value === ANY_VALUE ? true : element.offer.type === typeHouse.value;
  };

  var checkPriceRange = function (range, priceValue) {
    switch (range) {
      case (valuePrice.MIDDLE): {
        return (priceValue >= value.LOW_PRICE && priceValue <= value.MIDDLE_PRICE);
      }
      case (valuePrice.LOW): {
        return (priceValue < value.LOW_PRICE);
      }
      case (valuePrice.HIGH): {
        return (priceValue > value.MIDDLE_PRICE);
      }
    }
    return false;
  };

  var checkPriceHouse = function (element) {
    return priceHouse.value === ANY_VALUE ? true : checkPriceRange(priceHouse.value, element.offer.priceHouse);
  };

  var checkRoomsHouse = function (element) {
    return roomsHouse.value === ANY_VALUE ? true : parseInt(element.offer.rooms, 10) === parseInt(roomsHouse.value, 10);
  };

  var checkGuestsHouse = function (element) {
    return guestsHouse.value === ANY_VALUE ? true : parseInt(element.offer.guests, 10) === parseInt(guestsHouse.value, 10);
  };

  var enclosure = function (inners, outers) {
    var canceledValues = inners.filter(function (element) {
      return outers.indexOf(element) !== -1;
    });
    return canceledValues.length === inners.length;
  };

  var checkFeatures = function (element) {
    return getFeatures().length === 0 ? true : enclosure(getFeatures(), element.offer.features);
  };

  var getFilterCondition = function () {
    var filteredData = window.data.ads.filter(function (element) {
      return checkTypeHouse(element) && checkPriceHouse(element) && checkRoomsHouse(element) && checkGuestsHouse(element) && checkFeatures(element);
    });
    return filteredData.length > PINS_NUMBER ? filteredData.slice(0, PINS_NUMBER) : filteredData;
  };

  var setFilters = function (callback) {
    filterForm.addEventListener('change', function () {
      var filteredData = getFilterCondition();
      callback(filteredData);
    });
  };

  window.filter = {
    set: setFilters,
    get: getFilterCondition
  };

})();
