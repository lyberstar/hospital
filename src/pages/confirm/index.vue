<template>
  <div class="body-contain">
    <vue-element-loading :active="isActive" spinner="bar-fade-scale" color="#FF6700"/>
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
            <div class="other-subtitle" :class="items.checked ? 'checkedsub' : 'nocheckedsub'">{{items.intro}}</div>
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
            <div class="box-name">{{items.intro}}</div>
            <div class="box-content">{{items.mean}}</div>
            <img class="corner-tag" src="../../assets/images/ic-must-corner.png" />
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="pop-contain" v-if="showChangeCheck">
      <div class="back-hover"></div>
      <div class="pop-body" v-if="step === 2">
        <div class="pop-title-box">
          <div class="pop-title">您是否处于备孕期，或正在孕期？</div>
          <div class="pop-content">无论男女，如果您未来3个月有怀孕的打算，或正在孕期我们将为您去掉带有强辐射性等可能会影响胎儿的项目。</div>
        </div>
        <div class="button-box">
          <button class="color-btn" @click="recodeStatus(1)">最近三个月有怀孕打算或正在孕期</button>
          <div class="no-color" @click="recodeStatus(0)">不处于孕期，且最近三个月没有怀孕打算</div>
        </div>
      </div>
      <div class="pop-body" v-if="step === 3">
        <div class="pop-title-box">
          <div class="pop-title">您是否是职业病工种？</div>
          <div class="pop-content">是否是职业病工种将影响您的检查项目种类。</div>
        </div>
        <div class="button-box-next">
          <button class="color-btn-next" @click="recodePro(1)">是职业病工种</button>
          <button class="no-color-next" @click="recodePro(0)">不是职业病工种</button>
        </div>
      </div>
    </div>
    <!-- 底部固定 -->
    <div class="bottom-box" v-if="!timeBox">
      <div class="bottom-left">
        <div class="price-box">
          <div class="rmb">¥</div>
          <div class="price">{{finalPrice}}</div>
        </div>
        <div class="price-content">到院自费金额</div>
      </div>
      <button class="confirm-btn" @click="confirm">确认选择</button>
    </div>
    <div class="bottom-box" v-if="timeBox && leftTime > 0">
      <div class="time-bottom-left">
        <div class="time-price-box">{{leftContent}}</div>
        <div class="time-price-content">如需调整，请在倒计时结束前戳右方</div>
      </div>
      <button class="confirm-btn" @click="changeCheck">去调整</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  data () {
    return {
      isFirstEnter: false,
      idRight: true,
      price: 0,
      selfList: [],
      mustList: [],
      totalPrice: 0,
      cutPrice: 0,
      ninePrice: 0,
      finalPrice: 0,
      nowIndex: 0,
      sideList: [],
      timeBox: false,
      step: 2,
      leftContent: '',
      leftTime: '',
      showChangeCheck: false,
      isActive: false
    }
  },
  components: {
  },
  created () {
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'success') { // 这个name是下一级页面的路由name
      to.meta.isBack = true // 设置为true说明你是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
    }
    next()
  },
  activated () {
    if ((!this.$route.meta.isBack || this.isFirstEnter) && !this.$route.params.checkStatus) {
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
    if (this.$route.params.checkStatus) {
      this.timeBox = true
      this.getCheckData()
    }
  },
  methods: {
    changeCheck () {
      this.showChangeCheck = true
    },
    recodeStatus (idx) {
      this.pregnant = idx
      this.step = 3
    },
    recodePro (idx) {
      this.profession = idx
      this.isActive = true
      // 请求接口
      let that = this
      axios({
        method: 'post',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/getUserInfo',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {
          pregnant: this.pregnant,
          profession: this.profession
        }
      }).then(function (res) {
        if (res.data.status === '200') {
          // 成功了
          that.isActive = false
          localStorage.setItem('USER', JSON.stringify(res.data.data.user))
          that.$router.push({ name: 'main' })
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
    },
    getDataFn () {
      console.log('status:', this.$route.params.data.finalArry)
      this.selfList = this.$route.params.data.finalArry
      this.mustList = this.$route.params.data.mustList
      this.totalPrice = this.$route.params.data.totalPrice
      this.cutPrice = this.$route.params.data.cutPrice
      this.ninePrice = this.$route.params.data.ninePrice
      this.finalPrice = this.$route.params.data.finalPrice
    },
    getCheckData () {
      let that = this
      that.isActive = true
      axios({
        method: 'get',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/getUserCategory',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {}
      }).then(function (res) {
        that.isActive = false
        that.totalPrice = res.data.data.total_price
        that.cutPrice = res.data.data.subsidies
        that.ninePrice = res.data.data.beyond_price
        that.finalPrice = res.data.data.final_price
        that.leftTime = res.data.data.time_end
        if (res.data.data.time_end > 0) {
          that.countTime(res.data.data.time_end)
        }
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
        if (key === '心脑血管') {
          temp.checked = true
        }
        temp.chooseNum = 0
        temp.list = data[key]
        dataList.push(temp)
      }
      console.log('处理后的列表为：', dataList)
      this.sideList = dataList
      let finalArry = []
      for (let i = 1; i < this.sideList.length; i++) {
        for (let j = 0; j < this.sideList[i].list.length; j++) {
          if (this.sideList[i].list[j].checked) {
            finalArry.push(this.sideList[i].list[j])
          }
        }
      }
      this.mustList = this.sideList[0].list
      this.selfList = finalArry
    },
    countTime (differTime) {
      let that = this
      var h, m, s
      if (differTime >= 0) {
        h = Math.floor(differTime / 60 / 60)
        m = Math.floor(differTime / 60 % 60)
        s = Math.floor(differTime % 60)
        h = h < 10 ? ('0' + h) : h
        m = m < 10 ? ('0' + m) : m
        s = s < 10 ? ('0' + s) : s
        var timeDom = h + ':' + m + ':' + s
        this.leftContent = timeDom
        // 递归调用函数所以是延时器不是定时器
        setTimeout(function () {
          differTime -= 1
          that.countTime(differTime)
        }, 1000)
      } else {
        this.leftContent = '00:00:00'
      }
    },
    inputChange (e) {
      this.idNum = e.target.value
    },
    confirm () {
      let that = this
      that.isActive = true
      let info = JSON.parse(localStorage.getItem('USER'))
      let ids = []
      for (let i = 0; i < this.selfList.length; i++) {
        ids.push(this.selfList[i].id)
      }
      axios({
        method: 'post',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/entryData',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {
          pregnant: info.pregnant,
          profession: info.profession === '非职业' ? 0 : 1,
          base_medica: 1,
          pids: JSON.stringify(ids)
        }
      }).then(function (res) {
        that.isActive = false
        that.$router.push({ name: 'success', params: { prompt: res.data.data.prompt } })
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
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
    .time-bottom-left{
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      .time-price-box{
        height:18px;
        font-size:18px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(42,42,42,1);
        line-height:18px;
      }
      .time-price-content{
        margin-top: 2px;
        height:16px;
        font-size:11px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(75,75,75,1);
        line-height:16px;
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
      height:366px;
      background:rgba(255,255,255,1);
      border-radius:8px 8px 0px 0px;
      position: absolute;
      bottom: 0;
      padding: 32px 24px 72px;
      box-sizing: border-box;
      z-index: 11;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .pop-title-box{
        display: flex;
        flex-direction: column;
        .pop-title{
          font-size:18px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(42,42,42,1);
          line-height:26px;
        }
        .pop-content{
          margin-top: 16px;
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(91,91,91,1);
          line-height:20px;
          .green{
            float: left;
            color: #17B56A;
            margin: 0 4px;
          }
          .nomal{
            float: left;
          }
        }
      }
      .button-box{
        display: flex;
        flex-direction: column;
        .color-btn{
          width: 100%;
          height:40px;
          background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
          border-radius:4px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0!important;
        }
        .no-color{
          margin-top: 16px;
          width: 100%;
          text-align: center;
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(18,178,111,1);
          line-height:20px;
          height:20px;
        }
      }
      .button-box-next{
        display: flex;
        justify-content: space-between;
        .color-btn-next{
          width:153px;
          height:40px;
          background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
          border-radius:4px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0!important;
        }
        .no-color-next{
          width:153px;
          height:40px;
          border-radius:4px;
          border:1px solid rgba(26,180,116,1);
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(26,180,116,1);
          line-height:16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }
      }
    }
  }
}
</style>
