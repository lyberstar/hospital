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
      <div class="id-title">
        <div class="code-title">请输入验证码</div>
        <div @click="getMobileCode" :class="wait_timer > 0 ? 'getcode-small' : 'getcode-big'">{{ getMobileCodeText() }}</div>
      </div>
      <div class="digit-wrapper">
        <input v-for="(item,index) in digits"
          :key="index"
          :ref="`ref${index}`"
          class="input"
          v-model="item.value"
          type="text"
          oninput="value=value.replace(/[^\d]/g,'')"
          @input="onInput(index)"
          @keyup.delete="onDelete(index)"
          maxlength="1" />
      </div>
      <button class="next-btn" @click="showPop">下一步</button>
      <img class="bottom-icon" src="../../assets/images/logo-group.png" />
    </div>
    <!-- 弹窗 -->
    <div class="pop-contain" v-if="popShow">
      <div class="back-hover" @click="hidePop"></div>
      <div class="pop-body">
        <div class="pop-title-box">
          <div class="pop-title">{{popTitle}}</div>
          <div class="pop-content" v-if="!fistSelectDone">无论男女，如果您未来3个月有怀孕的打算，或正在孕期我们将为您去掉带有强辐射性等可能会影响胎儿的项目。</div>
          <div class="pop-content" v-if="fistSelectDone">是否是职业病工种将影响您的检查项目种类。</div>
        </div>
        <div class="button-box" v-if="!fistSelectDone">
          <button class="color-btn" @click="turnToNext(1)">最近三个月有怀孕打算或正在孕期</button>
          <div class="no-color" @click="turnToNext(0)">不处于孕期，且最近三个月没有怀孕打算</div>
        </div>
        <div class="button-box-next" v-if="fistSelectDone">
          <button class="color-btn-next" @click="turnToMain(1)">是职业病工种</button>
          <button class="no-color-next" @click="turnToMain(0)">不是职业病工种</button>
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
      fistSelectDone: false,
      popShow: false,
      digits: [
        {
          value: ''
        },
        {
          value: ''
        },
        {
          value: ''
        },
        {
          value: ''
        }
      ],
      wait_timer: false,
      idCard: '',
      disabled: true,
      pregnant: '',
      profession: '',
      isActive: false
    }
  },
  components: {
  },
  created () {
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
      return !this.fistSelectDone ? '您是否处于备孕期，或正在孕期？' : '您是否是职业病工种？'
    }
  },
  mounted () {
    this.idCard = this.$route.params.idCard
    this.phone = this.$route.params.phone
    console.log('this.idCard:', this.$route.params.idCard)
    this.getMobileCode()
  },
  methods: {
    showPop () {
      this.isActive = true
      let codeTemp = ''
      let that = this
      for (let i = 0; i < this.digits.length; i++) {
        codeTemp += this.digits[i].value
      }
      axios({
        method: 'post',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/getUserByPhone',
        headers: { 'token': localStorage.getItem('JWT_TOKEN') },
        data: {
          card: this.idCard,
          code: codeTemp,
          phone: this.phone
        }
      }).then(function (res) {
        that.isActive = false
        if (res.data.data.ptoken) {
          localStorage.setItem('LOGIN_TOKEN', res.data.data.ptoken)
          that.popShow = true
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
    },
    hidePop () {
      this.popShow = false
    },
    turnToNext (idx) {
      this.pregnant = idx
      this.fistSelectDone = true
    },
    turnToMain (idx) {
      this.isActive = true
      let that = this
      this.profession = idx
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
        if (res.data.status === '200') {
          // 成功了
          localStorage.setItem('USER', JSON.stringify(res.data.data.user))
          that.$router.push({ name: 'main' })
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
      // this.$router.push({ name: 'main', params: { status } })
    },
    onInput (index) {
      // index < 5 ，如果是第6格，不触发光标移动至下一个输入框。
      if (this.digits[index].value && index < 3) {
        this.$refs['ref' + (index + 1)][0].focus()
      }
    },
    onDelete (index) {
      // 如果是第1格，不触发光标移动至上一个输入框
      if (index > 0) {
        this.$refs['ref' + (index - 1)][0].focus()
      }
    },
    sendCode () {
      this.isActive = true
      let that = this
      axios({
        method: 'post',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
        url: 'examined/sendCode',
        headers: { 'token': localStorage.getItem('JWT_TOKEN') },
        data: {
          card: that.idcard,
          phone: that.phone
        }
      }).then(function (res) {
        that.isActive = false
        if (res.data.data) {
          that.$router.push({ name: 'code', params: { idCard: that.idcard, phone: number } })
        } else {
          that.$toast(res.data.msg)
        }
      }).catch(function (err) {
        that.isActive = false
        console.log('请求失败', err)
      })
    },
    getMobileCode () {
      if (this.getMobileCodeText() === '重新发送验证码') {
        this.sendCode()
      }
      if (this.wait_timer > 0) {
        return false
      }
      this.wait_timer = 59
      var that = this
      var timerinterval = setInterval(function () {
        if (that.wait_timer > 0) {
          that.wait_timer--
        } else {
          clearInterval(timerinterval)
        }
      }, 1000)
      // 在这里调取你获取验证码的ajax
    },
    getMobileCodeText: function () {
      if (this.wait_timer > 0) {
        return this.wait_timer + 's'
      }

      if (this.wait_timer === 0) {
        return '重新发送验证码'
      }

      if (this.wait_timer === false) {
        return '获取验证码'
      }
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
      font-weight:normal;
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
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .code-title{
        height:20px;
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(42,42,42,1);
        line-height:20px;
      }
      .getcode-small{
        height:16px;
        font-size:11px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(152,152,152,1);
        line-height:16px;
      }
      .getcode-big{
        height:16px;
        font-size:11px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(27,183,99,1);
        line-height:16px;
      }
    }
    .digit-wrapper{
      display: flex;
      flex-direction: row;
      margin-top: 44px;
      padding: 0 40px;
      justify-content: space-between;
      .input {
        display: flex;
        width: 39px;
        height: 40px;
        font-size:28px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(18,178,111,1);
        line-height:40px;
        text-align: center;
        outline: none; // 去除选中状态边框
        border-radius:4px;
        border:1px solid rgba(238,238,238,1);
      }
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
    .bottom-icon{
      position: absolute;
      bottom: 33px;
      left: 49px;
      width: 278px;
      height: 23px;
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
      padding: 32px 24px 23px;
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
