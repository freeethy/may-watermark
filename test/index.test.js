const MayWaterMark = require("../src/index");

// 测试设置各种配置
describe("test _setConfig", () => {
  test("param undefined and return true", () => {
    expect(MayWaterMark._setConfig()).toBeTruthy();
  });
  test("param object and return true", () => {
    expect(MayWaterMark._setConfig({})).toBeTruthy();
  });
  test("param array and return false", () => {
    expect(MayWaterMark._setConfig([])).toBeFalsy();
  });
});

// 测试init
describe("test init", () => {
  test("param undefined", () => {
    MayWaterMark.init();
  });
  test("param array", () => {
    MayWaterMark.init([]);
  });
  test("param object", () => {
    MayWaterMark.init({});
  });

  test("auto false", () => {
    MayWaterMark.init({
      auto: false
    });
  });

  test("auto true", () => {
    MayWaterMark.init({
      auto: true,
      mode: "development"
    });
  });
});

// 测试add方法
describe("test add", () => {
  test("add", () => {
    // 为了测试config格式不对时的add，使用中不这么用
    MayWaterMark.config = [];
    MayWaterMark.add();
  });
});

// 测试addForImg方法
describe("test addForImg", () => {
  test("param undefined", () => {
    MayWaterMark.addForImg();
  });
  test("param array", () => {
    MayWaterMark.addForImg([]);
  });
  test("param object", () => {
    MayWaterMark.addForImg({});
  });
  test("param url", () => {
    MayWaterMark.addForImg({
      url: "http://xxx/demo.png"
    });
  });
});