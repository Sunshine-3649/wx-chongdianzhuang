const date = new Date();
const years = [];
const months = [];
const days = [];

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i);
}

for (let i = 1; i <= 12; i++) {
  months.push(i);
}

for (let i = 1; i <= 31; i++) {
  days.push(i);
}

Page({
  data: {
    brands: [],
    objectArray: [
      {
        brand: "博世",
        id: 0,
        array: [
          "博世喷油器配件",
          "博世传感器",
          "杰克赛尔配件",
          "博世油泵配件",
          "博世共轨管配件",
          "博世泵喷嘴"
        ]
      },
      {
        brand: "德尔福",
        id: 1,
        array: [
          "德尔福喷油器配件",
          "德尔福传感器",
          "德尔福油泵",
          "德尔福共轨管配件",
          "德尔福滤清器",
          "德尔福电脑版ECU",
          "德尔福机油",
          "德尔福维修部件"
        ]
      },
      {
        brand: "卡特",
        id: 2,
        array: ["卡特传感器", "卡特C7C9泵喷嘴", "卡特共轨配件"]
      },
      {
        brand: "康明斯",
        id: 3,
        array: ["西康配件", "东风康明斯", "福田康明斯"]
      }
    ],
    object: [],
    brandindex: 0,
    index1: 0
  },
  onLoad: function() {
    var objectArray = this.data.objectArray;
    var brands = [];
    for (var i = 0; i < objectArray.length; i++) {
      brands.push(objectArray[i].brand);
    }
    this.setData({
      brands: brands,
      object: objectArray[this.data.brandindex].array
    });
  },
  bindPickerChange0: function(e) {
    this.setData({ brandindex: e.detail.value, index1: 0 });
    var objectArray = this.data.objectArray;
    this.setData({ object: objectArray[this.data.brandindex].array });
  },
  bindPickerChange1: function(e) {
    this.setData({
      index1: e.detail.value
    });
  }
});
