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
      <div class="tab-contain">
        <div class="tab-box" @click="selectTab(0)">
          <div class="tab-content" :class="nowIndex === 0 ? 'heavy' : 'nomal'">自选检查部分</div>
          <div class="tab-line" v-if="nowIndex === 0"></div>
        </div>
        <div class="tab-box" @click="selectTab(1)">
          <div class="tab-content" :class="nowIndex === 1 ? 'heavy' : 'nomal'">基础检查部分</div>
          <div class="tab-line" v-if="nowIndex === 1"></div>
        </div>
      </div>
      <div class="list-contain-out" v-if="nowIndex === 0">
        <div class="list-contain" v-if="selfList.length > 0">
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
        <div class="empty-box" v-if="selfList.length === 0">
          <img class="empty-icon" src="../../assets/images/empty.png" />
          <div class="empty-content">还没有自选项目...</div>
        </div>
        <div v-if="timeBox" class="order-contain">
          <div class="order-box">
            <div class="order-tips">
              <div class="order-title">订单编号：</div>
              <div class="order-content">{{orderData.orderNum}}</div>
            </div>
            <div class="order-tips">
              <div class="order-title">下单时间：</div>
              <div class="order-content">{{orderData.orderTime}}</div>
            </div>
          </div>
          <div class="order-box">
            <div class="order-tips">
              <div class="order-title">支付方式：</div>
              <div class="order-content">{{orderData.payStatus}}</div>
            </div>
            <div class="order-tips">
              <div class="order-title">支付时间：</div>
              <div class="order-content">{{orderData.payTime}}</div>
            </div>
          </div>
        </div>
        <div class="compute-box compute-small" v-if="selfList.length > 0">
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
          <div class="total-contain">
            <div class="total-text">合计：</div>
            <div class="total-price">￥{{finalPrice}}</div>
          </div>
        </div>
        <div v-if="!timeBox" class="pay-contain">
          <div class="pay-title">支付方式：</div>
          <div class="pay-box" @click="changePayType(0)">
            <div class="pay-left">
              <img src="../../assets/images/ic-paywx.png" class="pay-left-icon" />
              <div class="pay-left-content">微信支付</div>
            </div>
            <img v-if="payType === 0" src="../../assets/images/ic-select.png" class="select-icon" />
            <img v-if="payType === 1" src="../../assets/images/ic-noselect.png" class="select-icon" />
          </div>
          <div class="pay-box" @click="changePayType(1)">
            <div class="pay-left">
              <img src="../../assets/images/ic-paycash.png" class="pay-left-icon" />
              <div class="pay-left-content">到院支付（使用现金、社保卡的请选择该项）</div>
            </div>
            <img v-if="payType === 1" src="../../assets/images/ic-select.png" class="select-icon" />
            <img v-if="payType === 0" src="../../assets/images/ic-noselect.png" class="select-icon" />
          </div>
        </div>
      </div>
      <div class="list-contain-out" v-if="nowIndex === 1">
        <div class="list-contain-must">
          <div class="for-box">
            <div class="box-contain" v-for="(items, idx) in mustList" :key="idx">
              <div class="box-name">{{items.name}}</div>
              <div class="box-content">{{items.intro}}</div>
              <img class="corner-tag" src="../../assets/images/ic-must-corner.png" />
            </div>
          </div>
          <div v-if="timeBox" class="order-contain">
            <div class="order-box">
              <div class="order-tips">
                <div class="order-title">订单编号：</div>
                <div class="order-content">{{orderData.orderNum}}</div>
              </div>
              <div class="order-tips">
                <div class="order-title">下单时间：</div>
                <div class="order-content">{{orderData.orderTime}}</div>
              </div>
            </div>
            <div class="order-box">
              <div class="order-tips">
                <div class="order-title">支付方式：</div>
                <div class="order-content">{{orderData.payStatus}}</div>
              </div>
              <div class="order-tips">
                <div class="order-title">支付时间：</div>
                <div class="order-content">{{orderData.payTime}}</div>
              </div>
            </div>
          </div>
          <div class="compute-box" v-if="selfList.length > 0">
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
            <div class="total-contain">
              <div class="total-text">合计：</div>
              <div class="total-price">￥{{finalPrice}}</div>
            </div>
          </div>
        </div>
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
          <div class="price">{{finalPrice}}</div>
        </div>
        <!-- <div class="price-content">到院自费金额</div> -->
      </div>
      <button class="confirm-btn" @click="getCode">确认选择</button>
    </div>
    <!-- <div class="bottom-box" v-if="timeBox && leftTime > 0">
      <div class="time-bottom-left">
        <div class="time-price-box">{{leftContent}}</div>
        <div class="time-price-content">如需调整，请在倒计时结束前戳右方</div>
      </div>
      <button class="confirm-btn" @click="changeCheck">去调整</button>
    </div> -->
    <div class="bottom-box" v-if="timeBox">
      <button class="left-btn" @click="forOthers">为他人选择</button>
      <button class="right-btn" @click="turnToCancel">我要修改</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { wexinPay } from '@/script/wx/wxsdk.js'

export default {
  name: 'Home',
  data () {
    return {
      code: '',
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
      isActive: false,
      info: '',
      orderData: '',
      payType: 1 // 支付方式选择   0 微信   1 现金
    }
  },
  components: {
  },
  created () {
    let info = localStorage.getItem('USER')
    this.info = JSON.parse(info)
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'success') { // 这个name是下一级页面的路由name
      to.meta.isBack = true // 设置为true说明你是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
    }
    next()
  },
  activated () {
    if (localStorage.getItem('loginTemp')) {
      let infotemp = JSON.parse(localStorage.getItem('loginTemp'))
      this.selfList = infotemp.selfList
      this.mustList = infotemp.mustList
      this.totalPrice = infotemp.totalPrice
      this.cutPrice = infotemp.cutPrice
      this.ninePrice = infotemp.ninePrice
      this.finalPrice = infotemp.finalPrice
      this.payType = infotemp.payType
      localStorage.removeItem('loginTemp')
      this.getCode()
      return false
    }
    console.log(!this.$route.meta.isBack)
    console.log(this.isFirstEnter)
    console.log(!this.$route.params.checkStatus)
    if ((!this.$route.meta.isBack || this.isFirstEnter) && !this.$route.params.checkStatus) {
      console.log('111')
      this.getDataFn() // 这里发起数据请求，（之前是放在created或者mounted中，现在只需要放在这里就好了，不需要再在created或者mounted中请求！！）
    } else {
      console.log('222')
      this.timeBox = true
      this.getCheckData()
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
    console.log('this.$route.params.checkStatus:', this.$route.params.checkStatus)
    // if (this.$route.params.checkStatus) {
    //   this.timeBox = true
    //   this.getCheckData()
    // }
  },
  methods: {
    getCode () { // 非静默授权，第一次有弹框
      if (this.payType === 1) {
        this.confirm()
      } else if (this.payType === 0) {
        this.code = ''
        var local = window.location.href // 获取页面url
        var appid = 'wxe31cb7d48cc075a6'
        this.code = this.getUrlCode().code // 截取code
        console.log('获取到的code：', this.code)
        if (this.code == null || this.code === '') { // 如果没有code，则去请求
          let loginTemp = {
            selfList: this.selfList,
            mustList: this.mustList,
            totalPrice: this.totalPrice,
            cutPrice: this.cutPrice,
            ninePrice: this.ninePrice,
            finalPrice: this.finalPrice,
            payType: this.payType
          }
          localStorage.setItem('loginTemp', JSON.stringify(loginTemp))
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
        } else {
          this.payOrder()
        }
      }
    },
    getUrlCode () { // 截取url中的code方法
      var url = location.search
      this.winUrl = url
      var theRequest = new Object()
      if (url.indexOf('?') != -1) {
        var str = url.substr(1)
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1])
        }
      }
      return theRequest
    },
    wxPay () {
      // 根据订单信息从后台获取微信配置参数(和后台商定数据格式,作相应的处理)
      this.payOrder()
    },
    payOrder () {
      let code = this.code
      let that = this
      console.log(code)
      axios({
        method: 'get',
        baseURL: 'https://app.sfsdsrmyy.com/app/',
        url: 'examined/wxpay',
        params: { code: code, token: localStorage.getItem('LOGIN_TOKEN') }
      }).then(res => {
        // 调用封装的支付函数
        let data = res.data.data
        let api = JSON.parse(data.api)
        console.log(api)
        wexinPay(api).then(res => {
          console.log('支付成功')
          that.confirm()
        }).catch(e => {
          console.log(e, '支付失败')
        })
      })
    },
    forOthers () {
      let that = this
      that.isActive = true
      axios({
        method: 'post',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'https://app.sfsdsrmyy.com/app/',
        url: 'examined/loginOut',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {}
      }).then(function (res) {
        that.isActive = false
        if (res.data.msg === '退出登录成功') {
          localStorage.removeItem('LOGIN_TOKEN')
          localStorage.removeItem('USER')
          localStorage.removeItem('JWT_TOKEN')
          localStorage.removeItem('hasBook')
          that.$router.push({ name: 'home', params: { loginOut: true } })
        } else {
          if (res.data.status === '201') {
            localStorage.removeItem('LOGIN_TOKEN')
            localStorage.removeItem('USER')
            localStorage.removeItem('JWT_TOKEN')
            localStorage.removeItem('hasBook')
            that.$router.push({ name: 'home', params: { loginOut: true } })
          } else {
            that.$toast(res.data.msg)
          }
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
    },
    turnToCancel () {
      this.$router.push({ name: 'cancel', params: { pay: this.orderData.payStatus } })
    },
    changePayType (type) {
      this.payType = type
    },
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
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'https://app.sfsdsrmyy.com/app/',
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
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'https://app.sfsdsrmyy.com/app/',
        url: 'examined/getUserCategory',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {}
      }).then(function (res) {
        that.isActive = false
        if (res.data.status === '200') {
          that.orderData = res.data.data.order
          that.totalPrice = res.data.data.total_price
          that.cutPrice = res.data.data.subsidies
          that.ninePrice = res.data.data.beyond_price
          that.finalPrice = res.data.data.final_price
          that.leftTime = res.data.data.time_end
          if (res.data.data.time_end > 0) {
            that.countTime(res.data.data.time_end)
          }
          that.downData(res.data.data.list)
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
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'https://app.sfsdsrmyy.com/app/',
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
        if (res.data.status === '200') {
          localStorage.setItem('hasBook', true)
          that.$router.push({ name: 'success', params: { prompt: res.data.data.prompt } })
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
    selectTab (idx) {
      this.nowIndex = idx
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
}
.compute-small{
  border-bottom: 8px solid #F3F3F3!important;
  height: 189px!important;
}
.compute-box{
  padding: 8px 16px 0px;
  height: 261px;
  display: flex;
  flex-direction: column;
  border-bottom: 80px solid #F3F3F3;
  box-sizing: border-box;
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
  .total-contain{
    margin-top: 16px;
    border-top: 1px solid #eeeeee;
    padding: 16px 0 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .total-text{
      font-size:12px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(75,75,75,1);
      line-height:17px;
    }
    .total-price{
      margin-left: 4px;
      font-size:12px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(255,0,0,1);
      line-height:17px;
    }
  }
}
.order-contain{
  padding: 24px 16px;
  box-sizing: border-box;
  border-bottom: 8px solid #F2F2F2;
  .order-box{
    &:first-child{
      border-bottom: 1px solid #eeeeee;
      .order-tips{
        padding-bottom: 16px;
      }
    }
    &:last-child{
      .order-tips{
        padding-top: 16px;
      }
    }
    .order-tips{
      display: flex;
      align-items: center;
      .order-title{
        height:17px;
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(42,42,42,1);
        line-height:17px;
      }
      .order-content{
        margin-left: 4px;
        height:17px;
        font-size:12px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(42,42,42,1);
        line-height:17px;
      }
    }
  }
}
.body-contain{
  overflow-x: hidden;
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
    padding-top: 24px;
    box-sizing: border-box;
    z-index: 2;
    .tab-contain{
      height: 31px;
      .tab-box{
        width: 50%;
        align-items: center;
        height: 31px;
        float: left;
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
          margin-left: 78px;
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
      .pay-contain{
        padding: 0 16px;
        height: 232px;
        box-sizing: border-box;
        border-bottom: 80px solid #F3F3F3;
        .pay-title{
          padding: 24px 0 16px;
          box-sizing: border-box;
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(42,42,42,1);
          line-height:17px;
          border-bottom: 1px solid #eeeeee;
        }
        .pay-box{
          margin-top: 16px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .pay-left{
            display: flex;
            align-items: center;
            .pay-left-icon{
              width: 19px;
              height: 19px;
            }
            .pay-left-content{
              margin-left: 9px;
              height:17px;
              font-size:12px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(42,42,42,1);
              line-height:17px;
            }
          }
          .select-icon{
            width: 19px;
            height: 19px;
          }
        }
      }
      .empty-box{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .empty-icon{
          width: 250px;
          height: 160px;
          margin-top: 79px;
        }
        .empty-content{
          margin-top: 8px;
          height:22px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(75,75,75,1);
          line-height:22px;
        }
      }
      .list-contain-must{
        padding: 24px 0 0;
        .for-box{
          padding: 0 16px 24px;
          border-bottom: 8px solid #FAFAFA;
        }
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
    z-index: 999;
    background:rgba(255,255,255,1);
    border:1px solid rgba(242,242,242,1);
    .left-btn{
      width:163px;
      height:32px;
      background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
      border-radius:16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size:15px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:20px;
      border: 0!important;
    }
    .right-btn{
      width:163px;
      height:32px;
      background:rgba(255,255,255,1);
      border-radius:16px;
      border:1px solid rgba(18,178,111,1);
      font-size:15px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(18,178,111,1);
      line-height:20px;
      border:1px solid rgba(18,178,111,1);
    }
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
    position: fixed;
    bottom: 56px;
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
      padding: 32px 24px 16px;
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
