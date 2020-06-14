<template>
  <div class="body-contain" :class="showChangeCheck ? 'overflowhidden' : 'overflowauto'">
    <vue-element-loading :active="isActive" spinner="bar-fade-scale" color="#FF6700"/>
    <!-- 顶部背景图 -->
    <img class="back-image" src="../../assets/images/ic-back.png" />
    <!-- 顶部title盒子 -->
    <div class="top-box">
      <div class="top-title">
        <div class="name-box">{{info.name}}的体检计划</div>
        <div class="tag-box">{{info.profession === '非职业' ? '非职业病高发工种' : '职业病高发工种'}}</div>
      </div>
      <div class="top-content">{{info.age}}岁 {{info.sex}} {{info.pregnantString === '非备孕' ? '非备孕期/孕期' : '备孕期/孕期'}}</div>
    </div>
    <div class="green-back"></div>
    <!-- 主体部分 -->
    <div class="body-box">
      <div class="body-title">推荐套餐</div>
      <div class="box-contain" v-for="(items, idx) in checkList" :key="idx">
        <div class="box-name">{{items.name}}</div>
        <div class="box-content">{{items.intro}}</div>
        <img class="corner-tag" src="../../assets/images/ic-must-corner.png" />
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="pop-contain" @touchmove.prevent v-if="showChangeCheck">
      <div class="back-hover" @click="hideCheck"></div>
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
          <div class="price">{{price}}</div>
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
      idRight: true,
      popShow: false,
      price: 0,
      isActive: false,
      info: '',
      leftTime: '',
      timeBox: false,
      showChangeCheck: false,
      step: 2,
      leftContent: '',
      checkList: []
    }
  },
  components: {
  },
  created () {
    console.log('status:', this.$route.params.status)
    let info = localStorage.getItem('USER')
    this.info = JSON.parse(info)
    this.getDataListw()
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
    hideCheck () {
      this.showChangeCheck = false
    },
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
        that.isActive = false
        that.showChangeCheck = false
        that.timeBox = false
        if (res.data.status === '200') {
          // 成功了
          localStorage.setItem('USER', JSON.stringify(res.data.data.user))
          that.$router.push({ name: 'main', params: { is_adjus: true } })
        } else {
          if (res.data.status === '201') {
            that.$router.push({ name: 'home', params: { reload: true } })
          } else {
            that.$toast(res.data.msg)
          }
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
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
        if (res.data.status === '200') {
          that.leftTime = res.data.data.time_end
          if (res.data.data.time_end > 0) {
            that.countTime(res.data.data.time_end)
          }
        } else {
          if (res.data.status === '201') {
            that.$router.push({ name: 'home', params: { reload: true } })
          } else {
            that.$toast(res.data.msg)
          }
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
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
    getDataListw () {
      this.isActive = true
      console.log('this.info:', this.info)
      this.is_adjus = this.$route.params.is_adjus || false
      let that = this
      axios({
        method: 'get',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/RecommendedPackages',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        params: {
          pregnant: this.info.pregnant,
          profession: this.info.profession === '非职业' ? 0 : 1,
          is_adjus: this.is_adjus
        }
      }).then(function (res) {
        that.isActive = false
        if (res.data.status === '200') {
          that.checkList = res.data.data.list
          console.log('拉取到的推荐套餐为：', that.checkList)
        } else {
          if (res.data.status === '201') {
            that.$router.push({ name: 'home', params: { reload: true } })
          } else {
            that.$toast(res.data.msg)
          }
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
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
      this.isActive = true
      let that = this
      let info = JSON.parse(localStorage.getItem('USER'))
      axios({
        method: 'post',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/SubmitRecommendedPackages',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {
          pregnant: info.pregnant,
          profession: info.profession === '非职业' ? 0 : 1
        }
      }).then(function (res) {
        that.isActive = false
        if (res.data.status === '200') {
          that.$router.push({ name: 'success' })
        } else {
          if (res.data.status === '201') {
            that.$router.push({ name: 'home', params: { reload: true } })
          } else {
            that.$toast(res.data.msg)
          }
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overflowhidden{
  overflow: hidden;
}
.overflowauto{
  overflow: auto;
}
.green-back{
  background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
  position: absolute;
  width: 100%;
  height: 150px;
  top: 0;
  overflow-x: hidden;
}
.body-contain{
  width: 100%;
  height: 100%;
  background: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  .back-image{
    position: absolute;
    top: 20px;
    right: 24px;
    width: 113px;
    height: 116px;
    z-index: 2;
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
    padding: 24px 16px 78px;
    box-sizing: border-box;
    z-index: 2;
    .body-title{
      height:22px;
      font-size:16px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(42,42,42,1);
      line-height:22px;
      margin-bottom: 24px;
    }
    .box-contain{
      width: 100%;
      height:auto!important;
      height: 63px;
      min-height:63px;
      padding-left: 12px;
      padding-top: 12px;
      box-sizing: border-box;
      background:rgba(240,255,239,1);
      border-radius:8px;
      border:1px solid rgba(18,178,111,1);
      position: relative;
      overflow: hidden;
      margin-bottom: 12px;
      .box-name{
        height:20px;
        font-size:14px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(18,178,111,1);
        line-height:20px;
        // overflow: hidden;
        // text-overflow:ellipsis;
        // white-space: nowrap;
      }
      .box-content{
        margin-top: 2px;
        height:17px;
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(18,178,111,1);
        line-height:17px;
        // overflow: hidden;
        // text-overflow:ellipsis;
        // white-space: nowrap;
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
