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
      <div class="id-title">绑定手机号</div>
      <input class="input-box" placeholder="请输入手机号" @input="inputChange" v-model="loginPhone" />
      <div class="border"></div>
      <button class="next-btn" @click="turnToMain">下一步</button>
      <div class="bottom-icon-box" v-if="showBottomIcon">
        <img class="bottom-icon" src="../../assets/images/logo-group.png" />
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
      idRight: true,
      popShow: false,
      loginPhone: '',
      idNum: '',
      idcard: '',
      isActive: false,
      showBottomIcon: true,
      docmHeight: 0
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
    this.docmHeight = document.documentElement.clientHeight
    window.onresize = () => {
      return (() => {
        let showHeight = document.body.clientHeight
        this.showBottomIcon = !(this.docmHeight > showHeight)
      })()
    }
    this.idcard = this.$route.params.idNum
  },
  methods: {
    inputChange (e) {
      this.idNum = e.target.value
    },
    turnToMain () {
      let that = this
      this.isActive = true
      var number = this.idNum.replace(/\s*/g, '')
      if (!(/^1[3456789]\d{9}$/.test(number))) {
        this.isActive = false
        this.$toast('手机号码不正确')
        return false
      } else {
        axios({
          method: 'post',
          baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : 'https://app.sfsdsrmyy.com/app/',
          url: 'examined/sendCode',
          headers: { 'token': localStorage.getItem('JWT_TOKEN') },
          data: {
            card: this.idcard,
            phone: number
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
  overflow-x: hidden;
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
      font-family:PingFangSC-Regular;
      font-weight:700;
      color:rgba(255,255,255,1);
      line-height:33px;
      z-index: 2;
    }
    .top-content{
      margin-top: 2px;
      height:22px;
      font-size:16px;
      font-family:PingFangSC-Regular;
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
      height: 72px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(152,152,152,1);
      line-height:20px;
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
      position: fixed;
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
