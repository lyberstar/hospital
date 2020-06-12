<template>
  <div class="body-contain">
    <!-- 顶部背景图 -->
    <img class="back-image" src="../../assets/images/ic-back.png" />
    <!-- 顶部title盒子 -->
    <div class="top-box">
      <div class="top-title">
        <div class="name-box">选择成功</div>
      </div>
      <!-- <div class="top-content" v-if="price > 0">¥ {{price}} 请到医自费</div> -->
      <div class="top-content">等待审核中…</div>
      <!-- <div class="top-content">体检时间请根据贵公司要求分批前来</div> -->
    </div>
    <!-- 主体部分 -->
    <div class="body-box">
      <div class="content-box big-border">
        <div class="need-confirm-box" v-if="prompt && prompt.intro">
          <div class="need-text">{{prompt.intro}}</div>
          <div class="need-bottom">
            <img class="org-icon" src="../../assets/images/ic-org-location.png" />
            <div class="bottom-text">{{prompt.address}}</div>
          </div>
        </div>
        <div class="title-box">
          <img class="title-icon" src="../../assets/images/ic-title.png" />
          <div class="title">体检前要做哪些准备？</div>
          <img class="title-icon" src="../../assets/images/ic-title.png" />
        </div>
        <div class="content">
          <div class="item">体检前，不要采取与平时差异很大的运动或饮食方案。因为体检是为了对自身健康情况做出准确评估。根据检测数据、遗传因素、生活习惯等，判断现状，预防可能出现的疾病。</div>
          <div class="item">
            <p class="nomal">根据国家卫健委相关文件（国卫办医函 [2017] 139号），为响应国家医疗服务实名制相关政策，请在</p>
            <p class="green">体检当天携带体检人本人身份证</p>
            <p>，到体检登记处登记。</p>
          </div>
          <div class="item">体检前24小时避免油腻食品、饮酒及过度劳累 (包括剧烈运动）。</div>
          <div class="item">本次体检请您前一日晚8点后尽量不要进食，体检当天早晨请勿进食，忌太晚抽血（最迟不宜超过上午10:00）。</div>
          <div class="item">体检当日晨应禁食、水；有高血压、心脏病、糖尿病等慢性病患者，允许喝一口白水吃药（但要向医。生讲明）。</div>
          <div class="item">体检当日穿宽松衣服，便于查体；如放射检查，请勿佩戴首饰，不宜穿戴有金属配饰的衣服，女性尽量避开月经期。</div>
          <div class="item">对自己即将进行的体检项目有清晰的了解，提前准备，便于在项目进行中向医生提供更多的信息。</div>
          <div class="item">提前了解医院地理位置和交通情况，避免当日在空腹的情况下费力费神，引起身体不适。</div>
        </div>
      </div>
      <div class="content-box">
        <div class="title-box">
          <img class="title-icon" src="../../assets/images/ic-title.png" />
          <div class="title">体检前常见问题</div>
          <img class="title-icon" src="../../assets/images/ic-title.png" />
        </div>
        <div class="content">
          <div class="qabox">
            <div class="question">前一天晚上喝酒了，第二天还可以体检吗?</div>
            <div class="answer">建议您更换其他体检时间，前一天晚上喝酒、熬夜、吃的过于油腻，可能会影响次日抽血、肝功和尿检的检测结果，体检前三天，请您清淡饮食。</div>
          </div>
          <div class="qabox">
            <div class="question">女性姨妈期可以体检吗?</div>
            <div class="answer">请您尽量避免姨妈期进行体检，如无法避免，当天不可检测妇科项目，您可在医院现场请医护人员安排改期再检查妇科项目。</div>
          </div>
          <div class="qabox">
            <div class="question">特殊病史者，体检当天须停药吗?</div>
            <div class="answer">有高血压、糖尿病等特殊病史者，允许喝一口白水吃药。</div>
          </div>
          <div class="qabox">
            <div class="question">我还关注其他部位，如何增加或调整我的体检套餐内容?</div>
            <div class="answer">您在医院现场，可至体检登记处进行体检加项或调整项目。</div>
          </div>
        </div>
      </div>
      <img class="bottom-icon" src="../../assets/images/logo-group.png" />
    </div>
  </div>
</template>

<script>
import { GetNewsList } from '@ajax'
export default {
  name: 'Home',
  data () {
    return {
      idRight: true,
      popShow: false,
      hasPrice: true,
      price: 0,
      prompt: ''
    }
  },
  components: {
  },
  created () {
    GetNewsList().then(res => {
      console.log(res)
    })
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
    this.prompt = this.$route.params.prompt
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
    width: 113px;
    height: 118px;
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
    box-sizing: border-box;
    z-index: 2;
    position: relative;
    .content-box{
      padding: 24px 24px 16px;
      .need-confirm-box{
        padding: 15px 16px;
        box-sizing: border-box;
        background:rgba(255,249,242,0.5);
        border-radius:8px;
        border:1px solid rgba(255,170,60,1);
        margin-bottom: 24px;
        .need-text{
          font-size:14px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(255,170,60,1);
          line-height:20px;
        }
        .need-bottom{
          margin-top: 7px;
          display: flex;
          align-items: center;
          .org-icon{
            width: 12px;
            height: 12px;
          }
          .bottom-text{
            margin-left: 2px;
            height:15px;
            font-size:11px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(255,170,60,1);
            line-height:16px;
          }
        }
      }
      .title-box{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 16px;
        border-bottom: 1px solid #eeeeee;
        .title-icon{
          width: 18px;
          height: 9px;
        }
        .title{
          height:25px;
          font-size:18px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(42,42,42,1);
          line-height:25px;
          margin: 0 8px;
        }
      }
      .content{
        display: flex;
        flex-direction: column;
        .item{
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(42,42,42,1);
          line-height:20px;
          margin-bottom: 8px;
          &:first-child{
            margin-top: 16px;
          }
          .nomal{
            float: left;
          }
          .green{
            color: #12B26F;
            float: left;
          }
        }
        .qabox{
          display: flex;
          flex-direction: column;
          padding-top: 16px;
          &:last-child{
            margin-bottom: 95px;
          }
          .question{
            font-size:14px;
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(42,42,42,1);
            line-height:20px;
          }
          .answer{
            margin-top: 8px;
            font-size:14px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(42,42,42,1);
            line-height:20px;
          }
        }
      }
    }
    .big-border{
      border-bottom: 8px solid #F2F2F2;
    }
    .bottom-icon{
      position: absolute;
      bottom: 48px;
      left: 49px;
      width: 278px;
      height: 23px;
    }
  }
}
</style>
