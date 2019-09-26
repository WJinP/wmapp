<template>
<div>
        <div class="goods">
        <!-- 左侧menu-wrapper -->
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for='(item, index) in goods' class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)"  :key="index">
                    <span class="text  border-1px">
                        <span v-show='item.type>0' class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <!-- 右侧foods-wrapper -->
        <div class="foods-wrapper" ref="foodWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="food-list food-list-hook" :key="index">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food,$event)" v-for="(food,index) in item.foods" class="food-item border-1px" :key="index">
                            <div class="icon">
                                <img :src="food.icon" width="57" height="57">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span><span v-if="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                                </div>
                                <!-- cartcontrol组件+-小按钮 -->
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food='food' @cartAdd='cartAdd'></cartcontrol>
                                </div>
                            </div>
                            
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- 底部购物车 -->
        <shopcart ref="shopcart" :delivery-price='seller.deliveryPrice' :min-price='seller.minPrice' :select-foods='selectFoods'></shopcart>

    </div>
    <food :food='selectdFood' ref='food' @foodAdd='find' ></food>
</div>
</template>
<script>
import BScroll from "better-scroll"
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'

export default {
  props:['seller'],
    components:{
        shopcart,
        cartcontrol,
        food
    },
  created(){
      this.$http.get('/api/goods').then((res)=>{
          this.goods=res.data;
          //console.log(this.goods)
          this.$nextTick(()=>{
            this._initScroll();
            this._calculateHeight();
          })
          
      }).catch((err)=>{
          console.log(err)
      });
      this.classMap=['decrease','discount','special','invoice','guarantee']
  },
  data() {
      return {
          goods:[],//foreach方法只能对数组或者类数组进行遍历，如果不是数组就会报错
          listHeight:[],//每个区间高度
          scrollY:0 , // 滚动处始值
          selectdFood:{}
      }
  }, 
  computed:{
      currentIndex(){ //区块到menu的映射  计算到达哪个区域的区间的时候的对应的索引值
          for(let i=0;i<this.listHeight.length;i++){
              let height1=this.listHeight[i];//当前menu子块的高度
              let height2=this.listHeight[i+1];//下一个menu子块的高度
              //滚动到底部的时候,height2为undefined,需要考虑这种情况
              //需要确定是在两个menu子块的高度区间
              //!height2 表示最后一个height2 || (落在当前区块区间)
              if(!height2 || (this.scrollY>=height1&&this.scrollY<height2)){
                  return i  //返回这个menu子块的索引
              }
          }
          return 0
      },
      selectFoods(){// 获取被选择的foots
          let foods=[];
          this.goods.forEach((good)=>{
              good.foods.forEach((food)=>{
                  if(food.count){//food.count为真时，说明被选择了
                      foods.push(food);
                  }
              });              
          });
          return foods;
      }
  },
  methods: {
      _initScroll(){//初始化滚动条
          this.menuScroll=new BScroll(this.$refs.menuWrapper,{
           //better-scroll会将点击事件去掉，如果滚动部分需要有点击事件，需要在参数里加上click：true
              click:true
          });
          this.foodScroll=new BScroll(this.$refs.foodWrapper,{
              click:true,
              probeType:3 //结合BScroll的接口使用,3实时派发scroll事件，探针的作用
          });
          this.foodScroll.on('scroll',(pos)=>{
              this.scrollY=Math.abs(Math.round(pos.y));//滚动坐标会出现负的,并且是小数,所以需要处理一下，实时取得scrollY Math.abs返回绝对值
          })
      },
      
      _calculateHeight(){// 获取右侧类别高度
        let foodList=this.$refs.foodWrapper.getElementsByClassName('food-list-hook');//获取每一个food的dom对象
        let height=0;
        this.listHeight.push(height);//初始化第一个高度为0
        for(let i=0;i<foodList.length;i++){
            let item=foodList[i];//每一个item都是刚才获取的food的每一个dom
            height+=item.clientHeight;//主要是为了获取每一个foods内部块的高度
            this.listHeight.push(height);
        }
      },
      selectMenu(index,event){
          if (!event._constructed) { //如果不存在这个属性,则为原生点击事件，不执行下面的函数
              //去掉自带的click事件点击，即pc端直接返回
          return;
        }
        let foodList=this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let el=foodList[index];
        this.foodScroll.scrollToElement(el,300)//类似jump to的功能,通过这个方法,跳转到指定的dom
      },

      cartAdd(el) {
    //体验优化，异步执行下落动画，画面不容易卡顿。
        //拿到traget(DOM对象)之后，将其传入shopcart组件中drop(target){}方法，
     //此处用this.$refs调用子组件,访问DOM时用的是ref="shopcart"
        this.$nextTick(() => {
            this.$refs.shopcart.drop(el);
        });
        },
        selectFood(food,event){
          if (!event._constructed) { 
          return;
        }  
            this.selectdFood=food//更新data中的selectedFood
            this.$refs.food.show()
        },
        find(target){
            //console.log(this.target)
            this.$nextTick(() => {
            this.$refs.shopcart.drop(target);
            }); 
        }





  }, 
}
</script>
<style lang="stylus">
@import "../../common/stylus/mixin.styl"
.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      padding 0 12px
      line-height 14px
      &.current
          background #fff
          position relative
          z-index 10
          margin-top -1px
          font-weight 700
          .text
              border-none()
      .text
        font-size 12px
        display table-cell
        width 56px
        vertical-align middle
        border-1px(rgba(7,17,27,0.2))
      .icon
        display inline-block
        vertical-align top
        width 12px
        height 12px
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat
        &.decrease
           bg-image('decrease_3')
        &.discount
           bg-image('discount_3')
        &.guarantee
           bg-image('guarantee_3')
        &.invoice
           bg-image('invoice_3')
        &.special
           bg-image('special_3')


  .foods-wrapper
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147,153,159)
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,0.2))
      &:last-child
       border-none()
       margin-bottom 0
      .icon
          flex 0 0 57px
          margin-right 10px
      .content
          flex 1
          .name
              font-size 14px
              margin 2px 0 8px 0
              height 14px
              line-height 14px
              color rgb(7,17,27)
          .desc,.extra
              font-size 10px
              line-height 10px
              color rgb(147,153,159)
          .desc  
              margin-bottom 8px 
              line-height 12px 
          .extra  
            .count
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
               right 0
               bottom 12px


          
      



</style>