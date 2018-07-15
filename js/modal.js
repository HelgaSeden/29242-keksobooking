'use strict';

(function () {

  var modalPopup = document.createElement('div');
  var alertPopup = document.createElement('div');
  var createModal = function (text) {
    modalPopup.classList.add('modal', 'hidden');
    modalPopup.textContent = 'bad';
    alertPopup.classList = 'modal-block hidden';
    alertPopup.textContent = 'good';
    document.body.appendChild(modalPopup);
    modalPopup.appendChild(alertPopup);

    showModal(text);
  };

  var showModal = function (text) {
    modalPopup.classList.remove('hidden');
    alertPopup.classList.remove('hidden');
    alertPopup.textContent = text;
    setTimeout(closeModal, 2000);
  };

  var closeModal = function () {
    modalPopup.classList.add('hidden');
    alertPopup.classList.add('hidden');
  };

  window.modal = {
    show: createModal
  };
})();
