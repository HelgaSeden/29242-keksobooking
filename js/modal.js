'use strict';

(function () {

  var modalPopup = document.createElement('div');
  var alertPopup = document.createElement('div');
  var createModal = function (text) {
    modalPopup.className = 'modal hidden';
    modalPopup.textContent = 'bad';
    modalPopup.style = 'width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); position: fixed; top: 0px; left: 0px;';
    alertPopup.className = 'modal-block hidden';
    alertPopup.style = 'margin: 25% auto; width: 300px; height: 40px; padding: 10px; background-color: rgba(242, 242, 242, 0.7); text-align: center;';
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
