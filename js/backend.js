'use strict';

(function () {

  var process = function (url, method, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Произошла ошибка загрузки');
      }
    });
    xhr.responseType = 'json';
    xhr.open(method, url);
    if (typeof data !== 'undefined') {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  var loadData = function (onDataLoadSuccess, onDataLoadError) {
    process('https://js.dump.academy/keksobooking/data', 'GET', onDataLoadSuccess, onDataLoadError);
  };

  var sendData = function (data, onDataSendSuccess, onDataSendError) {
    process('https://js.dump.academy/keksobooking', 'POST', onDataSendSuccess, onDataSendError, data);
  };

  window.backend = {
    load: loadData,
    send: sendData
  };
})();
