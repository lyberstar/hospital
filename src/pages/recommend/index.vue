<template>
  <div class="body-contain">
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
      <div class="body-title">推荐套餐</div>
      <div class="box-contain" v-for="(items, idx) in checkList" :key="idx">
        <div class="box-name">{{items.intro}}</div>
        <div class="box-content">{{items.mean}}</div>
        <img class="corner-tag" src="../../assets/images/ic-must-corner.png" />
      </div>
    </div>
    <!-- 底部固定 -->
    <div class="bottom-box">
      <div class="bottom-left">
        <div class="price-box">
          <div class="rmb">¥</div>
          <div class="price">{{price}}</div>
        </div>
        <div class="price-content">到院自费金额</div>
      </div>
      <button class="confirm-btn" @click="confirm">确认选择</button>
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
      checkList: [
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        },
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        },
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        },
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        },
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        },
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        },
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        },
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        },
        {
          name: '一般检查',
          content: '身高、体重、血压和体重指数',
          checked: true
        }
      ]
    }
  },
  components: {
  },
  created () {
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
    console.log('status:', this.$route.params.status)
  },
  methods: {
    getDataListw () {
      let that = this
      axios({
        method: 'get',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : '',
        url: 'examined/RecommendedPackages',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {}
      }).then(function (res) {
        console.log('啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊22222:', res)
        that.checkList = res.data.data.list
      }).catch(function (err) {
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
      let that = this
      let info = JSON.parse(localStorage.getItem('USER'))
      axios({
        method: 'post',
        baseURL: process.env.NODE_ENV !== 'production' ? '/app/' : '',
        url: 'examined/SubmitRecommendedPackages',
        headers: { 'ptoken': localStorage.getItem('LOGIN_TOKEN') },
        data: {
          pregnant: info.pregnant,
          profession: info.profession === '非职业' ? 0 : 1
        }
      }).then(function (res) {
        console.log('啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊333:', res)
        if (res.data.status === '200') {
          that.$router.push({ name: 'success' })
        }
      }).catch(function (err) {
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
    padding: 24px 16px 0;
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
}
</style>
