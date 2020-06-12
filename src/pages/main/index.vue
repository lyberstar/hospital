<template>
  <div class="body-contain">
    <!-- 顶部背景图 -->
    <img class="back-image" src="../../assets/images/ic-back.png" />
    <!-- 顶部title盒子 -->
    <div class="top-box">
      <div class="top-title">
        <div class="name-box">Hello！{{info.name}}</div>
        <div class="tag-box">{{info.profession === '非职业' ? '非职业病高发工种' : '职业病高发工种'}}</div>
      </div>
      <div class="top-content">{{info.age}}岁 {{info.sex}} {{info.pregnantString === '非备孕' ? '非备孕期/孕期' : '备孕期/孕期'}}</div>
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
      <img class="bottom-icon" src="../../assets/images/logo-group.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      idRight: true,
      popShow: false,
      info: ''
    }
  },
  components: {
  },
  created () {
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
    console.log('status:', this.$route.params.status)
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
      this.$router.push({ name: 'recommend' })
    },
    turnMyself () {
      this.$router.push({ name: 'myself' })
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
    .bottom-icon{
      position: absolute;
      bottom: 33px;
      left: 49px;
      width: 278px;
      height: 23px;
    }
    .green-box{
      background:linear-gradient(270deg,rgba(18,179,112,1) 0%,rgba(48,194,73,1) 100%);
    }
    .blue-box{
      background:linear-gradient(135deg,rgba(66,195,237,1) 0%,rgba(3,122,251,1) 100%);
    }
  }
}
</style>
