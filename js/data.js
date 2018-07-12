'use strict';

(function () {

  var adTitle = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var offerType = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var offerTypeRus = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var checkIn = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var checkOut = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var offerFeatures = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var offerPhotos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var PRICE_BY_TYPE = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 100000
  };

  var shuffle = function (a) {
    var randomIndex;
    var tempElement;
    for (var i = a.length - 1; i > 0; i--) {
      randomIndex = Math.floor(Math.random() * (i + 1));
      tempElement = a[i];
      a[i] = a[randomIndex];
      a[randomIndex] = tempElement;
    }
    return a;
  };

  var randomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  };

  var getLocation = function () {
    return {
      'x': randomNumber(300, 900),
      'y': randomNumber(130, 630)
    };
  };

  var getPrice = function () {
    return randomNumber(1000, 1000000);
  };

  var getRandomElement = function (arr) {
    return arr[randomNumber(0, arr.length - 1)];
  };

  var getType = function () {
    return getRandomElement(offerType);
  };

  var getRooms = function () {
    return randomNumber(1, 5);
  };

  var getGuests = function () {
    return randomNumber(1, 9);
  };

  var getCheckin = function () {
    return getRandomElement(checkIn);
  };

  var getCheckout = function () {
    return getRandomElement(checkOut);
  };

  var getFeatures = function () {
    var features = [];
    for (var i = 0; i < offerFeatures.length; i++) {
      if (randomNumber(0, 1)) {
        features = features.concat(offerFeatures[i]);
      }
    }
    return features;
  };

  var getPhotos = function () {
    return shuffle(offerPhotos.slice());
  };

  var getAdsArray = function (amount) {
    var localAdsArray = [];
    var titles = shuffle(adTitle.slice());
    for (var i = 0; i < amount; i++) {
      var ad = {
        'author': {
          'avatar': 'img/avatars/user0' + (i + 1) + '.png'
        },
        'offer': {
          'title': titles.pop(),
          'address': null,
          'price': getPrice(),
          'type': getType(),
          'rooms': getRooms(),
          'guests': getGuests(),
          'checkin': getCheckin(),
          'checkout': getCheckout(),
          'features': getFeatures(),
          'description': '',
          'photos': getPhotos()
        },
        'location': getLocation()
      };
      ad.offer.address = ad.location.x + ', ' + ad.location.y;
      localAdsArray = localAdsArray.concat(ad);
    }
    return localAdsArray;
  };

  var getMinPriceByType = function (type) {
    return PRICE_BY_TYPE[type];
  };

  window.data = {
    offerTypeRus: offerTypeRus,
    minPrice: getMinPriceByType,
    getAdsArray: getAdsArray
  };
})();
