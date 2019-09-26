<template>
    <div class="ratingselect"> 
        <div class="rating-type border-1px">
            <span @click="select(2,$event)" class="block positive" :class="{'active':ratingType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':ratingType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':ratingType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div class="switch" :class="{'on':only}" @click="toggle">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
        
    </div>
</template>
<script>
const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;
export default {
    props:{
        ratings:{
            type:Array,
            default(){
                return [];
            }
        },
        selectType:{//全部，满意，不满意
            type:Number,
            default: ALL//默认情况时ALL,值等于2
        },
        onlyContent:{//只看有内容的评价还是所有的评价
            type: Boolean,
            default:false//设置为可以看到所有的评价
        },
        desc:{
            type:Object,
            default(){
                return {//默认desc是这三种，在商品详情页的时候传入推荐或者吐槽
                    all:'全部',
                    positive:'满意',
                    negative:'不满意'
                }
            }
        }
    },
    data() {
        return {
            ratingType: this.selectType,
            only: this.onlyContent
        };
    },    
    methods: {
        select(type,event){
            if(!event._constructed){
                return
            }
            this.ratingType=type;
            this.$emit("selectRating", type);
        },
        toggle(event){
           if(!event._constructed){
                return
            }
            this.only=!this.only
            this.$emit("toggleRating", this.only); 

        }
    },
    computed:{
        positives(){
            return this.ratings.filter((rating)=>{
                return rating.rateType===POSITIVE
            })
        },
        negatives(){
            return this.ratings.filter((rating)=>{
                return rating.rateType===NEGATIVE
            })
        }
    }
    
}
</script>
<style lang="stylus">
@import "../../common/stylus/mixin.styl"
.ratingselect
    .rating-type
        padding 18px 0
        margin 0 18px
        border-1px(rgba(7,17,27,0.1))
        font-size 0
        .block
            display inline-block
            padding 8px 12px
            border-radius 1px
            margin-right 8px
            color rgb(77,85,93)
            font-size 12px
            line-height 16px
            &.active
                color #fff
            &.positive
                background rgba(0,160,220,0.2)
                &.active
                    background rgb(0,160,220)
            &.negative
                background rgba(77,85,93,0.2)
                &.active
                    background rgb(77,85,93)
            .count
                margin-left 2px
                font-size 8px
    .switch
        padding 12px 18px
        line-height 24px
        border-bottom 1px solid rgba(7,17,27,0.1)
        color rgb(147,153,159)
        font-size 0
        &.on
            .icon-check_circle
                color #00c850
        .icon-check_circle
            display inline-block
            vertical-align top 
            font-size 24px
            margin-right 4px
        .text
            font-size 12px
            display inline-block
            vertical-align top 
            
                
                
                


</style>