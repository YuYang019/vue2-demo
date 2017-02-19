<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <ul>
        <li class="tab-item">
          <router-link to="/goods">商品</router-link> 
        </li>
        <li class="tab-item">
          <router-link to="/ratings">评价</router-link> 
        </li>
        <li class="tab-item">
          <router-link to="/seller">商家</router-link> 
        </li>
      </ul>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import header from './components/header/header'
import axios from 'axios'

const ERR_OK = 0

export default {
  name: 'app',
  data() {
    return {
      seller: {}
    }
  },
  created() {
    axios.get('/api/seller')
      .then(response => {
        console.log(response.data)
        if (response.data.errno === ERR_OK) {
          this.seller = response.data.data
        }
      })
  },
  components: {
    'v-header': header,
  }
}
</script>

<style lang="scss">
@import './common/scss/index.scss';

.tab {
  width: 100%;
  @include border-1px(rgba(7, 17, 27, 0.1));
  ul {
    display: flex;
    .tab-item {
      flex: 1;
      height: size(80);
      line-height: size(80);
      text-align: center;
      & > a {
        display: block;
        text-decoration: none;
        @include font-size(14px);
      }
      .router-link-active {
        color: rgb(240, 20, 20)
      }
    }
  }
}
</style>
