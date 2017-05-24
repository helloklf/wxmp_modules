import Component from '../extension/Component.js'
import MessageDetails from './MessageDetails.js'

export default class MessageList extends Component {
  constructor(datas) {
    super({
      datas, components: {

      }
    });

    Object.assign(this.data, {
      datas: [
        {
          id: 1,
          title: "系统通知",
          desc: "恭喜你成为幸运用户，免费获得VIP体验资格7天！"
        }, {
          id: 2,
          title: "活动公告",
          desc: "近期活动上线，欢迎参加获取丰厚大礼！"
        }
      ],
      currentSelected: {}
    })

    Object.assign(this.methods, {
      itemClick(e) {
        let row = this.datas[e.currentTarget.dataset.row];
        if (this.currentSelected.id == row.id)
          this.currentSelected = {
            id:null,
            title:null,
            desc:null
           };
        else
          this.currentSelected = row;
      }
    })

    this.template = "#MessageList";

    Object.assign(this.$Elements, {
      MessageDetails: new MessageDetails()
    });
  }
}