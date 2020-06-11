<template>
  <div class="body-contain">
    <!-- 顶部背景图 -->
    <img class="back-image" src="../../assets/images/ic-back.png" />
    <!-- 顶部title盒子 -->
    <div class="top-box">
      <div class="top-title">
        <div class="name-box">李磊的体检计划</div>
        <div class="tag-box">非职业病高发工种</div>
      </div>
      <div class="top-content">26岁 男 处于备孕期</div>
    </div>
    <!-- 主体部分 -->
    <div class="body-box">
      <div class="tab-contain">
        <div class="tab-box" @click="selectTab(0)">
          <div class="tab-content" :class="nowIndex === 0 ? 'heavy' : 'nomal'">自选检查部分</div>
          <div class="tab-line" v-show="nowIndex === 0"></div>
        </div>
        <div class="tab-box" @click="selectTab(1)">
          <div class="tab-content" :class="nowIndex === 1 ? 'heavy' : 'nomal'">基础检查部分</div>
          <div class="tab-line" v-show="nowIndex === 1"></div>
        </div>
      </div>
      <div class="list-contain-out" v-if="nowIndex === 0">
        <div class="list-contain">
          <div class="other-box" v-for="(items, idx) in selfList" :key="idx">
            <img class="corner-tag" src="../../assets/images/ic-done-corner.png" />
            <div class="other-title" :class="items.checked ? 'checkedtitle' : 'nocheckedtitle'">{{items.name}}</div>
            <div class="other-subtitle" :class="items.checked ? 'checkedsub' : 'nocheckedsub'">{{items.subName}}</div>
            <div class="price-box">
              <div class="rmb">￥</div>
              <div class="price">{{items.price}}</div>
            </div>
          </div>
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
      </div>
      <div class="list-contain-out" v-if="nowIndex === 1">
        <div class="list-contain-must">
          <div class="box-contain" v-for="(items, idx) in mustList" :key="idx">
            <div class="box-name">{{items.name}}</div>
            <div class="box-content">{{items.content}}</div>
            <img class="corner-tag" src="../../assets/images/ic-must-corner.png" />
          </div>
        </div>
      </div>
    </div>
    <!-- 底部固定 -->
    <div class="bottom-box">
      <div class="bottom-left">
        <div class="price-box">
          <div class="rmb">¥</div>
          <div class="price">{{finalPrice}}</div>
        </div>
        <div class="price-content">到院自费金额</div>
      </div>
      <button class="confirm-btn" @click="confirm">确认选择</button>
    </div>
  </div>
</template>

<script>
import { GetNewsList } from '@ajax'
export default {
  name: 'Home',
  data () {
    return {
      isFirstEnter: false,
      idRight: true,
      popShow: false,
      price: 0,
      selfList: [],
      mustList: [],
      totalPrice: 0,
      cutPrice: 0,
      ninePrice: 0,
      finalPrice: 0,
      nowIndex: 0
    }
  },
  components: {
  },
  created () {
    GetNewsList().then(res => {
      console.log(res)
    })
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'success') { // 这个name是下一级页面的路由name
      to.meta.isBack = true // 设置为true说明你是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
    }
    next()
  },
  activated () {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      // this.initData() // 这里许要初始化dada()中的数据
      this.getDataFn() // 这里发起数据请求，（之前是放在created或者mounted中，现在只需要放在这里就好了，不需要再在created或者mounted中请求！！）
    }
    this.$route.meta.isBack = false // 请求完后进行初始化
    this.isFirstEnter = false// 请求完后进行初始化
  },
  computed: {
    popTitle () {
      return this.idRight ? '是否处于备孕期？' : '抱歉！该体检项目预约方式为卷烟厂员工专属通道'
    },
    popContent () {
      return this.idRight
    }
  },
  mounted () {
  },
  methods: {
    getDataFn () {
      console.log('status:', this.$route.params.data)
      this.selfList = this.$route.params.data.finalArry
      this.mustList = this.$route.params.data.mustList
      this.totalPrice = this.$route.params.data.totalPrice
      this.cutPrice = this.$route.params.data.cutPrice
      this.ninePrice = this.$route.params.data.ninePrice
      this.finalPrice = this.$route.params.data.finalPrice
    },
    showPop () {
      this.popShow = true
    },
    hidePop () {
      this.popShow = false
    },
    inputChange (e) {
      this.idNum = e.target.value
    },
    confirm () {
      this.$router.push({ name: 'success', params: { price: this.finalPrice } })
    },
    selectTab (idx) {
      this.nowIndex = idx
    }
  }
}
</script>

<style lang="scss" scoped>
.body-contain{
  width: 100%;
  height: 100%;
  background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  .back-image{
    position: absolute;
    top: 20px;
    right: 24px;
    width: 113px;
    height: 116px;
  }
  .top-box{
    display: flex;
    flex-direction: column;
    margin: 0 0 32px 24px;
    padding-top: 32px;
    z-index: 2;
    .top-title{
      display: flex;
      .name-box{
        height:33px;
        font-size:24px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:33px;
      }
      .tag-box{
        margin: 6px 0 0 8px;
        height:16px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        padding: 0 4px;
        display: flex;
        align-items: center;
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(32,186,93,1);
        line-height:12px;
      }
    }
    .top-content{
      margin-top: 4px;
      height:20px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:20px;
      z-index: 2;
    }
  }
  .body-box{
    display: flex;
    flex: 1;
    background:rgba(255,255,255,1);
    border-radius:8px 8px 0px 0px;
    width: 100%;
    flex-direction: column;
    padding-top: 24px;
    box-sizing: border-box;
    z-index: 2;
    .tab-contain{
      display: flex;
      justify-content: space-between;
      .tab-box{
        width: 164px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .tab-content{
          width: 100%;
          text-align: center;
          height:22px;
          font-size:16px;
          line-height:22px;
        }
        .heavy{
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          color:rgba(42,42,42,1);
        }
        .nomal{
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(75,75,75,1);
        }
        .tab-line{
          margin-top: 4px;
          width:32px;
          height:5px;
          background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
          border-radius:2px;
        }
      }
    }
    .list-contain-out{
      .list-contain{
        padding: 24px 16px;
        border-bottom: 8px solid #F2F2F2;
        .other-box{
          display: flex;
          flex-direction: column;
          border-radius:8px;
          background:rgba(240,255,239,1);
          border:1px solid rgba(18,178,111,1);
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          padding: 12px;
          box-sizing: border-box;
          .corner-tag{
            position: absolute;
            top: 0;
            right: 0;
            width: 32px;
            height: 32px;
          }
          .other-title{
            height:20px;
            font-size:14px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            line-height:20px;
            color:rgba(18,178,111,1);
          }
          .other-subtitle{
            margin-top: 2px;
            height:17px;
            font-size:12px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(75,75,75,1);
            line-height:17px;
            color:rgba(18,178,111,1);
          }
          .price-box{
            margin-top: 6px;
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
      }
      .compute-box{
        padding: 8px 16px 0px;
        height: 186px;
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
      .list-contain-must{
        padding: 24px 16px 0;
        .box-contain{
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 12px;
          box-sizing: border-box;
          background:rgba(240,255,239,1);
          border-radius:8px;
          border:1px solid rgba(18,178,111,1);
          position: relative;
          overflow: hidden;
          margin-bottom: 12px;
          &:last-child{
            margin-bottom: 78px!important;
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
      }

    }
  }
  .bottom-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 56px;
    padding: 0 16px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 11;
    background:rgba(255,255,255,1);
    border:1px solid rgba(242,242,242,1);
    .bottom-left{
      display: flex;
      align-items: flex-end;
      .price-box{
        display: flex;
        align-items: flex-end;
        .rmb{
          height:12px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,0,0,1);
          line-height:12px;
          display: flex;
        }
        .price{
          margin-left: 4px;
          height:18px;
          font-size:24px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(255,0,0,1);
          line-height:18px;
          display: flex;
        }
      }
      .price-content{
        margin-left: 8px;
        height:17px;
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(75,75,75,1);
        line-height:17px;
        margin-bottom: -4px;
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
      border: 0!important;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:20px;
    }
  }
}
</style>
