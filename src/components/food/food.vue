<template>
<transition name='move'>
    <div class="food" v-show="showFlag" ref='food'>
        <div class="food-content">
            <div class="img-header">
                <img :src="food.image">
                <div class="back" @click="hide">
                    <i class="icon-arrow_lift "></i>
                </div>
            </div>
            <div class="content">
                <div class="title">{{food.name}}</div>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}份</span>
                    <span class="rating">好评率{{food.rating}}</span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span v-if="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper"><!-- 加减号组件cartcontrol -->
                <cartcontrol @cartAdd="cartAddcontrol" :food='food'></cartcontrol>
                </div>
                <transition name='fade'>
                    <div @click.stop.prevent="addFirst" class="buy" v-show='!food.count||food.count===0'>加入购物车</div>            
                </transition>            
            </div> 
            <split v-show="food.info"></split> 
            <div class="info" v-show="food.info">
                <h1 class="title">商品信息</h1>
                <p class="text">{{food.info}}</p>
            </div> 
            <split></split> 
            <div class="rating">
                <h1 class="title">商品评价</h1>
                <ratingselect  :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @selectRating='selectRating' @toggleRating='toggleRating'></ratingselect>
                <div class="rating-wrapper">
                    <ul v-show="food.ratings&&food.ratings.length">
                      <li v-show="neddShow(rating.rateType,rating.text)" v-for='rating in food.ratings' class="rating-item border-1px" :key="rating.id">
                          <div class="user">
                              <span class="name">{{rating.username}}</span>
                              <img class="avatar" height="12" width="12"  :src="rating.avatar" alt="">
                          </div>
                          <div class="time">{{rating.rateTime | formatDate}}</div>
                          <p class="text">
                              <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}"></span>
                              {{rating.text}}
                          </p>

                      </li>  
                    </ul>
                    <div class="no-rating" v-show="!food.ratings||!food.ratings.length">
                            暂无评价
                    </div>
                </div>
            </div>        
           
        </div>
        
    </div>
</transition>
</template>
<script>
import BScroll from "better-scroll"
import cartcontrol from '../cartcontrol/cartcontrol'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import Vue from 'vue';
import {formatDate} from '../../common/js/date.js';
// const POSITIVE=0;
// const NEGATIVE=1;
const ALL=2;
export default {
     filters: {
      formatDate(time) {
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      }  
    },
    components:{
        cartcontrol,
        split,
        ratingselect
    },
    props:{
        food:{
            type:Object
        }
    },
    data() {
        return {
            showFlag:false,
            selectType:ALL,
            onlyContent:true,//先设置组件一开始显示有内容的评价
            desc:{
                all:'全部',
                positive:'推荐',
                negative:'吐槽'
            }
        }
    },
    methods: {
        show(){//可以被父组件调用到，方法前加下划线一般是私有方法
            this.showFlag=true;
            //初始化部分，ratingselect组件是被被不同的商品使用的，所以我们希望在点开不同的商品时，能有一样的初始化状态
            this.selectType = ALL;
            this.onlyContent = true;
            //展示界面时用到BScroll
            this.$nextTick(()=>{
                if(!this.scroll){
                    this.scroll=new BScroll(this.$refs.food,{
                        click:true // 可以被点击
                    });
                }else{
                    this.scroll.refresh();
                }
            });


        },
        hide(){
            this.showFlag=false
        },
        addFirst(event){ // 默认的参数是event,点击按钮的时候添加的是第一个商品
            if(!event._constructed){//浏览器直接return掉,去掉自带click事件的点击
                return
            };
            //第一次的时候el消失，找不到小球发出的其实位置，所以第一次小球动画消失
            //解决办法就是将购物车的消失做成一个动画，而不是立马display:none
            //添加的时候添加小球动画，派发事件，之后goods.vue就可以监听到cart-add，并传递给shopcart.vue
             this.$emit('foodAdd',event.target);
            Vue.set(this.food,'count',1);
            //console.log(event.target)
        },
        cartAddcontrol(el){
                this.$emit('foodAdd',el);
        },
        selectRating(type) {
            this.selectType = type;
            this.$nextTick(() => {//防止评论变多位置回弹
                this.scroll.refresh();
            });
        },
        toggleRating(only){
            this.onlyContent = only;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        neddShow(type,text){
            if(this.onlyContent&&!text){
                return false;
            }
            if(this.selectType===ALL){
                return true
            }else{
                return type===this.selectType
            }

        }        


    },
    
}
</script>
<style lang="stylus">
@import "../../common/stylus/mixin.styl"
.food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    &.move-enter-active,&.move-leave-active
        transition all 0.2s linear 
        transform translate3d(0,0,0)
    &.move-enter,&.move-leave-active
        opacity 0
        transform translate3d(100%,0,0)
    .food-content
        // position relative
        .img-header
            position relative
            width 100%
            height 0
            padding-top 100% 
            img
                position absolute 
                top 0
                left 0
                width 100%
                height 100%
        .back
            position absolute 
            top 10px
            left 0
            .icon-arrow_lift 
                display block
                padding 10px
                font-size 20px
                color #fff
        .content
            padding 18px
            position relative
            .title
                line-height 14px
                margin-bottom 8px
                font-size 14px
                font-weight 700
                color rgb(7,17,27)
            .detail
                margin-bottom 18px
                line-height 10px
                height 10px
                font-size 0
                .sell-count,.rating
                    font-size 10px
                    color rgb(147,157,159)
                .sell-count
                    margin-right 12px
            .price
                font-weight 700
                line-height 24px
                .now
                    margin-right 8px
                    font-size 14px
                    color rgb(240,20,20)
                .old
                    text-decoration line-through
                    font-size 10px  
            .cartcontrol-wrapper 
                position absolute
                right 12px
                bottom 12px
                
            .buy 
                position absolute
                right 18px
                bottom 18px
                z-index 10
                height 24px
                line-height 24px
                padding 0 12px
                box-sizing border-box
                border-radius 12px
                font-size 10px
                color #fff
                background rgb(0,160,200)
                &.fade-enter-active,&.fade-leave-active
                    transition all 0.2s 
                &.fade-enter,&.fade-leave-active
                    opacity 0
        .info
            padding 18px
            .title
                line-height 14px
                margin-bottom 6px
                font-size 14px
                color rgb(7,17,27)
            .text
                line-height 24px
                font-size 12px
                color rgb(77,80,93)
                padding 0 8px
                font-weight 200
        .rating
            padding-top 18px
            .title
                line-height 14px
                margin-left 18px
                font-size 14px
                color rgb(7,17,27)
            .rating-wrapper
                padding 0 18px
                .rating-item
                    position relative
                    padding 16px 0
                    border-1px(rgba(7,17,27,0.1))
                    .user
                        position absolute
                        right 0
                        top 16px
                        font-size 0
                        line-height 12px
                        .name
                            font-size 10px
                            display inline-block
                            vertical-align top
                            color rgb(147,153,159)
                            margin-right 6px
                        .avatar
                            border-radius 50%
                    .time
                        line-height 12px
                        font-size 10px
                        color  rgb(147, 153, 159)
                        margin-bottom 6px
                    .text
                        line-height 16px
                        font-size 12px
                        color rgb(7,17,27)
                        .icon-thumb_up,.icon-thumb_down
                            line-height 16px
                            margin-right 4px
                            font-size 12px
                        .icon-thumb_up
                            color rgb(0, 160, 220)
                        .icon-thumb_down
                            color rgb(147, 153, 159)
                .no-rating
                    padding 16px
                    font-size 12px
                    color rgb(147, 153, 159)
                            

            



</style>