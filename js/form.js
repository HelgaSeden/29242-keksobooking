'use strict';

(function () {

  var adForm = document.querySelector('.ad-form');
  var fieldsetElement = document.querySelectorAll('fieldset');
  var typeSelect = adForm.querySelector('#type');
  var priceSelect = adForm.querySelector('#price');
  var checkInSelect = adForm.querySelector('#timein');
  var checkOutSelect = adForm.querySelector('#timeout');
  var roomsSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var selectedRooms = Number(roomsSelect.value);
  var successMessage = document.querySelector('.success');

  roomsSelect.addEventListener('change', function () {
    selectedRooms = Number(roomsSelect.value);
    window.form.test();
  });

  var formDisabled = function (isDisabled) {
    adForm.classList.toggle('ad-form--disabled', isDisabled);
    for (var i = 0; i < fieldsetElement.length; i++) {
      fieldsetElement[i].disabled = isDisabled;
      for (var j = 0; j < fieldsetElement[i].children.length; j++) {
        fieldsetElement[i].children[j].disabled = isDisabled;
      }
    }
  };

  var clearForm = function () {
    var inputs = adForm.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === 'checkbox') {
        inputs[i].checked = false;
      } else {
        inputs[i].value = '';
      }
    }

    var selects = adForm.querySelectorAll('select');
    for (i = 0; i < selects.length; i++) {
      switch (selects[i].id) {
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
    }

    var textAreas = adForm.querySelectorAll('textarea');
    for (i = 0; i < textAreas.length; i++) {
      textAreas[i].value = '';
    }
  };

  var onChangeTypeSelect = function () {
    var minPrice = window.data.minPrice(typeSelect.value);
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
    }

    capacitySelect.setCustomValidity(message);
  };

  var onChangeCapacitySelect = function () {
    testCapacity();
  };

  var getFormData = function () {
    return new FormData(adForm);
  };

  var onClickSuccess = function () {
    successMessage.classList.add('hidden');
    successMessage.removeEventListener('click', onClickSuccess);
  };

  adForm.addEventListener('submit', function (event) {
    event.preventDefault();
    window.backend.send(getFormData(), function () {
      clearForm();
      successMessage.classList.remove('hidden');
      successMessage.addEventListener('click', onClickSuccess);
    },
    function (data) {
      window.modal.show(data);
    });
  });

  window.map.clearMap();

  window.form = {
    disabledForm: formDisabled,
    clearForm: clearForm,
    changeType: onChangeTypeSelect,
    test: testCapacity,
    changeCheckIn: onChangeCheckInSelect,
    changeCheckOut: onChangeCheckOutSelect,
    changeCapacity: onChangeCapacitySelect
  };
})();
