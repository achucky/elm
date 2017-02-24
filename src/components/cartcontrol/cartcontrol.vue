<template>
<div class="cartcontrol">
    <transition name="fade">
        <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
</div>
</template>

<script type="text/ecmascript-6">
import Vue from "vue"

export default {
    props: {
        food: {
            type: Object
        },
        selectFoods: {
            type: Array
        }
    },
    methods: {
        addCart(event) {
            if(!event._constructed){
                return 
            }
            if(!this.food.count) {
                Vue.set(this.food, "count", 1)
            }else{
                this.food.count ++
            }
            this.$emit('add', event.target);
        },
        decreaseCart(event) {
            if(!event._constructed){
                return 
            }
            if(this.food.count>0) {
                this.food.count --
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
    .fade-enter-active, .fade-leave-active {
        transition: all .4s linear
        transform: translate3D(0,0,0) rotate(0deg)
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
        transform: translate3D(24px,0,0) rotate(180deg)
    }
    .cart-decrease, .cart-add
        display: inline-block
        padding:6px
        line-height:24px
        font-size:24px
        color:rgb(0,160,220)
    .cart-count
        display: inline-block
        width:12px
        vertical-align:top
        padding-top:6px
        line-height:24px
        font-size:10px
        text-align:center
        color:rgb(147,153,159)
    .cart-add
        display: inline-block
</style>
