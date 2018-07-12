'use strict';
(function () {

  var loadData = function (onDataLoadSuccess, onDataLoadError) {
    var xhr = new XMLHttpRequest();
    var urlGet = 'https://js.dump.academy/keksobooking/data';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onDataLoadSuccess(xhr.response);
      } else {
        onDataLoadError('Произошла ошибка загрузки');
      }
    });
    xhr.responseType = 'json';
    xhr.open('GET', urlGet);
    xhr.send();
  };

  var sendData = function (data, onDataSendSuccess, onDataSendError) {
    var xhr = new XMLHttpRequest();
    var urlPost = 'https://js.dump.academy/keksobooking';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onDataSendSuccess(xhr.response);
      } else {
        onDataSendError('Произошла ошибка загрузки');
      }
    });
    xhr.responseType = 'json';
    xhr.open('POST', urlPost);
    xhr.send(data);
  };

  window.backend = {
    load: loadData,
    send: sendData
  };
})();
