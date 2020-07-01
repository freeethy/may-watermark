var WaterMark = {
  init: function(config) {
    var that = this;
    var isValid = this._setConfig(config);

    if (isValid) {
      if (!this.config.auto) {
        this.add();
      } else {
        if(this.config.hasAuthorit) {
          that.add();
        }
      }
    }
  },

  // 添加水印并监听dom改变
  add: function() {
    if (!this._isValidConfig()) return;

    // 获取设置水印的容器,它的父级需要设置position:relative
    var __wm = document.querySelector(".__maywm");
    var watermarkDiv = __wm || document.createElement("div");
    var base64Url = this._getBg();

    var styleStr =
      "\
              position:absolute;\
              top:0;\
              left:0;\
              width:100%;\
              height:100%;\
              z-index:" +
      this.config.zIndex +
      ";\
              pointer-events:none;\
              background-repeat:repeat;\
              background-image:url('" +
      base64Url +
      "')";

    this.styleStr = styleStr;
    watermarkDiv.setAttribute("style", styleStr);
    watermarkDiv.classList.add("__maywm");

    if (!__wm) {
      this.config.container.style.position = "relative";
      this.config.container.insertBefore(
        watermarkDiv,
        this.config.container.firstChild
      );
    }

    this._observer();
  },

  addForImg: function(params) {
    if (!this._isValidConfig(params)) return;
    if (!params.url) return;

    var that = this;
    var img = new Image();
    img.src = params.url;
    img.crossOrigin = "anonymous";
    img.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      ctx.textAlign = params.textAlign || that.config.textAlign;
      ctx.textBaseline = params.textBaseline || that.config.textBaseline;
      ctx.font = params.font || that.config.font;
      ctx.fillStyle = params.fillStyle || that.config.color;
      ctx.fillText(
        params.name,
        img.width - (params.textX || 100),
        img.height - (params.textY || 30)
      );
      const base64Url = canvas.toDataURL();
      params.cb && params.cb(base64Url);
    };
  },

  // 设置水印配置信息
  _setConfig: function(config) {
    if (!this._isValidConfig(config)) return false;

    this.config = {
      apiDomain: "",
      name: "may_watermark",
      color: "rgba(230, 230, 230, 0.8)",
      auto: false,
      hasAuthority: true,
      container: document.body,
      width: "200px",
      height: "150px",
      font: "20px 黑体",
      textAlign: "center",
      textBaseline: "middle",
      rotate: "10",
      zIndex: 9999
    };

    for (var item in config) {
      if (this.config.hasOwnProperty(item)) {
        this.config[item] = config[item];
      }
    }

    return true;
  },

  // 检查配置格式是否正确
  _isValidConfig: function(config) {
    var params = config !== undefined ? config : this.config;
    if (
      params !== undefined &&
      Object.prototype.toString.call(params) !== "[object Object]"
    ) {
      console.warn("水印参数格式错误");
      return false;
    } else {
      return true;
    }
  },

  // 获取水印背景图片
  _getBg: function() {
    var dpr = window.devicePixelRatio;
    var width = this.config.width;
    var height = this.config.height;
    var canvas = document.createElement("canvas");

    canvas.style.width = width;
    canvas.style.height = height;
    canvas.setAttribute("width", width * dpr);
    canvas.setAttribute("height", height * dpr);

    // 返回一个用于在画布上绘图的环境
    var ctx = canvas.getContext("2d");
    var base64Url = "";

    ctx.scale(dpr, dpr);

    // 不支持canvas时
    if (ctx === null) {
      base64Url = this._getBgBySvg();
      return base64Url;
    }

    // 绘制之前清除画布
    ctx.clearRect(0, 0, width, height);
    ctx.font = this.config.font;
    ctx.textAlign = this.config.textAlign;
    ctx.textBaseline = this.config.textBaseline;
    ctx.translate(parseFloat(width) / 2, parseFloat(height) / 2);
    ctx.rotate((-this.config.rotate * Math.PI) / 180);
    ctx.translate(-parseFloat(width) / 2, -parseFloat(height) / 2);
    ctx.fillStyle = this.config.color;
    ctx.fillText(
      this.config.name,
      parseFloat(width) / 2,
      parseFloat(height) / 2
    );
    // 坐标系还原
    ctx.rotate((this.config.rotate * Math.PI) / 180);

    // 转换成base64
    base64Url = canvas.toDataURL();
    return base64Url;
  },

  // 生成svg图片
  _getBgBySvg: function() {
    var svgStr =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      this.config.width +
      '" height="' +
      this.config.height +
      '"> \
                  <text x="50%" y="50%" dy="12px" \
                  text-anchor="middle" \
                  stroke="' +
      this.config.color +
      '" \
                  stroke-width="0.1" \
                  stroke-opacity="0.8" \
                  fill="${this.config.color}" \
                  transform="rotate(-' +
      this.config.rotate +
      ' 0 0)" \
                  style="font-size: ' +
      this.config.font +
      ';">' +
      this.config.name +
      "</text> \
                  </svg>";
    var base64Url =
      "data:image/svg+xml;base64," +
      window.btoa(unescape(encodeURIComponent(svgStr)));

    return base64Url;
  },

  // 监听元素变动，防止用户手动修改水印
  _observer: function() {
    var that = this;
    var MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
      var mo = new MutationObserver(function() {
        var __wm = document.querySelector(".__maywm");
        // 只在__wm元素变动才重新调用 add
        if ((__wm && __wm.getAttribute("style") !== that.styleStr) || !__wm) {
          // 避免一直触发
          mo.disconnect();
          mo = null;
          that.add();
        }
      });
      mo.observe(that.config.container, {
        attributes: true,
        subtree: true,
        childList: true
      });
    }
  }
};

module.exports = WaterMark;
