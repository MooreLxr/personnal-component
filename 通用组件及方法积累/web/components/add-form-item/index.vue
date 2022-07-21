<template>
  <div class="add-form-item">
    <div v-for="(item, i) in dataProvider" :key="i" class="add-form-item-row">
      <el-input v-model="item.value" class="add-form-item-row-content" @blur="changeData"></el-input>
      <el-button
        slot="operate"
        icon="h-icon-delete"
        @click="delSingleInput(i)"
      />
    </div>
    <add-form-button :curNum="source.length" :maxNum="maxNum" @click="addSingleInput"></add-form-button>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-08-06 16:41:15
* @description 逐条增加
* 调用示例
  <add-form-item :source="rowData" :maxNum="3" @change="updateData"></add-form-item>
  rowData:[{value:111}, {value:222}]
*/
import addFormButton from './add-form-button'

export default {
  name: 'add-form-item',
  components: { addFormButton },
  props: {
    source: {
      type: Array,
      default: []
    },
    maxNum: Number
  },
  data () {
    return {
      dataProvider: this.source
    }
  },
  created () {},
  mounted () {},
  methods: {
    addSingleInput () {
      this.dataProvider.push({ value: '' })
    },
    delSingleInput (i) {
      this.dataProvider.splice(i, 1)
      this.changeData()
    },
    changeData () {
      this.$emit('change', this.dataProvider)
    }
  }
}
</script>

<style lang="scss">
.add-form-item{
  width: 100%;
  height: 100%;
  .add-form-item-row{
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
  }
  .add-form-item-row-content{
    flex: 1;
    height: 30px;
  }
  .h-icon-delete {
    color: #4d4d4d;
    font-size: 24px;
    vertical-align: middle;
  }
}
</style>