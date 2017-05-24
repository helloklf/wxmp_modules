import './jsext.js';

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function objectValueEqual(current, newValue) {
  if (typeof (current) != typeof (newValue))
    return false;

  else if (newValue instanceof Array) {
    for (let key = 0; key < newValue.length; key++) {
      let currentValue = current[key];
      let value = newValue[key];
      if (!objectValueEqual(currentValue, value))
        return false;
      else
        continue;
    }
  }
  else if (newValue instanceof Function) {
    return true; //不对方法进行比较
  }
  else if (typeof (newValue) == 'object') {
    for (let key in newValue) {
      let currentValue = current[key];
      let value = newValue[key];
      if (!objectValueEqual(currentValue, value))
        return false;
      else
        continue;
    }
  }
  else if (current != newValue)
    return false;

  return true;
}

/**
 * @class 组件定义
 */
export default class Component {
  constructor({datas, components}) {
    this.data = {};
    this.methods = {};
    this.computed = {};

    if (this.data instanceof Function)
      this.data = this.data();

    if (datas != null)
      Object.assign(this.data, datas);

    if (components) {
      if (this.components == null)
        this.components = {};
      Object.assign(this.components, components);
    }

    this.$Elements = {};
    this.props = {};
    //this.$guid = guid();


    //父级节点
    this.$parent = null;
    //根节点
    this.$root = null;

    let _guid = guid();
    Object.defineProperties(this, {
      $guid: {
        get: function () {
          return _guid;
        },
        set: function (value) {
          return value;
        },
        enumerable: true,
        configurable: false
      }
    });
  }


  created(root, parent) {
    Object.defineProperties(this, {
      $parent: {
        get: function () {
          return parent;
        },
        enumerable: false,
        configurable: false
      },
      $root: {
        get: function () {
          return root;
        },
        enumerable: false,
        configurable: false
      }
    });

    for (let key in this.methods) {
      if (this.data[key] == null) {
        let method = this.methods[key];
        this[key] = this.methods[key];

        delete this.methods[key];
      }
      else {
        console.error("方法名称与data中的字段名冲突！", key, this);
      }
    }

    let computeds = this.computed;
    for (let key in computeds) {
      if (this.data[key] == null) {
        let method = computeds[key];
        Object.defineProperties(this, {
          [key]: {
            get: function () {
              return method.call(this);
            },
            set: function (value) {
              return value;
            },
            enumerable: true,
            configurable: false
          }
        });
      }
      else {
        console.error("计算名称与data中的字段名冲突！", key, this);
      }
    }

    this.initObjectGetSet();

    delete this.data;
    delete this.methods;
    delete this.components;
    delete this.computed;

    return this;
  }

  getDatas() {
    let data = {};
    Object.assign(data, this.data);

    for (let key in this.computed) {
      if (this.data[key] != null) {
        console.warn(key + "同时存在于data和computed，可能会造成不必要的麻烦，建议保持名称唯一！");
      }
      else {
        Object.defineProperties(data, {
          [key]: {
            get: function () {
              let r = this.computed[key].call(this);
              console.log("computed->getter", item);
              return item;
            },
            enumerable: true,
            configurable: true
          }
        });
      }
    }

    return data;
  }

  initObjectGetSet() {
    let datas = this.data;
    for (let key in datas) {
      Object.defineProperties(this, {
        [key]: {
          get: function () {
            return datas[key];
          },
          set: function (value) {
            if (objectValueEqual(datas[key], value))
              return;
            datas[key] = value;
            this.$notifyPropertyChanged(this);
          },
          enumerable: true,
          configurable: true
        }
      });
    }
  }

  $emit(eventName, ...args) {
    let method = this.$parent[eventName];
    if (method)
      method(args);
  }

  $notifyPropertyChanged(values) {
    if (this.$parent) {
      if (this.$parent.$notifyPropertyChanged != null) {
        if (values == this) {
          this.$parent.$notifyPropertyChanged(values);
        }
        else {
          let itemKey = null;
          for (let key in this) {
            if (this[key].$guid == values.$guid) {
              itemKey = key;
            }
          }
          this.$parent.$notifyPropertyChanged({
            [itemKey]: values
          });
        }
      }
    }
    else {
      console.error("$parent未定义，请确保created方法已被执行！");
    }
  }
}