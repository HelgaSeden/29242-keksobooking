'use strict';

var AVATAR_PATH = 'img/avatars/user{{XX}}.png';
var ITEM_COUNT = 8;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var mapSection = document.querySelector('.map');
var mapPins = mapSection.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adCardContainer = mapSection.querySelector('.map__filters-container');
var adCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var addressForm = adForm.address;
var fieldsetElement = document.querySelectorAll('fieldset');
var ESC_KEYCODE = 27;
var currentCard = null;

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

function shuffle(a) {
  var randomIndex;
  var tempElement;
  for (var i = a.length - 1; i > 0; i--) {
    randomIndex = Math.floor(Math.random() * (i + 1));
    tempElement = a[i];
    a[i] = a[randomIndex];
    a[randomIndex] = tempElement;
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
  var adsArray = [];
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
    ad.offer.address = ad.location.x + ', ' + ad.location.y
    adsArray = adsArray.concat(ad);
  }
  return adsArray;
};

var adsArray = getAdsArray(ITEM_COUNT);

function createMapPinList(data, template) {
  var mapPinsList = document.createDocumentFragment();
  var pin;
  data.forEach(function(item, i) {
    pin = template.cloneNode(true);
    pin.style.left = data[i].location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = data[i].location.y - PIN_HEIGHT + 'px';
    pin.querySelector('img').src = data[i].author.avatar;
    pin.querySelector('img').alt = data[i].offer.title;
    pin.addEventListener('click', function(event) {
      event.preventDefault();
      if(currentCard) {
        currentCard.remove();
      }
      currentCard = createCardOffer(item, adCardTemplate);
      mapSection.insertBefore(currentCard, adCardContainer);
      document.addEventListener('keydown', onEscapePressPopup);
    });
    mapPinsList.appendChild(pin);
  });
  return mapPinsList;
}

function createCardOffer(data, template) {
  var сardOffer = template.cloneNode(true);
  сardOffer.querySelector('.popup__title').textContent = data.offer.title;
  сardOffer.querySelector('.popup__text--address').textContent = data.offer.address;
  сardOffer.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
  сardOffer.querySelector('.popup__type').textContent = offerTypeRus[data.offer.type];
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
  сardOffer.querySelector('.popup__close').addEventListener('click', onClosePopup);
  return сardOffer;
}

var onClosePopup = function(event) {
  event.preventDefault();
  currentCard.remove();
  document.removeEventListener('keydown', onEscapePressPopup);
}

var mapDisabled = function (mapDisabled) {
  mapSection.classList.toggle('map--faded', mapDisabled);
};

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
    if(currentCard) {
      currentCard.remove();
      document.removeEventListener('keydown', onEscapePressPopup)
    }
  }
};

var calculationPositionPin = function () {
  var positionPin = {};
  positionPin.x = Math.round(mapPinMain.offsetLeft + PIN_WIDTH / 2);
  positionPin.y = Math.round(mapPinMain.offsetTop + PIN_HEIGHT);
  addressForm.value = positionPin.x + ', ' + positionPin.y;
};

var doActivationPage = function() {
  mapDisabled(false);
  formDisabled(false);
  mapPins.insertBefore(createMapPinList(adsArray, pinTemplate), mapPinMain);
};

var onActivationPage = function(event) {
  event.preventDefault();
  doActivationPage();
  mapPinMain.removeEventListener('mouseup', onActivationPage);
};

mapPinMain.addEventListener('mouseup', onActivationPage);

calculationPositionPin();
