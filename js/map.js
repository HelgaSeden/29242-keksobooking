'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var mapSection = document.querySelector('.map');
  var adCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var adCardContainer = mapSection.querySelector('.map__filters-container');

  var renderedPins = [];

  var createMapPinList = function (data, template) {
    var mapPinsList = document.createDocumentFragment();
    var pin;
    data.forEach(function (item, i) {
      pin = template.cloneNode(true);
      pin.style.left = data[i].location.x - PIN_WIDTH / 2 + 'px';
      pin.style.top = data[i].location.y - PIN_HEIGHT + 'px';
      pin.querySelector('img').src = data[i].author.avatar;
      pin.querySelector('img').alt = data[i].offer.title;
      pin.addEventListener('click', function (event) {
        event.preventDefault();
        window.card.close();
        var card = window.card.create(item, adCardTemplate);
        mapSection.insertBefore(card, adCardContainer);
      });
      mapPinsList.appendChild(pin);
      renderedPins.push(pin);
    });
    return mapPinsList;
  };

  var mapDisabled = function (isDisabled) {
    mapSection.classList.toggle('map--faded', isDisabled);
  };

  var clearMap = function () {
    renderedPins.forEach(function (pin) {
      pin.remove();
    });
  };

  window.map = {
    adPins: createMapPinList,
    disabled: mapDisabled,
    clear: clearMap
  };
})();
