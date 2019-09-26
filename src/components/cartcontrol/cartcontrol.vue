<template>
    <div class="cartcontrol">
        <transition name='move'><!-- 外层渐变,减号图标-->
        <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
       <span class="inner icon-remove_circle_outline"></span>
        </div>         
        </transition>       
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>  
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>  
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    props:{
        food:{
            type:Object
        }
    },
    created(){
        //console.log(this.food)
    },
    methods: {
        addCart(event){
            if(!event._constructed){//非自定义点击事件的情况下return掉，这样pc端就不会检测到两次点击事件。
                return
            }
           // console.log(1)
            if(!this.food.count){
                Vue.set(this.food,'count',1)
                //给food添加新属性count
                //给对象添加他不存在的属性时，这样的方式是不行的。需要用Vue的Vue.set()
            }else{
                this.food.count++
            }
//设置滚动对象时，点击加号，设置一个派发事件，将DOM对象传出去,将target（DOM）作为cart.add事件的对象传入
//$emit, $on, $off 分别来分发、监听、取消监听事件：
            this.$emit('cartAdd',event.target);//添加商品时，派发一个事件，将当前DOM传递给goods.vue
        },
        decreaseCart(event){
            if(!event._constructed){
                return
            }
            if(this.food.count){
                this.food.count--
            }
        }
    },
    
}
</script>
<style lang="stylus">
.cartcontrol
    font-size 0

    .cart-decrease
        display inline-block
        padding 6px   
        &.move-enter-active,&.move-leave-active//进入动画的状态/离开动画时生效
            transition: all 0.4s linear
            opacity 1
            transform translate3d(0, 0, 0)
            .inner
                transition: all 0.4s 
                opacity 1
                transform: rotate(0)
                
        &.move-enter,&.move-leave-active//动画的开始状态,动画一开始透明度要设为0/离开动画的结束状态
            opacity 0
            translate3D(24px,0,0)
            .inner
                opacity: 0
                transform  rotate(180deg)
           
        .inner
            display inline-block
            font-size 24px
            line-height 24px
            color rgb(0,160,220)
       
    .cart-count
        display inline-block
        vertical-align top 
        width 12px
        font-size 10px
        padding-top 6px
        line-height 24px
        text-align center
        color rgb(147,153,159)
     .cart-add
        display inline-block
        padding 6px
        font-size 24px
        line-height 24px
        color rgb(0,160,220)  
  
</style>