<template>
<transition name="foodDetMove">
        <div class="food" v-show="showFlag" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back" @click="showFlag=false">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h2 class="title">{{food.name}}</h2>
                    <div class="detail">
                        <span class="sell-count">月销{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span><span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food="food" @add="add"></cartcontrol>
                    </div>
                    <transition name="buyfade">
                        <div class="buy" v-show="!food.count || food.cound===0" @click.stop.prevent="addFirst">加入购物车</div>
                    </transition>
                </div>
                <split v-if="food.info"></split>
                <div class="info" v-if="food.info">
                    <h2 class="title">商品信息</h2>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h2 class="title">商品评价</h2>
                    <ratingselect v-on:select="select" v-on:toggle="toggle" :select-type="selectType" :only-content="onlyContent" :ratings="food.ratings" :desc="desc"></ratingselect>
                    <div class="rating-wrapper">
                        <ul v-if="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-if="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
</transition>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import Vue from "vue";
import {formatDate} from "common/js/date.js"
import cartcontrol from 'components/cartcontrol/cartcontrol'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'

const POSOTIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
    props: {
        food: {
            type: Object
        }
    },
    data (){
        return {
            showFlag:false,
            selectType: ALL,
            onlyContent: true,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    components: {
        cartcontrol, split, ratingselect
    },
    filters: {
        formatDate(time){
            let date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
    },
    methods: {
        select(type) {
            this.selectType = type
            this.$nextTick(() => {
                this.scroll.refresh()
            })
        },
        toggle() {
            this.onlyContent = !this.onlyContent
            this.$nextTick(() => {
                this.scroll.refresh()
            })
        },
        show() {
            this.showFlag = true;
            this.selectType = ALL;
            this.onlyContent = true;
            this.$nextTick(() => {
                if(!this.scroll){
                    this.scroll = new BScroll(this.$refs.food, {
                        click: true
                    })
                }else{
                    this.scroll.refresh();
                }
            })
        },
        addFirst(event) {
            if(!event._constructed) {
                return;
            }
            this.$emit('add', event.target)
            Vue.set(this.food, 'count', 1)
        },
        add(target){
            this.$emit('add', target)
        },
        needShow(type, text) {
            if(this.onlyContent && !text) {
                return false
            }
            if(this.selectType === ALL){
                return true
            }else{
                return type === this.selectType
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

.foodDetMove-enter-active, .foodDetMove-leave-active
    transition: all .2s linear
    transform: translate3d(0,0,0)
.foodDetMove-enter, .foodDetMove-leave-active
    transform: translate3d(100%,0,0)
.food
    position:fixed
    top:0
    left:0
    bottom:48px
    z-index:30
    width:100%
    background:#fff
    .image-header
        position:relative
        width:100%
        height:0
        padding-top: 100%
        img
            position:absolute
            top:0
            left:0
            width:100%
            height:100%
        .back
            position:absolute
            top:10px
            left:10px
            border-radius:50%
            background:rgba(7,17,27,0.2)
            .icon-arrow_lift
                display:block
                padding:10px
                font-size:20px
                color:#fff
    .content
        padding:18px
        position:relative
        .title
            font-size:14px
            line-height:14px
            margin-bottom:8px
            font-weight:700
            color:rgb(7,17,27)
        .detail
            margin-bottom:18px
            line-height:10px
            font-size:0
            height:10px
            .sell-count, .rating
                font-size:10px
                color:rgb(147,153,159)
            .sell-count
                margin-right:12px
        .price
            font-weight:700
            line-height:24px
            .now
                margin-right:8px
                font-size:14px
                color:rgb(240,20,20)
            .old
                color:rgb(147,153,159)
                text-decoration:line-throungh
                font-size:10px
    .cartcontrol-wrapper
        position:absolute
        right:12px
        bottom:12px
    .buy
        position:absolute
        right:18px
        bottom:18px
        z-index:10
        height:24px
        line-height:24px
        padding:0 12px
        box-sizing:border-box
        border-radius:12px
        font-size:10px
        color:#fff
        background:rgb(0,160,220)
    .buyfade-enter-active, .buyfade-leave-active
        transition: all .2s linear
        transform: translate3d(0,0,0)
    .buyfade-enter, .buyfade-leave-active
        transform: translate3d(100%,0,0)
    .info
        padding:18px
        .title
            line-height:14px
            margin-bottom:6px
            font-size:14px
            color:rgb(7,17,27)
        .text
            line-height:24px
            padding:0 8px
            font-size:12px
            color:rgb(77,85,93)
    .rating
        padding-top:18px
        .title
            line-height:14px
            margin-left:18px
            font-size:14px
            color:rgb(7,17,27)
        .rating-wrapper
            padding:0 18px
            .rating-item
                position:relative
                padding:16px 0
                border-1px(rgba(7,17,27,0.1))
                .user
                    position:absolute
                    right:0
                    top:16px
                    line-height:12px
                    font-size:0
                    .name
                        display:inline-block
                        vertical-align:top
                        margin-right:6px
                        font-size:10px
                        color:rgb(147,153,159)
                    .avater
                        border-radius:50%
                .time
                    margin-bottom:6px
                    line-height:12px
                    font-size:10px
                    color:rgb(147,153,159)
                .text
                    line-height:16px
                    font-size:12px
                    color:rgb(7,17,27)
                    .icon-thumb_up, .icon-thumb_down
                        margin-right:4px;
                        line-height:16px
                        font-size:12px
                    .icon-thumb_up
                        color:rgb(0,160,220)
                    .icon-thumb_down
                        color:rgb(147,153,159)
            .no-rating
                padding: 16px 0
                font-size:12px
                color:rgb(147,153,159)
            
</style>