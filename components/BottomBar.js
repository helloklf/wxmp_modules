import Component from '../extension/Component.js'

export default class BottomBar extends Component {
  constructor(datas) {
    super({
      datas, components: {

      }
    });

    this.template = "#BottomBar";
    Object.assign(this.data, {
      la: "21123",
      links: [
        {
          label: "首页",
          url: "/"
        },
        {
          label: "购物车",
          url: "/cart"
        },
        {
          label: "用户中心",
          url: "/user"
        }
      ]
    });



    Object.assign(this.methods, {
      openPage(event) {
        let dataset = event.currentTarget.dataset;
        let hash = dataset.hash;
        let page = this.links[dataset.index];
        this.$emit("opentab", page.url)
        wx.showToast({
          title: page.label,
        });
      }
    });

    Object.assign(this.computed, {})
  }
}