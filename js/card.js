'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var createCardOffer = function (data, template) {
    var сardOffer = template.cloneNode(true);
    сardOffer.querySelector('.popup__title').textContent = data.offer.title;
    сardOffer.querySelector('.popup__text--address').textContent = data.offer.address;
    сardOffer.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
    сardOffer.querySelector('.popup__type').textContent = window.data.offerTypeRus[data.offer.type];
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
    сardOffer.querySelector('.popup__close').addEventListener('click', window.main.closePopup);
    return сardOffer;
  };

  var onEscapePressPopup = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      if (window.currentCard) {
        window.currentCard.remove();
        document.removeEventListener('keydown', onEscapePressPopup);
      }
    }
  };

  window.card = {
    create: createCardOffer,
    escape: onEscapePressPopup
  };
})();
