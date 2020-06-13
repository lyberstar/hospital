<template>
  <div class="body-contain">
    <!-- 顶部背景图 -->
    <img class="back-image" src="../../assets/images/ic-back.png" />
    <!-- 顶部title盒子 -->
    <div class="top-box">
      <div class="top-title">2020年什邡卷烟厂员工体检</div>
      <div class="top-content">项目选择专属通道</div>
    </div>
    <!-- 主体部分 -->
    <div class="body-box">
      <div class="id-title">绑定手机号</div>
      <input class="input-box" placeholder="请输入手机号" @input="inputChange" v-model="loginPhone" />
      <div class="border"></div>
      <button class="next-btn" @click="turnToMain">下一步</button>
      <img class="bottom-icon" src="../../assets/images/logo-group.png" />
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
      loginPhone: '',
      idNum: '',
      idcard: ''
    }
  },
  components: {
  },
  created () {
  },
  watch: {
    loginPhone (newValue, oldValue) {
      newValue = newValue.replace(/\s+/g, '')
      if (newValue.length > 3 && newValue.length < 8) {
        newValue = newValue.replace(/^(\d{3})/g, '$1 ')
      } else if (newValue.length >= 8 && newValue.length < 12) {
        newValue = newValue.replace(/^(\d{3})(\d{4})/g, '$1 $2 ')
      }
      this.loginPhone = newValue
      return newValue
    }
  },
  computed: {
  },
  mounted () {
    console.log('status:', this.$route.params.idNum)
    this.idcard = this.$route.params.idNum
  },
  methods: {
    inputChange (e) {
      this.idNum = e.target.value
    },
    turnToMain () {
      let that = this
      var number = this.idNum.replace(/\s*/g, '')
      if (!(/^1[3456789]\d{9}$/.test(number))) {
        this.$toast('手机号码不正确')
        return false
      } else {
        axios({
          method: 'post',
          baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'http://139.155.94.28/app/',
          url: 'examined/sendCode',
          headers: { 'token': localStorage.getItem('JWT_TOKEN') },
          data: {
            card: this.idcard,
            phone: number
          }
        }).then(function (res) {
          console.log(res)
          if (res.data.data) {
            that.$router.push({ name: 'code', params: { idCard: that.idcard, phone: number } })
          }
        }).catch(function (err) {
          console.log('请求失败', err)
        })
        // UpPhone({ id_card: this.idcard }).then(res => {
        //   console.log(res)
        // })
        // this.$router.push({ name: 'code' })
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
      line-height:40px;
      letter-spacing:1px;
      height: 72px;
    }
    .input-box::-webkit-input-placeholder {
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(152,152,152,1);
      line-height:20px;
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
