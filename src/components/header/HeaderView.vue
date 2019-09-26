<template>
  <div id="headerview">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div v-if='seller.supports' class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      <div class="support-count" v-if='seller.supports' @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      </div>
    </div>
    <!-- 公告粥品香... -->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <!-- 滤镜背景 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
   
     <!-- 详情弹层页开始 -->
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper"><star :score='seller.score' :size='48'></star></div>
            <title-line :titleMsg='msg1'></title-line>
            <ul v-if="seller.supports" class="supports">
              <li class="supports-item" v-for="(item,index) in seller.supports" :key="index">
                <span class="icons" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
             <title-line :titleMsg='msg2'></title-line>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>         
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>  
    </transition>
  </div>
</template>

<script>
import star from '../star/star'
import titleLine from '../line'
export default {
  name: 'Headerview',
  components:{
    star,
    titleLine
  },
  props:{
    seller:{
      type:Object
    }
  },
  created(){
    this.classMap=['decrease','discount','special','invoice','guarantee']
  },
  data () {
    return {
      detailShow:false,
      msg1:'优惠信息',
      msg2:'商家公告'
    }
  },
  methods: {
    showDetail(){
      this.detailShow=true
    },
    hideDetail(){
      this.detailShow=false
    }
  }
}
</script>
<style lang="stylus">
@import "../../common/stylus/mixin";
#headerview
  position relative
  overflow hidden
  background rgba(7,17,27,0.5) 
  color #fff
  .content-wrapper
    padding 24px 12px 18px 24px
    position relative
    font-size 0
    .avatar
     display inline-block
     vertical-align top
     img 
      border-radius 2px

    .content
     display inline-block
     margin-left 16px
     .title
      margin 2px 0 8px 0
      .brand
       width 30px
       height 18px
       display inline-block
       bg-image('brand')
       background-size 30px 18px
       background-repeat no-repeat
       vertical-align top 
      .name
       font-size 16px 
       font-weight bold
       line-height 18px
       margin-left 6px
     .description
       margin-bottom 10px
       line-height 12px
       font-size 12px
     .support
       .icon
        display inline-block
        vertical-align top
        width 12px
        height 12px
        margin-right 4px
        background-size 12px 12px
        background-repeat no-repeat
        &.decrease
         bg-image('decrease_1')
        &.discount
         bg-image('discount_1')
        &.guarantee
         bg-image('guarantee_1')
        &.invoice
         bg-image('invoice_1')
        &.special
         bg-image('special_1')
       .text
        line-height 12px
        font-size 10px    
    .support-count
     position absolute
     right 12px
     bottom 14px
     padding 0 8px
     height 24px
     line-height 24px
     border-radius 12px
     background rgba(0,0,0,0.2)
     text-align center
     .count
       font-size 10px
       vertical-align top
     .icon-keyboard_arrow_right 
       font-size 10px
       line-height 24px
       margin-left 2px
  .bulletin-wrapper
   position relative
   font-size 10px
   height 28px
   line-height 28px
   padding 0 22px 0 12px   
   white-space nowrap
   overflow hidden
   text-overflow ellipsis   
   background rgba(7,17,27,0.2)  
   .bulletin-title
    display inline-block
    vertical-align top
    margin-top 8px
    width 22px
    height 12px
    bg-image('bulletin')
    background-size 22px 12px
    background-repeat no-repeat
   .bulletin-text
    font-size 10px
    margin 0 4px
    vertical-align top 
   .icon-keyboard_arrow_right
    position absolute
    font-size 10px
    right 12px
    top 8px
  .background
   position absolute
   top 0
   left 0
   width 100%
   height 100%
   z-index -1
   filter blur(10px)
  .detail
   position fixed
   z-index 100
   top 0
   left 0
   width 100%
   height 100%
   overflow auto
   background rgba(7,17,27,0.8)
   backdrop-filter blur(10px)
   &.fade-enter-active,&.fade-leave-active 
    transition all 0.4s 
    opacity 1
   &.fade-enter,&.fade-leave-active 
    opacity 0  
   .detail-wrapper
    min-height 100%
    width 100%
    .detail-main
     margin-top 64px
     padding-bottom 64px
     .name
       font-size 16px
       font-weight 700
       line-height 16px
       text-align center
     .star-wrapper
      margin-top 18px
      padding 2px 0
      text-align center
     .supports
      width 80%
      margin 0 auto
      .supports-item
       padding 0 12px
       margin-bottom 12px
       font-size 0
       &.last-child        
        margin-bottom 0 
       .icons
        display inline-block
        vertical-align top
        width 16px
        height 16px
        margin-right 6px
        background-size 16px 16px
        background-repeat no-repeat
        &.decrease
         bg-image('decrease_2')
        &.discount
         bg-image('discount_2')
        &.guarantee
         bg-image('guarantee_2')
        &.invoice
         bg-image('invoice_2')
        &.special
         bg-image('special_2')
       .text
        font-size 12px
        line-height 16px
        font-weight 200
    .bulletin
     width 80%
     margin 0 auto
     .content
      padding 0 12px
      line-height 28px
      font-size 12px
      font-weight 200


 
        
  
  
  
  .detail-close
    position relative
    width 32px
    height 32px
    margin -64px auto 0 auto 
    clear both
    font-size 32px
     
     







    
    </style>