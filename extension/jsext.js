//DefineProperty Help : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

(function () {
  Object.defineProperty(Array.prototype, 'clone', {
    value() {
      return this.slice();
    }
  });
  Object.defineProperty(Array.prototype, 'where', {
    value(where) {
      let items = new Array();
      for (let i = 0; i < this.length; i++) {
        if (where(this[i]))
          items.push(this[i]);
      }
      return items;
    }
  });
  Object.defineProperty(Object.prototype, 'where', {
    value(where) {
      let items = new Array();
      for (let key in this) {
        if (where(this[key]))
          items.push(this[key]);
      }
      return items;
    }
  });
  Object.defineProperty(Array.prototype, 'findone', {
    value(itemReturn) {
      return this.where(itemReturn, true)[0];
    }
  });
  Object.defineProperty(Array.prototype, 'contains', {
    value(value) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] == value)
          return true;
      }
      return false;
    }
  });
  Object.defineProperty(Array.prototype, 'groupby', {
    value(keyName) {
      let groups = {};
      for (let i = 0; i < this.length; i++) {
        if (groups[this[i][keyName]] == null)
          groups[this[i][keyName]] = [];
        groups[this[i][keyName]].push(this[i]);
      }
      return groups;
    }
  });
  Object.defineProperty(Array.prototype, 'max', {
    value() {
      let max = this[0];
      if (this.length > 1) {
        for (let i = 1; i < this.length; i++) {
          if (this[i] > max)
            max = this[i];
        }
      }
      return max;
    }
  });
  Object.defineProperty(Array.prototype, 'min', {
    value() {
      let min = this[0];
      if (this.length > 1) {
        for (let i = 1; i < this.length; i++) {
          if (this[i] < min)
            min = this[i];
        }
      }
      return min;
    }
  });
  Object.defineProperty(Array.prototype, 'select', {
    value(itemReturn, ignoreNull) {
      let items = new Array();
      for (let i = 0; i < this.length; i++) {
        let item = itemReturn(this[i]);
        if (ignoreNull && item == null)
          continue;
        items.push(itemReturn(this[i]));
      }
      return items;
    }
  });
  //valuePath:键
  function getPathValue(valuePath, splitChar, nullThrow) {
    try {
      splitChar = splitChar || '.';
      var index = valuePath.indexOf(splitChar);
      if (index > 0) {
        var pathFirst = valuePath.substring(0, index);
        var val = this[pathFirst];
        return getPathValue.call(val, valuePath.substring(index + splitChar.length), splitChar, nullThrow);
      }
      else {
        var val = this[valuePath];
        return val;
      }
    }
    catch (e) {
      if (nullThrow) {
        console.log("Object.prototype.getValue Error\nvaluePath:" + valuePath);
        console.log("this:");
        console.log(this);
      }
      return null;
    }
  }
  Object.defineProperty(Object.prototype, 'pathSelect', {
    value(path, splitChar) {
      return getPathValue.call(this, path, splitChar, true);
    }
  });
  Object.defineProperty(Object.prototype, 'keys', {
    value() {
      let keySet = [];
      for (let key in this) {
        keySet.push(key);
      }
      return keySet;
    }
  });
  Object.defineProperty(Object.prototype, 'values', {
    value() {
      let valueSet = [];
      for (let key in this) {
        valueSet.push(this[key]);
      }
      return valueSet;
    }
  });
  /** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
      可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
      Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
   * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
   * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
   * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
   * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18    
   */
  Object.defineProperty(Date.prototype, 'format', {
    value(fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
      };
      var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
  });
})();