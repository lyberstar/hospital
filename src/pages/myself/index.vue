<template>
  <div class="body-contain">
    <vue-element-loading :active="isActive" spinner="bar-fade-scale" color="#FF6700"/>
    <!-- 侧边栏 -->
    <div class="sidebar-contain">
      <div @click="clickSider(idx)" class="sidebar-box" :class="items.checked ? 'checked' : 'nochecked'" v-for="(items, idx) in sideList" :key="idx">{{items.name}}<div class="choose-num" v-if="items.chooseNum > 0">{{items.chooseNum}}</div></div>
    </div>
    <!-- 主体部分 -->
    <div class="right-box">
      <div class="title-box">
        <div class="title">{{noTitle}}</div>
        <img v-if="noTitle === '基础检查'" class="must-icon" src="../../assets/images/ic-must.png" />
      </div>
      <div class="right-body">
        <!-- 基础检查 -->
        <block name="boxname" v-if="noTitle === '基础检查'">
          <div class="box-contain" v-for="(items, idx) in sideList[nowIndex].list" :key="idx">
            <div class="other-top checkedtop">
              <div class="box-name">{{items.name}}</div>
              <div class="box-content">{{items.intro}}</div>
              <img class="corner-tag" src="../../assets/images/ic-must-corner.png" />
            </div>
            <div class="other-bottom">
              <div class="content" v-if="items.open">{{items.mean}}</div>
              <div class="open-box" @click.stop="openDetail(idx)">
                <div class="open-text">{{items.open ? '收起详情' : '查看详情'}}</div>
                <img class="open-icon" v-if="items.open" src="../../assets/images/ic-top.png" />
                <img class="open-icon" v-else src="../../assets/images/ic-bottom.png" />
              </div>
            </div>
          </div>

        </block>
        <!-- 其他检查 -->
        <block v-else>
          <div @click="chooseItem(idx)" class="other-box" :class="items.checked ? 'checkedbox' : 'nocheckedbox'" v-for="(items, idx) in sideList[nowIndex].list" :key="idx">
            <img class="corner-tag" v-if="items.checked" src="../../assets/images/ic-done-corner.png" />
            <div class="other-top" :class="items.checked ? 'checkedtop' : 'nocheckedtop'">
              <div class="small-title-box">
                <div class="title" :class="items.checked ? 'checkedtitle' : 'nocheckedtitle'">{{items.name}}</div>
                <img class="tag-icon" v-if="items.showTag" src="../../assets/images/ic-book.png" />
              </div>
              <div class="subtitle" :class="items.checked ? 'checkedsub' : 'nocheckedsub'">{{items.intro}}</div>
              <div class="price-box">
                <div class="rmb">￥</div>
                <div class="price">{{items.price}}</div>
              </div>
            </div>
            <div class="other-bottom">
              <div class="content" v-if="items.open">{{items.mean}}</div>
              <div class="open-box" @click.stop="openDetail(idx)">
                <div class="open-text">{{items.open ? '收起详情' : '查看详情'}}</div>
                <img class="open-icon" v-if="items.open" src="../../assets/images/ic-top.png" />
                <img class="open-icon" v-else src="../../assets/images/ic-bottom.png" />
              </div>
            </div>
          </div>
        </block>
      </div>
    </div>
    <div class="bottom-box">
      <div class="left-box">
        <div class="com-price-box">
          <div class="com-rmb">￥</div>
          <p class="com-price">{{finalPrice}}</p>
          <div class="cut" v-if="cutPrice > 0">(公司补贴已减: ￥{{cutPrice}})</div>
          <div class="detail-look" v-if="cutPrice > 0" @click="showPop">查看明细</div>
        </div>
        <div class="tip-box">
          <div class="tip-left">{{topPrice}}</div>
          <div class="tip-right">享9折</div>
        </div>
      </div>
      <button class="confirm-btn" @click="confirm">确认选择</button>
    </div>
    <!-- 弹窗 -->
    <div class="pop-contain" v-if="popShow">
      <div class="back-hover" @click="hidePop"></div>
      <div class="pop-body">
        <div class="pop-top-box">
          <div class="pop-title">优惠明细</div>
          <img class="close-icon" @click="hidePop" src="../../assets/images/ic-close.png" />
        </div>
        <div class="compute-box">
          <div class="compute-item">
            <div class="compute-title">项目总额:</div>
            <div class="compute-price">￥{{totalPrice}}</div>
          </div>
          <div class="compute-item">
            <div class="compute-title">公司补贴:</div>
            <div class="compute-price">-￥{{cutPrice}}</div>
          </div>
          <div class="compute-item">
            <div class="compute-title">超出补贴部分9折:</div>
            <div class="compute-price">-￥{{ninePrice}}</div>
          </div>
        </div>
        <div class="total-cut">
          <div class="total-title">共优惠</div>
          <div class="total-cut-price">-￥{{totalCut}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  data () {
    return {
      sideList: [
        {
          name: '基础检查',
          checked: false,
          list: [
            {
              name: '一般检查',
              content: '身高、体重、血压和体重指数',
              checked: true,
              price: 0
            }
          ]
        },
        {
          name: '心脑血管',
          checked: true,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        },
        {
          name: '甲状腺',
          checked: false,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        },
        {
          name: '性激素',
          checked: false,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        },
        {
          name: '风湿免疫',
          checked: false,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        },
        {
          name: '肿瘤',
          checked: false,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        },
        {
          name: '消化系统',
          checked: false,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        },
        {
          name: '特殊检查',
          checked: false,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        },
        {
          name: '眼部检查',
          checked: false,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        },
        {
          name: '其他',
          checked: false,
          chooseNum: 0,
          list: [
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            },
            {
              name: '血流变检测',
              subName: '血粘度检查',
              detail: '适用高血压、动脉硬化、脑中风、糖尿病及高脂血症等患疾的检查。',
              showTag: true,
              price: 75,
              checked: false,
              open: false
            }
          ]
        }
      ],
      noTitle: '心脑血管',
      nowIndex: 2,
      popShow: false,
      isActive: false,
      is_adjus: false,
      finalPrice: 0,
      cutPrice: 0,
      totalPrice: 0,
      ninePrice: 0,
      totalCut: 0,
      topPriceNum: 380 // 最高免减
    }
  },
  components: {
  },
  created () {
    console.log('is_adjus:', this.$route.params.is_adjus)
    this.is_adjus = this.$route.params.is_adjus || false
    this.getDataList()
  },
  watch: {
  },
  computed: {
    topPrice () {
      return `您的公司补贴上限为 ¥${this.topPriceNum}，超出部分`
    }
  },
  mounted () {
  },
  methods: {
    setNewPrice () {
      // 算价格
      let totalPrice = 0
      this.sideList.forEach(function (data) {
        data.list.forEach(function (list) {
          if (list.checked) {
            totalPrice += parseFloat(list.price) || 0
          }
        })
      })
      this.finalPrice = (totalPrice - this.topPriceNum) * 0.9 > 0 ? ((totalPrice - this.topPriceNum) * 0.9).toFixed(1) : 0
      this.cutPrice = totalPrice > this.topPriceNum ? this.topPriceNum : totalPrice
      this.totalPrice = totalPrice
      this.ninePrice = (totalPrice - this.topPriceNum) * 0.1 > 0 ? ((totalPrice - this.topPriceNum) * 0.1).toFixed(1) : 0
      this.totalCut = (parseFloat(this.cutPrice) + parseFloat(this.ninePrice)).toFixed(1)
    },
    getDataList () {
      this.isActive = true
      let that = this
      this.is_adjus = this.$route.params.is_adjus || false
      axios({
        method: 'get',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/getUserCategory',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        params: {
          is_adjus: that.is_adjus
        }
      }).then(function (res) {
        that.isActive = false
        that.topPriceNum = res.data.data.subsidies
        that.downData(res.data.data.list)
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
    },
    downData (data) {
      let dataList = []
      for (const key in data) {
        let temp = {}
        temp.name = key
        temp.checked = false
        temp.chooseNum = 0
        if (key === '心脑血管') {
          temp.checked = true
        }
        if (key !== '基础检查') {
          for (let i = 0; i < data[key].length; i++) {
            if (data[key][i].checked) {
              temp.chooseNum += 1
            }
          }
        }
        temp.list = data[key]
        dataList.push(temp)
      }
      console.log('处理后的列表为：', dataList)
      this.sideList = dataList
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].name === '心脑血管') {
          this.nowIndex = i
        }
      }
      this.setNewPrice()
    },
    showPop () {
      this.popShow = true
    },
    hidePop () {
      this.popShow = false
    },
    clickSider (idx) {
      for (let i = 0; i < this.sideList.length; i++) {
        this.sideList[i].checked = false
      }
      this.sideList[idx].checked = true
      this.noTitle = this.sideList[idx].name
      this.nowIndex = idx
    },
    openDetail (idx) {
      this.sideList[this.nowIndex].list[idx].open = !this.sideList[this.nowIndex].list[idx].open
    },
    chooseItem (idx) {
      this.sideList[this.nowIndex].list[idx].checked = !this.sideList[this.nowIndex].list[idx].checked
      if (this.sideList[this.nowIndex].list[idx].checked) {
        this.sideList[this.nowIndex].chooseNum += 1
      } else {
        this.sideList[this.nowIndex].chooseNum -= 1
      }
      // 算价格
      let totalPrice = 0
      this.sideList.forEach(function (data) {
        data.list.forEach(function (list) {
          if (list.checked) {
            totalPrice += parseFloat(list.price) || 0
          }
        })
      })
      this.finalPrice = (totalPrice - this.topPriceNum) * 0.9 > 0 ? ((totalPrice - this.topPriceNum) * 0.9).toFixed(1) : 0
      this.cutPrice = totalPrice > this.topPriceNum ? this.topPriceNum : totalPrice
      this.totalPrice = totalPrice
      this.ninePrice = (totalPrice - this.topPriceNum) * 0.1 > 0 ? ((totalPrice - this.topPriceNum) * 0.1).toFixed(1) : 0
      this.totalCut = (parseFloat(this.cutPrice) + parseFloat(this.ninePrice)).toFixed(1)
    },
    confirm () {
      // 把选中的提出来传到下一个页面
      let finalArry = []
      for (let i = 1; i < this.sideList.length; i++) {
        for (let j = 0; j < this.sideList[i].list.length; j++) {
          if (this.sideList[i].list[j].checked) {
            finalArry.push(this.sideList[i].list[j])
          }
        }
      }
      let data = {
        finalPrice: this.finalPrice,
        totalPrice: this.totalPrice,
        cutPrice: this.cutPrice,
        ninePrice: this.ninePrice,
        finalArry: finalArry,
        mustList: this.sideList[0].list
      }
      console.log(data)
      this.$router.push({ name: 'confirm', params: { data } })
    }
  }
}
</script>

<style lang="scss" scoped>
.body-contain{
  width: 100%;
  height: 100%;
  background: #ffffff;;
  position: relative;
  display: flex;
  .sidebar-contain{
    display: flex;
    flex-direction: column;
    width: 95px;
    background:rgba(246,246,246,1);
    .sidebar-box{
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size:14px;
      font-family:Alibaba-PuHuiTi-R,Alibaba-PuHuiTi;
      font-weight:normal;
      color:rgba(42,42,42,1);
      line-height:20px;
      position: relative;
      .choose-num{
        position: absolute;
        top: 2px;
        right: 2px;
        padding: 1px 2px;
        height:13px;
        background:rgba(255,0,0,1);
        border-radius:7px;
        box-sizing: border-box;
        font-size:11px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:11px;
        min-width: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .checked{
      background:rgba(255,255,255,1);
    }
    .nochecked{
      background:rgba(246,246,246,1);
    }
  }
  .right-box{
    flex: 1;
    height: 100%;
    background: #ffffff;
    padding: 0 12px;
    overflow-y: scroll;
    .title-box{
      padding: 11px 0 8px;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      .title{
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(42,42,42,1);
        line-height:20px;
      }
      .must-icon{
        margin-left: 6px;
        width: 39px;
        height: 16px;
      }
    }
    .right-body{
      display: flex;
      flex-direction: column;
      .box-contain{
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-radius:8px;
        border:1px solid rgba(18,178,111,1);
        position: relative;
        overflow: hidden;
        margin-bottom: 11px;
        &:last-child{
          margin-bottom: 78px!important;
        }
        &:first-child{
          margin-top: 12px;
        }
        .other-bottom{
          display: flex;
          flex-direction: column;
          .content{
            padding: 6px 12px;
            font-size:11px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(75,75,75,1);
            line-height:16px;
            border-bottom: 1px solid #EEEEEE;
          }
          .open-box{
            padding: 4px 0 4px 12px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            .open-text{
              height:16px;
              font-size:11px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(75,75,75,1);
              line-height:16px;
            }
            .open-icon{
              margin-left: 4px;
              width: 11px;
              height: 11px;
            }
          }
        }
        .other-top{
          padding: 12px;
          background:rgba(240,255,239,1);
        }
        .box-name{
          height:20px;
          font-size:14px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(18,178,111,1);
          line-height:20px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .box-content{
          margin-top: 2px;
          height:17px;
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(18,178,111,1);
          line-height:17px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .corner-tag{
          position: absolute;
          top: 0;
          right: 0;
          width: 32px;
          height: 32px;
        }
      }
      .other-box{
        display: flex;
        flex-direction: column;
        border-radius:8px;
        background:rgba(255,255,255,1);
        margin-bottom: 12px;
        position: relative;
        overflow: hidden;
        &:last-child{
          margin-bottom: 78px!important;
        }
        .corner-tag{
          position: absolute;
          top: 0;
          right: 0;
          width: 32px;
          height: 32px;
        }
        &:first-child{
          margin-top: 12px;
        }
        .other-top{
          display: flex;
          flex-direction: column;
          padding: 12px 12px 6px 12px;
          box-sizing: border-box;
          .small-title-box{
            display: flex;
            align-items: center;
            .title{
              height:20px;
              font-size:14px;
              font-family:PingFangSC-Medium,PingFang SC;
              font-weight:500;
              line-height:20px;
            }
            .checkedtitle{
              color:rgba(18,178,111,1);
            }
            .nocheckedtitle{
              color:rgba(42,42,42,1);
            }
            .tag-icon{
              margin-left: 4px;
              width: 65px;
              height: 16px;
            }
          }
          .subtitle{
            margin-top: 2px;
            height:17px;
            font-size:12px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(75,75,75,1);
            line-height:17px;
          }
          .checkedsub{
            color:rgba(18,178,111,1);
          }
          .nocheckedsub{
            color:rgba(75,75,75,1);
          }
          .price-box{
            margin-top: 4px;
            display: flex;
            align-items: flex-end;
            .rmb{
              height:14px;
              font-size:10px;
              font-family:PingFangSC-Medium,PingFang SC;
              font-weight:500;
              color:rgba(255,0,0,1);
              line-height:14px;
              margin-bottom: 2px;
            }
            .price{
              margin-left: 2px;
              height:20px;
              font-size:14px;
              font-family:PingFangSC-Medium,PingFang SC;
              font-weight:500;
              color:rgba(255,0,0,1);
              line-height:20px;
            }
          }
        }
        .checkedtop{
          background:rgba(240,255,239,1);
        }
        .nocheckedtop{
          background:rgba(246,246,246,1);
        }
        .other-bottom{
          display: flex;
          flex-direction: column;
          .content{
            padding: 6px 12px;
            font-size:11px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(75,75,75,1);
            line-height:16px;
            border-bottom: 1px solid #EEEEEE;
          }
          .open-box{
            padding: 4px 0 4px 12px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            .open-text{
              height:16px;
              font-size:11px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(75,75,75,1);
              line-height:16px;
            }
            .open-icon{
              margin-left: 4px;
              width: 11px;
              height: 11px;
            }
          }
        }
      }
      .checkedbox{
        border:1px solid rgba(18,178,111,1);
      }
      .nocheckedbox{
        border:1px solid rgba(246,246,246,1);
      }
    }
  }
  .bottom-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    height: 56px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(242,242,242,1);
    z-index: 12;
    .left-box{
      width: 230px;
      .com-price-box{
        display: flex;
        align-items: flex-end;
        margin-top: 10px;
        .com-rmb{
          height:12px;
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,0,0,1);
          line-height:12px;
          margin-bottom: 1px;
        }
        .com-price{
          margin-left: 2px;
          height:18px;
          font-size:18px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(255,0,0,1);
          line-height:18px;
        }
        .cut{
          margin-left: 4px;
          height:18px;
          font-size:11px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,0,0,1);
          line-height:18px;
        }
        .detail-look{
          margin-left: 4px;
          height:15px;
          background:rgba(242,242,242,1);
          border-radius:4px;
          padding: 0 2px;
          display: flex;
          align-items: center;
          font-size:10px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(74,74,74,1);
          line-height:11px;
        }
      }
      .tip-box{
        margin-top: 2px;
        height:16px;
        font-size:11px;
        font-family:PingFangSC-Regular,PingFang SC;
        color:rgba(75,75,75,1);
        line-height:16px;
        .tip-left{
          float: left;
          font-weight:400;
        }
        .tip-right{
          float: left;
          font-weight: 600;
        }
      }
    }
    .confirm-btn{
      height:32px;
      background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
      border-radius:16px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 30px 0 24px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:20px;
      border: 0!important;
      margin-top: 12px;
    }
  }
  .pop-contain{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    .back-hover{
      width:100%;
      height:100%;
      background:rgba(0,0,0,0.5);
    }
    .pop-body{
      width:100%;
      height:383px;
      background:rgba(255,255,255,1);
      border-radius:8px 8px 0px 0px;
      position: absolute;
      bottom: 0;
      padding: 0px 24px;
      box-sizing: border-box;
      z-index: 11;
      display: flex;
      flex-direction: column;
      .pop-top-box{
        position: relative;
        padding: 16px 0;
        text-align: center;
        border-bottom: 1px solid #EEEEEE;
        .pop-title{
          height:22px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(42,42,42,1);
          line-height:22px;
        }
        .close-icon{
          position: absolute;
          top: 15px;
          right: 0;
          width: 24px;
          height: 24px;
        }
      }
      .compute-box{
        padding-bottom: 16px;
        border-bottom: 1px solid #EEEEEE;
        display: flex;
        flex-direction: column;
        .compute-item{
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          .compute-title{
            height:17px;
            font-size:12px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(42,42,42,1);
            line-height:17px;
          }
          .compute-price{
            height:17px;
            font-size:12px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(42,42,42,1);
            line-height:17px;
          }
        }
      }
      .total-cut{
        padding-top: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .total-title{
          height:22px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(42,42,42,1);
          line-height:22px;
        }
        .total-cut-price{
          height:22px;
          font-size:16px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(255,0,0,1);
          line-height:22px;
        }
      }
    }
  }
}
</style>
