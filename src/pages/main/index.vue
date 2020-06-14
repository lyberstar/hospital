<template>
  <div class="body-contain">
    <vue-element-loading :active="isActive" spinner="bar-fade-scale" color="#FF6700"/>
    <!-- 顶部背景图 -->
    <img class="back-image" src="../../assets/images/ic-back.png" />
    <!-- 顶部title盒子 -->
    <div class="top-box">
      <div class="top-title">
        <div class="name-box">Hello！{{info.name}}</div>
        <div class="tag-box">{{info.profession === '非职业' ? '非职业病高发工种' : '职业病高发工种'}}</div>
      </div>
      <div class="top-content">
        <div class="top-content-text">{{info.age}}岁 {{info.sex}} {{info.pregnantString === '非备孕' ? '非备孕期/孕期' : '备孕期/孕期'}}</div>
        <img class="change-icon" @click="changeCheck" src="../../assets/images/ic-change.png" />
      </div>
    </div>
    <!-- 主体部分 -->
    <div class="body-box">
      <div class="item-box green-box" @click="turnDefault">
        <div class="content">
          <div class="content-top">使用推荐套餐</div>
          <div class="content-bottom">适用大部分人的推荐套餐</div>
        </div>
        <img class="back-heart" src="../../assets/images/ic-green.png" />
        <img class="right-arrow" src="../../assets/images/right-arrow.png" />
      </div>
      <div class="item-box blue-box" @click="turnMyself">
        <div class="content">
          <div class="content-top">自选检测项目</div>
          <div class="content-bottom">满足个性化的体检需求</div>
        </div>
        <img class="back-heart" src="../../assets/images/ic-blue.png" />
        <img class="right-arrow" src="../../assets/images/right-arrow.png" />
      </div>
      <div class="bottom-icon-box">
        <img class="bottom-icon" src="../../assets/images/logo-group.png" />
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="pop-contain" v-if="showChangeCheck">
      <div class="back-hover" @click="changeCheckHide"></div>
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
      info: '',
      showChangeCheck: false,
      step: 2,
      isActive: false,
      is_adjus: false
    }
  },
  components: {
  },
  created () {
    console.log('is_adjus:', this.$route.params.is_adjus)
    this.is_adjus = this.$route.params.is_adjus || false
    let info = localStorage.getItem('USER')
    this.info = JSON.parse(info)
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
    showPop () {
      this.popShow = true
    },
    hidePop () {
      this.popShow = false
    },
    inputChange (e) {
      this.idNum = e.target.value
    },
    turnDefault () {
      this.$router.push({ name: 'recommend', params: { is_adjus: this.is_adjus } })
    },
    turnMyself () {
      this.$router.push({ name: 'myself', params: { is_adjus: this.is_adjus } })
    },
    changeCheck () {
      this.showChangeCheck = true
    },
    changeCheckHide () {
      this.showChangeCheck = false
      this.step = 2
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
        if (res.data.status === '200') {
          // 成功了
          localStorage.setItem('USER', JSON.stringify(res.data.data.user))
          window.location.reload()
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
  background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  .back-image{
    position: absolute;
    top: 20px;
    right: 24px;
    width: 113px;
    height: 117px;
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
      display: flex;
      align-items: center;
      z-index: 2;
      .top-content-text{
        height:20px;
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:20px;
      }
      .change-icon{
        margin-left: 8px;
        width: 16px;
        height: 16px;
      }
    }
  }
  .body-box{
    display: flex;
    flex: 1;
    background:rgba(255,255,255,1);
    border-radius:8px 8px 0px 0px;
    width: 100%;
    flex-direction: column;
    padding: 16px 16px 0;
    box-sizing: border-box;
    z-index: 2;
    .item-box{
      display: flex;
      width: 100%;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      padding: 16px 12px 20px 16px;
      border-radius:8px;
      position: relative;
      margin-bottom: 16px;
      .content{
        display: flex;
        flex-direction: column;
        .content-top{
          height:28px;
          font-size:20px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:28px;
        }
        .content-bottom{
          height:20px;
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:20px;
          margin-top: 6px;
        }
      }
      .right-arrow{
        width: 14px;
        height: 14px;
      }
      .back-heart{
        width: 74px;
        height: 74px;
        position: absolute;
        top: 16px;
        right: 32px;
      }
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
    .green-box{
      background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
    }
    .blue-box{
      background:linear-gradient(135deg,rgba(66,195,237,1) 0%,rgba(3,122,251,1) 100%);
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
