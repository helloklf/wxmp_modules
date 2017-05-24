import Component from './Component.js'

function findComponentByGuid(object, guid) {
  for (let key in object) {
    if (key.startsWith("$") && object[key] instanceof Component) {
      if (object[key].$guid.trim() == guid.trim()) {
        return object[key];
      }
      else {
        let r = findComponentByGuid(object[key], guid);
        if (r != null)
          return r;
      }
    }
  }
}

export default class PageAbstract {
  constructor(page) {
    let _this = this;
    Object.assign(this, page);

    if (this.onLoad != null)
      this.__onLoad = this.onLoad;
    this.onLoad = null;

    Object.assign(this, {
      //生命周期函数--监听页面加载
      onLoad: function (options) {
        _this = this;
        if (this.__onLoad)
          this.__onLoad(options);

        console.log("页面加载完成", this);
      },
      $notifyPropertyChanged(values) {
        if (_this.setData) {
          let itemKey = null;
          for (let key in this.$Elements) {
            if (this.$Elements[key].$guid == values.$guid) {
              itemKey = key;
            }
          }
          if(itemKey==null){
            console.error(values,"未找到对应的对象！在Page节点上",itemKey);
            return;
          }
          let changes = {
            [itemKey]: values
          };
          console.log(changes);
          _this.setData(changes);
        }
      },

      /**在树中查找组件
       * @param {String} pathsStr 组件在UI树中相对Page元素的位置
       * @returns {null}
       */
      findComponent(guid, mod) {
        return findComponentByGuid(this.$Elements, guid);
      },

      /**调用组件上的方法
       * @param {Component} component 组件
       * @param {String} methodName 方法名
       * @param {Event} event 事件
       */
      execMethod(component, methodName, event) {
        if (component == null)
          return;

        let method = component[methodName];  //找到绑定的方法

        try {
          if (method)
            method.call(component, event);
          else
            console.error("方法未找到", methodName);
        }
        catch (ex) {
          console.error(ex.message);
        }
      },

      /**事件总代理，由于小程序只支持绑定page上的方法，因此创建此方法，用于事件转发、代理
       * @param {Event} event 事件
       */
      $trigger(event) {
        //console.log(event, event.target.dataset);
        let dataset = event.currentTarget.dataset;
        let $guid = event.currentTarget.dataset.guid;

        let methodName = dataset.method || event.type;  //绑定的方法名 - 如果没自定义就默认使用事件名

        if ($guid == null) {
          console.error("应对绑定事件的元素设置属性 data-guid=\"{{$guid}}\" ，否则无法区别组件！");
          return;
        }

        let component;
        if (dataset.emit != null)
          component = this.findComponent($guid).$parent;
        else
          component = this.findComponent($guid);


        if (component == null)
          console.error("根据指定的data-guid属性，无法找到对应的组件！");
        this.execMethod(component, methodName, event);
      },
      created() {
        let initNodeTree = (mod) => {
          for (let key in (mod.$Elements || {})) {
            let component = mod.$Elements[key];
            if (component.created) {
              component.created((mod.$root || mod), mod);
            }
            initNodeTree(component);

            if (!key.startsWith('$')) {
              if (mod.data != null)
                mod.data['$' + key] = component;
              mod.$Elements['$' + key] = component;
              delete mod.$Elements[key];
            }
            else
              mod.data[key] = component;

          }
          if (mod.$parent != null)
            delete mod.$Elements;
        };

        let computeds = this.computed;
        for (let key in this.computed) {
          let method = computeds[key];
          Object.defineProperties(this.data, {
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
          })
        }

        initNodeTree(this);
      }
    });

    this.created();
  }
}