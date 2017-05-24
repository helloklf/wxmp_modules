// pages/index/index.js

import { PageAbstract, Component } from '../../extension/extension.js'
import BottomBar from '../../components/BottomBar.js'
import UserInfo from '../../components/UserInfo.js'
import MessageList from '../../components/MessageList.js'


let viewmodel = new PageAbstract({
  data: {
    time: new Date().toLocaleTimeString()
  },
  components: {

  },
  $Elements: {
    'BottomBar': new BottomBar(),
    'UserInfo': new UserInfo(),
    'MessageList': new MessageList()
  },
  computed: {
    desc() {
      //TODO：计算属性作用域
      return ">>>声明的计算属性"
    }
  },
  opentab(url) {
    console.log("导航->", url);
  },
  onexit() {
    /**
     ....清理本地缓存等....
    */

    wx.showToast({
      title: "已退出用户登陆！"
    });
  }
});



console.info("页面已创建", viewmodel);
Page(viewmodel);