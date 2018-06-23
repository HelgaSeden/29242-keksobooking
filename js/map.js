'use strict';

var AVATAR_PATH = 'img/avatars/user{{XX}}.png';
var ITEM_COUNT = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var ESC_KEYCODE = 27;
var PIN_MAIN_COORDS = {X: 570, Y: 375};

var mapSection = document.querySelector('.map');
var mapPins = mapSection.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adCardContainer = mapSection.querySelector('.map__filters-container');
var adCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var addressForm = adForm.address;
var fieldsetElement = document.querySelectorAll('fieldset');
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
    ad.offer.address = ad.location.x + ', ' + ad.location.y
    localAdsArray = localAdsArray.concat(ad);
  }
  return localAdsArray;
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
  if (event != null)
    event.preventDefault();
  if (currentCard != null)
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
  addressForm.readOnly = true;
};

var doActivationPage = function() {
  mapDisabled(false);
  formDisabled(false);
  mapPins.insertBefore(createMapPinList(adsArray, pinTemplate), mapPinMain);
};

var onActivationPage = function(event) {
  event.preventDefault();
  if (mapSection.classList.contains('map--faded'))
  {
    doActivationPage();
  }
};

mapPinMain.addEventListener('click', onActivationPage);

calculationPositionPin();

var PRICE_BY_TYPE = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 100000
};

var typeSelect = adForm.querySelector('#type');
var priceSelect = adForm.querySelector('#price');
var checkInSelect = adForm.querySelector('#timein');
var checkOutSelect = adForm.querySelector('#timeout');
var roomsSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');
var selectedRooms = Number(roomsSelect.value);
var resetButton = adForm.querySelector('.ad-form__reset');


var getMinPriceByType = function (type) {
  return PRICE_BY_TYPE[type];
};

var onChangeTypeSelect = function () {
  var minPrice = getMinPriceByType(typeSelect.value);
  priceSelect.setAttribute('min', minPrice);
  priceSelect.setAttribute('placeholder', minPrice);
};

var changeCheckTime = function (checkField, index) {
  checkField.selectedIndex = index;
};

var onChangeCheckInSelect = function () {
  changeCheckTime(checkOutSelect, checkInSelect.selectedIndex);
};

var onChangeCheckOutSelect = function () {
  changeCheckTime(checkInSelect, checkOutSelect.selectedIndex);
};

var testCapacity = function () {
  var selectedCapacity = Number(capacitySelect.value);
  var message = '';
  switch (selectedRooms) {
    case (1):
      if (selectedCapacity !== 1) {
        message = 'Для такого количества комнат можно выбрать место для 1 гостя';
      }
      break;
    case (2):
      if (selectedCapacity !== 1 && selectedCapacity !== 2) {
        message = 'Для такого количества комнат можно выбрать места для 1 гостя или 2 гостей';
      }
      break;
    case (3):
      if (selectedCapacity !== 1 && selectedCapacity !== 2 && selectedCapacity !== 3) {
        message = 'Для такого количества комнат можно выбрать места для 1 гостя, 2-х или 3 гостей';
      }
      break;
    case (100):
      if (selectedCapacity !== 100) {
        message = 'Для такого количества комнат места не для гостей';
      }
      break;
  };

  capacitySelect.setCustomValidity(message);
};

var onChangeCapacitySelect = function () {
  testCapacity();
};

var clearMap = function () {
  for (var i = 0; i < mapPins.children.length; i++) {
    if (mapPins.children[i].type == 'button' && mapPins.children[i] != mapPinMain)
    {
      mapPins.children[i].remove();
      i--;
    }
  }
};

var clearForm = function () {
  var inputs = adForm.querySelectorAll('input');
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == 'checkbox')
      inputs[i].checked = false;
    else
      inputs[i].value = "";
  };

  var selects = adForm.querySelectorAll('select');
  for (var i = 0; i < selects.length; i++) {
    switch(selects[i].id) {
      case 'type':
        selects[i].value = 'flat';
        break;
      case 'timein':
        selects[i].selectedIndex = 0;
        break;
      case 'timeout':
        selects[i].selectedIndex = 0;
        break;
      case 'room_number':
        selects[i].selectedIndex = 0;
        break;
      case 'capacity':
        selects[i].selectedIndex = 2;
        break;
    }
  };

  var textAreas = adForm.querySelectorAll('textarea');
  for (var i = 0; i < textAreas.length; i++) {
    textAreas[i].value = "";
  }
};

var onClickReset = function (event) {
  event.preventDefault();
  mapDisabled(true);
  formDisabled(true);
  clearMap();
  clearForm();
  calculationPositionPin();
  onClosePopup();

  mapPinMain.style.left = PIN_MAIN_COORDS.X + 'px';
  mapPinMain.style.top = PIN_MAIN_COORDS.Y + 'px';
  calculationPositionPin();
  mapPinMain.addEventListener('mouseup', onActivationPage);
};

testCapacity();
typeSelect.addEventListener('change', onChangeTypeSelect);
checkInSelect.addEventListener('change', onChangeCheckInSelect);
checkOutSelect.addEventListener('change', onChangeCheckOutSelect);
capacitySelect.addEventListener('change', onChangeCapacitySelect);
roomsSelect.addEventListener('change', function (event) {
  selectedRooms = Number(roomsSelect.value);
  testCapacity();
});
resetButton.addEventListener('click', onClickReset);

var TOP_BORDER = 130;
var BOTTOM_BORDER = 630;
var POINT_PIN = 22;

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
    bottom: BOTTOM_BORDER- PIN_HEIGHT - POINT_PIN,
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
  }

  var newPinCoodrs = calculationNewPositionPin ();
  mapPinMain.style.left = newPinCoodrs.x + 'px';
  mapPinMain.style.top = newPinCoodrs.y + 'px';
  addressForm.value = (newPinCoodrs.x + PIN_WIDTH / 2) + ', ' + (newPinCoodrs.y + PIN_HEIGHT);
};

var startCoords = {};

var onMouseDown = function (event) {
  if (event != null)
  event.preventDefault();
  if (!mapSection.classList.contains('map--faded'))
  {
    startCoords = {
      x: event.clientX,
      y: event.clientY
    };
    document.addEventListener('mousemove', onMouseMove);
  }
};

var onMouseUp = function (event) {
  event.preventDefault();
  calculationPositionPin();
  document.removeEventListener('mousemove', onMouseMove);
};

mapPinMain.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
