'use strict';

var AVATAR_PATH = 'img/avatars/user{{XX}}.png';
var ITEM_COUNT = 8;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var TYPES_RUS = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var CHECKINS = [
  '12:00',
  '13:00',
  '14:00'
];

var CHECKOUTS = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

function shuffle(a) {
  var j;
  var x;
  var i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

var getAvatar = function (n) {
  return AVATAR_PATH.replace('{{XX}}', String(n).padStart(2, '0'));
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
  return getRandomElement(TYPES);
};

var getRooms = function () {
  return randomNumber(1, 5);
};

var getGuests = function () {
  return randomNumber(1, 9);
};

var getCheckin = function () {
  return getRandomElement(CHECKINS);
};

var getCheckout = function () {
  return getRandomElement(CHECKOUTS);
};

var getFeatures = function () {
  var features = [];
  for (var i = 0; i < FEATURES.length; i++) {
    if (randomNumber(0, 1)) {
      features = features.concat(FEATURES[i]);
    }
  }
  return features;
};

var getPhotos = function () {
  return shuffle(PHOTOS.slice());
};

var getAdsArray = function (amount) {
  var adsArray = [];
  var titles = shuffle(TITLES.slice());
  for (var i = 0; i < amount; i++) {
    var ad = {
      'author': {
        'avatar': getAvatar(randomNumber(1, 8))
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
    ad.offer.address = String(ad.location.x) + ', ' + String(ad.location.y);
    adsArray = adsArray.concat(ad);
  }
  return adsArray;
};

var adsArray = getAdsArray(ITEM_COUNT);

var mapSection = document.querySelector('.map');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var mapPins = mapSection.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');

var adCardContainer = mapSection.querySelector('.map__filters-container');

var adCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var onClickPin = function (evt) {
  var targetPinElement = evt.target.closest('.map__pin');
  if (targetPinElement && !targetPinElement.classList.contains('map__pin--main')) {
    removePopup();
    renderElement(
        mapSection,
        createCardOffer(adsArray[targetPinElement.tabIndex], adCardTemplate),
        adCardContainer
    );
    var popupClosePin = document.querySelector('.popup__close');
    popupClosePin.addEventListener('click', onClickPopupClose);
    document.addEventListener('keydown', onEscapePressPopup);
  }
};

function createMapPinList(data, template) {
  var MapPinsList = document.createDocumentFragment();
  var pin;
  for (var i = 0; i < data.length; i++) {
    pin = template.cloneNode(true);
    pin.style.left = data[i].location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = data[i].location.y - PIN_HEIGHT + 'px';
    pin.querySelector('img').src = data[i].author.avatar;
    pin.querySelector('img').alt = data[i].offer.title;
    pin.addEventListener('click', onClickPin);
    pin.tabIndex = i;
    MapPinsList.appendChild(pin);
  }
  return MapPinsList;
}

var CURRENT_CARD;

function createCardOffer(data, template) {
  var сardOffer = template.cloneNode(true);
  сardOffer.querySelector('.popup__title').textContent = data.offer.title;
  сardOffer.querySelector('.popup__text--address').textContent = data.offer.address;
  сardOffer.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
  сardOffer.querySelector('.popup__type').textContent = TYPES_RUS[data.offer.type];
  сardOffer.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  сardOffer.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  сardOffer.querySelector('.popup__description').textContent = data.offer.description;
  сardOffer.querySelector('.popup__avatar').src = data.author.avatar;
  сardOffer.querySelector('.popup__features').innerHTML = '';
  var feature;
  for (var i = 0; i < data.offer.features.length; i++) {
    feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + data.offer.features[i]);
    сardOffer.querySelector('.popup__features').appendChild(feature);
  }
  var photoTemplate = сardOffer.querySelector('.popup__photo');
  сardOffer.querySelector('.popup__photos').innerHTML = '';
  var photo;
  for (var j = 0; j < data.offer.photos.length; j++) {
    photo = photoTemplate.cloneNode(true);
    photo.src = data.offer.photos[j];
    сardOffer.querySelector('.popup__photos').appendChild(photo);
  }
  CURRENT_CARD = сardOffer;
  return сardOffer;
}

function renderElement(parentContainer, element, beforeContainer) {
  parentContainer.insertBefore(element, beforeContainer);
}

var mapDisabled = function (mapDisabled) {
  mapSection.classList.toggle('map--faded', mapDisabled);
};

var adForm = document.querySelector('.ad-form');
var fieldsetElement = document.querySelectorAll('fieldset');
var ESC_KEYCODE = 27;

var formDisabled = function (formDisabled) {
  adForm.classList.toggle('ad-form--disabled', formDisabled);
  for (var i = 0; i < fieldsetElement.length; i++) {
    fieldsetElement[i].disabled = formDisabled;
    for (var j = 0; j < fieldsetElement[i].children.length; j++) {
      fieldsetElement[i].children[j].disabled = formDisabled;
    }
  }
};

mapDisabled(true);
formDisabled(true);


var onClickActivePage = function () {
  mapDisabled(false);
  formDisabled(false);
  mapSection.addEventListener('click', onClickPin);
  mapPinMain.removeEventListener('mouseup', onClickActivePage);
};

var removePopup = function () {
  var popup = mapSection.querySelector('.popup');
  if (popup) {
    mapSection.removeChild(popup);
  }
};

var closePopup = function () {
  removePopup();
  document.removeEventListener('keydown', onEscapePressPopup);
};

var onClickPopupClose = function () {
  closePopup();
};

var onEscapePressPopup = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var calculationPositionPin = function () {
  var positionPin = {};
  var pinCoordinate = mapPinMain.getBoundingClientRect();
  var mapCoordinate = mapSection.getBoundingClientRect();
  var MAIN_WIDTH_PIN = pinCoordinate.width;
  var MAIN_HEIGHT_PIN = pinCoordinate.height;
  positionPin.x = Math.round(pinCoordinate.x - mapCoordinate.x - MAIN_WIDTH_PIN / 2);
  positionPin.y = Math.round(pinCoordinate.y - mapCoordinate.y - MAIN_HEIGHT_PIN);

  return positionPin;
};

mapPinMain.addEventListener('click', function () {
  mapDisabled(false);
  formDisabled(false);
    renderElement(
    mapPins,
    createMapPinList(adsArray, pinTemplate),
    mapPinMain
  );
});
