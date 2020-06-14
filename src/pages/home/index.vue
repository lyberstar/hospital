<template>
  <div class="body-contain">
    <vue-element-loading :active="isActive" spinner="bar-fade-scale" color="#FF6700"/>
    <!-- 顶部背景图 -->
    <img class="back-image" src="../../assets/images/ic-back.png" />
    <!-- 顶部title盒子 -->
    <div class="top-box">
      <div class="top-title">2020年什邡卷烟厂员工体检</div>
      <div class="top-content">项目选择专属通道</div>
    </div>
    <!-- 主体部分 -->
    <div class="body-box">
      <div class="id-title">身份证号</div>
      <input class="input-box" placeholder="请输入身份证号" @input="inputChange" v-model="loginPhone" />
      <div class="border"></div>
      <button class="next-btn" @click="testId">下一步</button>
      <div class="bottom-icon-box">
        <img class="bottom-icon" src="../../assets/images/logo-group.png" />
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="pop-contain" v-if="popShow">
      <div class="back-hover" @click="hidePop"></div>
      <div class="pop-body">
        <div class="pop-title-box">
          <div class="pop-title">{{popTitle}}</div>
          <div class="pop-content" v-if="!idRight">
            <p class="nomal">如果您是卷烟厂员工，请确认您输入的</p>
            <p class="green"> 身份证号码 </p>
            <p>是否正确！</p>
          </div>
        </div>
        <div class="button-box">
          <button class="color-btn" v-if="!idRight" @click="hidePop">点此重试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UpIdCard } from '@ajax'
// import axios from 'axios'
export default {
  name: 'Home',
  data () {
    return {
      idRight: false,
      popShow: false,
      loginPhone: '',
      idNum: '',
      isActive: false
    }
  },
  components: {
  },
  created () {
    if (localStorage.getItem('LOGIN_TOKEN') && localStorage.getItem('USER')) {
      this.$router.replace({ name: 'login-main' })
    }
  },
  activated () {
    console.log('this.$route.params.reload:', this.$route.params.reload)
    if (this.$route.params.reload) {
      console.log('history1:', history)
      let len = history.length
      history.go(-(len - 2))
      console.log('history2:', history)
    }
  },
  watch: {
    // loginPhone (newValue, oldValue) {
    //   newValue = newValue.replace(/\s+/g, '')
    //   if (newValue.length > 6 && newValue.length < 13) {
    //     newValue = newValue.replace(/^(\d{6})/g, '$1 ')
    //   } else if (newValue.length >= 13 && newValue.length < 19) {
    //     newValue = newValue.replace(/^(\d{6})(\d{7})/g, '$1 $2 ')
    //   }
    //   this.loginPhone = newValue
    //   return newValue
    // }
  },
  computed: {
    popTitle () {
      return this.idRight ? '是否处于备孕期？' : '抱歉！该体检项目预约方式为卷烟厂员工专属通道'
    }
  },
  mounted () {
  },
  methods: {
    testId () {
      // let that = this
      this.isActive = true
      if (this.checkIDCard(this.idNum)) {
        UpIdCard({ id_card: this.idNum }).then(res => {
          this.isActive = false
          if (res.data.extend === 400) {
            this.showPop()
          } else {
            localStorage.setItem('JWT_TOKEN', res.data.data.token)
            this.$router.push({ name: 'phone', params: { idNum: this.idNum } })
          }
        })
        // axios.get('examined/getUserByCard', {
        //   params: {
        //     id_card: this.idNum
        //   }
        // }).then(function (res) {
        //   console.log('resssssssssssssssssssss:', res)
        //   if (res.data.extend === 400) {
        //     that.showPop()
        //   } else {
        //     localStorage.setItem('JWT_TOKEN', res.data.data.token)
        //     that.$router.push({ name: 'phone', params: { idNum: this.idNum } })
        //   }
        // }).catch(function (err) {
        //   console.log('请求失败', err)
        // })
      } else {
        this.isActive = false
        this.$toast('格式不正确')
      }
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
    width: 126px;
    height: 131px;
  }
  .top-box{
    display: flex;
    flex-direction: column;
    margin: 0 0 32px 24px;
    padding-top: 32px;
    z-index: 2;
    .top-title{
      height:33px;
      font-size:24px;
      font-family:Alibaba-PuHuiTi-H,Alibaba-PuHuiTi;
      font-weight:700;
      color:rgba(255,255,255,1);
      line-height:33px;
      z-index: 2;
    }
    .top-content{
      margin-top: 2px;
      height:22px;
      font-size:16px;
      font-family:Alibaba-PuHuiTi-R,Alibaba-PuHuiTi;
      font-weight:normal;
      color:rgba(255,255,255,1);
      line-height:22px;
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
    padding: 0 24px;
    box-sizing: border-box;
    z-index: 2;
    .id-title{
      height:20px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(42,42,42,1);
      line-height:20px;
      margin-top: 40px;
    }
    .input-box{
      display: flex;
      align-items: center;
      border: 0!important;
      font-size:28px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(18,178,111,1);
      line-height:72px;
      letter-spacing:1px;
      height: 72px;
    }
    .input-box::-webkit-input-placeholder {
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(152,152,152,1);
      line-height:20px;
      height: 72px;
      padding-top: 26px;
    }
    .border{
      height:1px;
      background:rgba(238,238,238,1);
    }
    .next-btn{
      height:40px;
      background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
      border-radius:4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size:16px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:16px;
      border: 0!important;
      margin-top: 64px;
    }
    .bottom-icon-box{
      width: 100%;
      position: absolute;
      bottom: 33px;
      display: flex;
      justify-content: center;
      .bottom-icon{
        width: 278px;
        height: 23px;
        margin-right: 24px;
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
    }
  }
}
</style>
