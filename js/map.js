'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var mapSection = document.querySelector('.map');
  var mapPins = mapSection.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var adCardContainer = mapSection.querySelector('.map__filters-container');
  window.currentCard = null;

  var createMapPinList = function (data, template) {
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
        if(window.currentCard) {
          window.currentCard.remove();
        }
        window.currentCard = window.card.create(item, adCardTemplate);
        mapSection.insertBefore(currentCard, adCardContainer);
        document.addEventListener('keydown', window.card.escape);
      });
      mapPinsList.appendChild(pin);
    });
    return mapPinsList;
  }

  var mapDisabled = function (mapDisabled) {
    mapSection.classList.toggle('map--faded', mapDisabled);
  }

  var clearMap = function () {
    for (var i = 0; i < mapPins.children.length; i++) {
      if (mapPins.children[i].type == 'button' && mapPins.children[i] != mapPinMain)
      {
        mapPins.children[i].remove();
        i--;
      }
    }
  }

  window.map = {
    create: createMapPinList,
    disabledMap: mapDisabled,
    clearMap: clearMap
  }
})();
