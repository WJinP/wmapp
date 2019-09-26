<template>
  <div id="app">
      <header-view :seller="seller"></header-view>
      
    <div class="tab border-1px" >
      <div class="tab-item">
        <router-link :to="{path:'/goods'}" active-class="active">商品</router-link>
        </div>
      <div class="tab-item"><router-link :to="{path:'/ratings'}" active-class="active">评论</router-link></div>
      <div class="tab-item"><router-link :to="{path:'/seller'}" active-class="active">商家</router-link></div>
</div>
<keep-alive>
<router-view :seller='seller'></router-view>
</keep-alive>


  </div>
</template>

<script>
import {urlParse} from './common/js/util'
import HeaderView from './components/header/HeaderView'
export default {
  name: 'App',
  components:{
    HeaderView
  },
  data() {
    return {
      seller: {// 收藏，获取地址栏的id 立即执行函数
        id: (() => {
          let queryParam = urlParse();// 后端数据的url地址
          return queryParam.id;
        })()
      }
    }
  },
  created(){
    this.$http.get('/api/seller?id=' + this.seller.id).then((res)=>{
      this.seller= Object.assign({}, this.seller, res.data);
      //console.log(this.seller.id)
    }).catch((err)=>{
      console.log(err)
    })
  }
}
</script>

<style lang="stylus">
@import './common/stylus/mixin';
#app 
 .tab
  display flex
  width 100%
  height 40px
  line-height 40px
  border-1px(rgba(7,17,27,0.1)) 
  .tab-item
    flex 1
    text-align center
    & > a
     display block
     font-size 14px
     color rgb(77,85,93)
     &.active 
      color rgb(240,20,20)
    
</style>

   

