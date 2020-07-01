/**
 * ajax ajax请求封装
 *
 * @param {*} config
 */
function ajax(config) {
  if (Object.prototype.toString.call(config) !== "[object Object]") {
    console.warn("ajax参数错误");
    return false;
  }

  var ajaxData = {
    type: (config.type || "GET").toUpperCase(),
    url: config.url || "",
    async: config.async || "true",
    data: config.data || null,
    dataType: config.dataType || "json",
    contentType:
      config.contentType || "application/x-www-form-urlencoded; charset=utf-8",
    header: config.header || {},
    beforeSend: config.beforeSend || function() {},
    success: config.success || function() {},
    error: config.error || function() {}
  };

  ajaxData.beforeSend();
  var xhr = createxmlHttpRequest();
  xhr.responseType = ajaxData.dataType;

  xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
  xhr.setRequestHeader("Content-Type", ajaxData.contentType);

  for (var item in ajaxData.header) {
    xhr.setRequestHeader(item, ajaxData.header[item]);
  }
  xhr.send(convertData(ajaxData.data));

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        ajaxData.success(xhr.response);
      } else {
        ajaxData.error();
      }
    }
  };
}

function createxmlHttpRequest() {
  if (window.ActiveXObject) {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  }
}

function convertData(data) {
  if (typeof data === "object") {
    var convertResult = "";
    for (var c in data) {
      convertResult += c + "=" + data[c] + "&";
    }
    convertResult = convertResult.substring(0, convertResult.length - 1);
    return convertResult;
  } else {
    return data;
  }
}

module.exports = ajax;

/**
 * ajax config配置
 */
// var config = {
//   type: "get",
//   data: JSON.stringify({
//     a: 22,
//     b: 33
//   }),
//   contentType: "application/json",
//   success: function(res) {},
//   error: function() {}
// };
