import Component from '../extension/Component.js'

export default class UserInfo extends Component {
  constructor(datas) {
    super({
      datas, components: {

      }
    });

    Object.assign(this.data, {
      userName: "helloklf",
      uid: "qq1191634433",
      uHead:"http://ubmcmm.baidustatic.com/media/v1/0f000ZOE9p25vUWiL0-Y9s.jpg"
    })

    Object.assign(this.methods,{
      exit(e) {
        this.uHead = "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=981398028,392481368&fm=117&gp=0.jpg";
        this.userName = "请先登陆";
        this.uid = "无";

        this.$emit("onexit")
      },
      edit(e) {
        this.uHead = "http://img.infinitynewtab.com/weatherIcon/H.png";
        this.userName = "嘟嘟斯基";
        this.uid = "helloklf@outlook.com";
      }
    });

    this.template = "#UserInfo";
  }
}