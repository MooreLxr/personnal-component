<template>
  <div class="noData">
    <img :src="require(`../assets/images/${icon}`)" alt="" class="icon">
    <span class="text">{{text}}</span>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-11-02 20:01:25
* @description
*/
export default {
  name: 'noData',
  props: {
    icon: {
      type: String,
      default: 'noData.png'
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.noData {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fff;

  img {
    width: 140px;
    margin-bottom: 20px;
  }

  .text {
    font-size: 18px;
    color: #707070;
  }
}
</style>
