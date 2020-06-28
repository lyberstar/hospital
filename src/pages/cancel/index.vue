<template>
  <div class="body-contain">
    <vue-element-loading :active="isActive" spinner="bar-fade-scale" color="#FF6700"/>
    <!-- 顶部title盒子 -->
    <div class="top-box">
      <div class="top-title">
        <div class="name-box">{{info.name}}的体检计划</div>
      </div>
      <div class="top-content">{{info.age}}岁 {{info.sex}} {{info.profession === '非职业' ? '非职业病高发工种' : '职业病高发工种'}} {{info.pregnantString === '非备孕' ? '非备孕期/孕期' : '备孕期/孕期'}}</div>
    </div>
    <!-- 主体部分 -->
    <div class="body-box">
      <div class="body-item">
        <div class="item-content">
          <div class="content-title">我要修改</div>
          <div class="content-content">修改当前已选体检计划</div>
        </div>
        <img class="right-arrow" src="../../assets/images/black_arrow.png" />
      </div>
      <div class="body-item" @click="showPop">
        <div class="item-content">
          <div class="content-title">我要取消</div>
          <div class="content-content">取消当前已选体检计划，已交付金额将退回</div>
        </div>
        <img class="right-arrow" src="../../assets/images/black_arrow.png" />
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="pop-contain" v-if="popShow">
      <div class="back-hover" @click="hidePop"></div>
      <div class="pop-body">
        <div>
          <div class="body-title-box">
            <div class="body-title">确认取消已选项目</div>
            <img class="title-close" @click="hidePop" src="../../assets/images/ic-close.png" />
          </div>
          <div class="body-content">取消当前已选体检项目，如果已经支付将在7个工作日内原路退回</div>
        </div>
        <div class="button-box">
          <button class="color-btn" @click="confirmCancel">确认取消已选项目</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UpIdCard } from '@ajax'
import axios from 'axios'
export default {
  name: 'Home',
  data () {
    return {
      idRight: false,
      popShow: false,
      loginPhone: '',
      idNum: '',
      isActive: false,
      docmHeight: 0,
      showBottomIcon: true
    }
  },
  components: {
  },
  created () {
    // if (this.$route.params.reload) {
    //   return false
    // }
    // if (localStorage.getItem('LOGIN_TOKEN') && localStorage.getItem('USER')) {
    //   this.$router.replace({ name: 'login-main' })
    // }
    let info = localStorage.getItem('USER')
    this.info = JSON.parse(info)
  },
  watch: {
  },
  computed: {
    popTitle () {
      return this.idRight ? '是否处于备孕期？' : '抱歉！该体检项目预约方式为卷烟厂员工专属通道'
    }
  },
  mounted () {
    this.docmHeight = document.documentElement.clientHeight
    window.onresize = () => {
      return (() => {
        let showHeight = document.body.clientHeight
        this.showBottomIcon = !(this.docmHeight > showHeight)
      })()
    }
  },
  methods: {
    testId () {
      // let that = this
      this.isActive = true
      // if (this.checkIDCard(this.idNum)) {
      UpIdCard({ id_card: this.idNum }).then(res => {
        this.isActive = false
        console.log(res)
        if (res.data.extend === 400) {
          this.$toast(res.data.msg)
        } else if (res.data.extend === 203) {
          this.showPop()
        } else {
          localStorage.setItem('JWT_TOKEN', res.data.data.token)
          this.$router.push({ name: 'phone', params: { idNum: this.idNum } })
        }
      })
    },
    checkIDCard (idcode) {
      // 加权因子
      var weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验码
      var checkCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

      var code = idcode + ''
      var last = idcode[17]// 最后一位

      var seventeen = code.substring(0, 17)

      // ISO 7064:1983.MOD 11-2
      // 判断最后一位校验码是否正确
      var arr = seventeen.split('')
      var len = arr.length
      var num = 0
      for (var i = 0; i < len; i++) {
        num = num + arr[i] * weightFactor[i]
      }

      // 获取余数
      var resisue = num % 11
      var lastNo = checkCode[resisue]

      var idcardPatter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/

      // 判断格式是否正确
      var format = idcardPatter.test(idcode)

      // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
      return !!(last === lastNo && format)
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
    confirmCancel () {
      // 请求接口，返回项目选择页用replace
      let that = this
      this.isActive = true
      axios({
        method: 'post',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/cancelProject',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {}
      }).then(function (res) {
        that.isActive = false
        if (res.data.status === '200') {
          that.$toast('取消成功，等待退款')
          setTimeout(() => {
            that.$router.replace({ name: 'main', params: { reload: true } })
          }, 1000);
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
.body-contain{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: #F2F2F2;
  .back-image{
    position: absolute;
    top: 20px;
    right: 24px;
    width: 126px;
    height: 131px;
  }
  .top-box{
    padding: 32px 0 32px 24px;
    z-index: 2;
    height: 105px;
    box-sizing: border-box;
    background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
    .top-title{
      display: flex;
      height:33px;
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
    background:rgba(255,255,255,1);
    width: 100%;
    flex-direction: column;
    box-sizing: border-box;
    z-index: 2;
    .body-item{
      display: flex;
      height: 93px;
      justify-content: space-between;
      align-items: center;
      border-top: 8px solid #F2F2F2;
      padding: 22px 29px 22px 16px;
      box-sizing: border-box;

      .item-content{
        display: flex;
        flex-direction: column;
        .content-title{
          height:20px;
          font-size:15px;
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          color:rgba(42,42,42,1);
          line-height:20px;
        }
        .content-content{
          margin-top: 4px;
          height:17px;
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(42,42,42,1);
          line-height:17px;
        }
      }
      .right-arrow{
        width: 15px;
        height: 14px;
      }
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
      height:294px;
      background:rgba(255,255,255,1);
      border-radius:8px 8px 0px 0px;
      position: absolute;
      bottom: 0;
      padding: 0 24px 24px;
      box-sizing: border-box;
      z-index: 11;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .body-title-box{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 54px;
        border-bottom: 1px solid #EEEEEE;
        .body-title{
          height:22px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(42,42,42,1);
          line-height:22px;
        }
        .title-close{
          position: absolute;
          right: 0;
          top: 15px;
          width: 24px;
          height: 24px;
        }
      }
      .body-content{
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(91,91,91,1);
        line-height:20px;
        margin-top: 19px;
        height: 40px;
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
    }
  }
}
</style>
