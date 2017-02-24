<template>
<div>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount}">
                        <i class="icon-shopping_cart" :class="{'highlight':totalCount}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
        </div>
        
        <div class="ball-container">
    { path: '/', component: goods },
            <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                <div class="ball" v-show="ball.show" v-for="ball in balls" :key="ball">
                    <div class="inner inner-hook"></div>
                </div>
            </transition-group>
        </div>

        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header clearfix">
                    <h2 class="title">购物车</h2>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <transition-group name="foodcart">
                            <li class="food" v-for="food in selectFoods" v-show="food" :key="food">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food" @add="add"></cartcontrol>
                                </div>
                            </li>
                        </transition-group>
                    </ul>
                </div>
            </div>
        </transition>

    </div>
    <transition name="maskTarn">
        <div class="list-mask" v-show="listShow" @click="fold=true"></div>
    </transition>

</div>
</template>

<script type="text/ecmascript-6">
import cartcontrol from "../cartcontrol/cartcontrol.vue";
import BScroll from "better-scroll";

export default {
    props: {
        selectFoods: {
            type: Array,
            default() {
                return [
                    {price:1,count:1}
                ]
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            balls:[
                {show:false},
                {show:false},
                {show:false},
                {show:false},
                {show:false},
                {show:false},
                {show:false}
            ],
            dropBall: [],
            fold:true
        }
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach((food) => {
                total += food.price * food.count;
            })
            return total;
        },
        totalCount() {
            let count = 0;
            this.selectFoods.forEach((food) => {
                count += food.count;
            })
            return count;
        },
        payDesc() {
            if(this.totalPrice === 0){
                return `￥${this.minPrice}起送`
            }else if(this.minPrice > this.totalPrice){
                let diff = this.minPrice - this.totalPrice
                return `还差￥${diff}起送`
            }else{
                return '去结算'
            } 
        },
        payClass() {
            if(this.totalPrice===0){
                return
            }
            if(this.minPrice <= this.totalPrice){
                return 'enough'
            }
        },
        listShow() {
            if(!this.totalCount){
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if(show) {
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        })
                    }else{
                        this.scroll.refresh();
                    }
                })
            }
            return show;
        }
    },
    methods: {
        drop(el) {
            for(let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i];
                if(!ball.show) {
                    ball.show = true;
                    ball.el = el;
                    this.dropBall.push(ball)
                    return;
                }
            }
        },
        beforeEnter(el) {
            let count = this.balls.length;
            while (count--) {
                let ball = this.balls[count];
                if(ball.show){
                    let rect = ball.el.getBoundingClientRect();
                    let x = rect.left - 32;
                    let y = -(window.innerHeight - rect.top - 22)
                    el.style.display = '';
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`
                    el.style.transform = `translate3d(0,${y}px,0)`
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                    inner.style.transform = `translate3d(${x}px,0,0)`;
                }
            }
        },
        enter(el) {
            // 添加rf变量让浏览器重绘
            let rf = el.offsetHeight;
            this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0,0,0)'
                el.style.transform = 'translate3d(0,0,0)'
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
            })
        },
        afterEnter(el) {
            let ball = this.dropBall.shift();
            if(ball) {
                ball.show = false;
                el.style.display = 'none'
            }
        },
        toggleList(){
            if(!this.totalCount) {
                return;
            }
            this.fold = !this.fold;
        },
        empty() {
            this.selectFoods.forEach((food) => {
                food.count = 0;
            })
        },
        pay() {
            if(this.totalPrice < this.minPrice) {
                return
            }
            alert(`支付${this.totalPrice+this.deliveryPrice}元`)
        },
        add(el) {
            this.drop(el)
        }
    },
    components: {
        cartcontrol, BScroll
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

.shopcart
    position:fixed
    bottom:0
    left:0
    z-index:50
    width:100%
    height:48px
    .content
        display:flex
        background:#141d27
        font-size:0
        .content-left
            flex:1
            .logo-wrapper
                display:inline-block
                position:relative
                top:-10px
                margin:0 12px
                padding:6px
                width:56px
                height:56px
                box-sizing:border-box  
                vertical-align:top
                border-radius:50%
                background:#141d27
                .logo
                    width:100%
                    height:100%
                    border-radius:50%
                    text-align:center
                    background:rgba(255,255,255,0.2)
                    .icon-shopping_cart
                        font-size:24px
                        line-height:44px
                        color:rgba(255,255,255,0.4)
                        &.highlight
                            color:#fff
                    &.highlight
                        background:rgb(0,160,220)
                .num
                    position:absolute
                    top:0
                    right:0
                    width:24px
                    height:16px
                    line-height:16px
                    text-align:center
                    font-size:9px
                    border-radius:16px
                    background:rgb(240,20,20)
                    color:#fff
                    font-weight:700
                    box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
            .price
                display:inline-block
                vertical-align:top
                font-size:16px
                line-height:24px
                margin-top:12px
                box-sizing:border-box
                padding-right:12px
                border-right:solid 1px rgba(255,255,255,0.1)
                font-weight:700
                color:rgba(255,255,255,0.4)
                &.highlight
                    color:#fff
            .desc
                display:inline-block
                vertical-align:top
                line-height:24px
                margin:12px 0 0 12px
                color:rgba(255,255,255,0.4)
                font-size:10px
        .content-right
            flex:0 0 105px
            width:105px
            .pay
                font-size:12px
                height:48px
                line-height:48px
                text-align:center
                color:rgba(255,255,255,0.4)
                font-weight:700
                background:#2b333b
                &.not-enough
                    background:#2b333b
                &.enough
                    background:#00b43c
                    color:#fff
    .ball-container
        .ball
            position:fixed
            left:32px
            bottom:22px
            z-index:200
            &.drop-enter-active
                transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
                .inner
                    width:16px
                    height:16px
                    border-radius:50%
                    background:rgb(0,160,220)
                    transition:all 0.4s linear
    .shopcart-list
        position:absolute
        left:0;
        top:0
        z-index:-1
        width:100%
        transform: translate3d(0,-100%,0)
        &.fold-enter-active, &.fold-leave-active
            transition: all 0.5s
            transform: translate3d(0,-100%,0)
        &.fold-enter, &.fold-leave-active
            transform: translate3d(0,0,0)
        .list-header
            height:40px
            line-height:40px
            padding:0 18px
            background:#f3f4f7
            border-bottom:solid 1px rgba(7,17,27,0.1)
            .title
                font-size:14px
                float:left
                color:rgb(7,17,27)
            .empty
                float:right
                font-size:12px
                color:rgb(0,160,220)
        .list-content
            padding:0 18px
            max-height:217px
            background:#fff
            overflow:hidden
            .food
                position:relative
                padding:12px 0;
                box-sizing: border-box
                border-1px(rgba(7,17,27,0.1))
                .name
                    line-height:24px
                    font-size:14px
                    color:rgb(7,17,27)
                .price
                    position:absolute
                    right:90px
                    bottom:12px
                    line-height:24px
                    font-size:14px
                    font-weight:700
                    color:rgb(240,20,20)
                .cartcontrol-wrapper
                    position:absolute
                    right:0
                    bottom:6px
.maskTarn-enter-active, .maskTarn-leave-active
    transition: all 0.5s
    opacity: 1
.maskTarn-enter, .maskTarn-leave-active
    opacity: 0
.list-mask
    position:fixed
    background:rgba(7,17,27,0.6)
    top:0
    left:0
    width:100%
    height:100%
    z-index:40
    background-filter:blur(10px)
.foodcart-enter-active, .foodcart-leave-active
    transition: all 0.5s
    opacity: 1
.foodcart-enter, .foodcart-leave-active
    opacity: 0
    
</style>