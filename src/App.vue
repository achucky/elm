<template>
    <div>
        <v-header :seller='seller'></v-header>
        <div class="tab border-1px">
            <router-link class="tab-item" to="/goods">商品</router-link>
            <router-link class="tab-item" to="/ratings">评论</router-link>
            <router-link class="tab-item" to="/seller">商家</router-link>
        </div>
        
        <transition name="routerTransition">
            <keep-alive>
                    <router-view :seller="seller"></router-view>
            </keep-alive>
        </transition>
        
    </div>
</template>

<script type="text/ecmascript-6">
import {urlParse} from 'common/js/util'
import header from './components/header/header.vue';

    const ERR_OK = 0;

    export default{
        data() {
            return {
                seller: {
                    id:(() => {
                        let queryParam = urlParse()
                        return queryParam.id
                    })()
                }
            }
        },
        created() {
            this.$http.get('/api/seller?id='+this.id).then((response) => {
                 // if (response.data.errno == ERR_OK){
                    this.seller = Object.assign({}, this.seller, response.data.data);
                 // }
            })
        },
        components: {
            'v-header': header
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl'
.tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 21, 0.1))
    .tab-item
        flex: 1
        text-align: center
    .router-link-active
        color: rgb(240, 20, 20)
.routerTransition-enter-active, .routerTransition-leave-active
    transition: all 0.5s
    transform: translate3d(0,0,0)
    opacity: 1
.routerTransition-enter
    transform: translate3d(50%,0,0)
    opacity: 0
.routerTransition-leave-active
    transform: translate3d(-50%,0,0)
    opacity: 0
</style>
