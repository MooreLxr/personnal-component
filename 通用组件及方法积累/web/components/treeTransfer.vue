<template>
  <div class="treeTransfer">
    <div class="transfer-left">
      <el-tree
        ref="lazyTree"
        :data="treeDataAsync"
        :props="fieldConfig"
        simple-data
        :node-key="fieldConfig['id']"
        :parent-key="fieldConfig['parentKey']"
        :load="loadNode"
        :expand-on-dbclick-node="false"
        show-checkbox
        :default-expanded-keys="['root000000']"
        lazy
        @check-change="handleCheckChange"
      ></el-tree>
    </div>
    <div class="transfer-btn">
      <el-button
        icon="h-icon-angle_right"
        type="default"
        @click="toRight"
        :disabled="checkedNodes.length === 0"
      ></el-button><br/>
      <el-button
        icon="h-icon-angle_left"
        type="default"
        @click="toLeft"
        :disabled="rightData.length === 0"
      ></el-button>
    </div>
    <div class="transfer-right">
      <el-checkbox-group v-model="rightCheckedKeys">
        <el-checkbox v-for="item in rightData" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-07-22 10:20:06
* @description 
* 使用示例 <tree-transfer
            style="height:250px;"
            :value="detail.carryPerson.map(e => e.studentId)"
            :source="detail.carryPerson"
            :fieldConfig="{ label: 'studentName', id: 'studentId',parentKey: 'parentIndexCode',children: 'children' }"
          ></tree-transfer>
*/
import * as api from '@/api/index'

export default {
  name: 'treeTransfer',
  model: {
    prop: 'value',
    event: 'change'
  },
  // value右侧默认展示项的id
  // source右侧默认展示项的完整数据[{label:'',id:''}]
  // fieldConfig: 字段配置 默认{ id: 'indexCode', label: 'name', parentKey: 'parentIndexCode',children: 'children' }
  props: {
    value: Array,
    source: Array,
    fieldConfig: {
      type: Object,
      default: {
        id: 'indexCode',
        label: 'name',
        parentKey: 'parentIndexCode',
        children: 'children'
      }
    }
  },
  data () {
    return {
      treeDataAsync: [],
      checkedNodes: [],
      rightData: [], // 右侧的数据
      rightCheckedKeys: [] // 右侧选中的id
    }
  },
  created () {
    this.getAcsTree('root000000')
  },
  mounted () {},
  methods: {
    getAcsTree(pIndexCode) {
      api.getSyncTreeData({ params: {
        parentRegionIndexCode: pIndexCode
      } }).then(res => {
        let result = res.data
        result.forEach(e => {
          if (e.leaf) e.isLeaf = true
          if (e.type === 'tree') e.disabled = true // 控制只能选择门禁点
        })
        this.treeDataAsync = result
        // 勾选接口返回的数据
        this.rightData = this.source.map(e => {
          return {
            label: e[this.fieldConfig.label], 
            id: e[this.fieldConfig.id],
            checked: false
          }
        })
        this.$refs.lazyTree.setCheckedKeys(this.value)
      })
    },
    loadNode (node, resolve) {
      if (node.data.leaf) {
        resolve([])
        return false
      }
      let sendData = {
        parentRegionIndexCode: node.data[this.fieldConfig.id] // node.data.indexCode
      }
      api.getSyncTreeData({ params: sendData }).then(re => {
        const treeData = re.data
        if (re.code === '0') {
          treeData.forEach(e => {
            if (e.leaf) e.isLeaf = true
            if (e.type === 'tree') e.disabled = true // 控制只能选择门禁点
          })
          resolve(treeData)
        } else {
          resolve([])
          this.$message({
            type: 'error',
            message: '加载数据出错！'
          })
        }
        // 勾选接口返回的数据
        this.$refs.lazyTree.setCheckedKeys(this.value)
      })
    },
    handleCheckChange (data, checked, indeterminate) {
      this.checkedNodes = this.$refs.lazyTree.getCheckedNodes(true, true) // 获取勾选的叶子节点
      // 由于树是异步的，右侧已存在的数据可能在树节点中不存在，此处需合并右侧已有的数据到checkedNodes
      if (this.rightData.length) {
        this.rightData.forEach(e => {
          const temp = this.checkedNodes.filter(node => node[this.fieldConfig.id] === e.id)
          if (!temp.length) this.checkedNodes.push({ [this.fieldConfig.label]: e.label, [this.fieldConfig.id]: e.id })
        })
      }
    },
    toRight () {
      const { fieldConfig } = this
      this.rightData = this.checkedNodes.map(e => {
        return { label: e[fieldConfig.label], id: e[fieldConfig.id], checked: false }
      })
      this.$emit('change',this.rightData)
    },
    toLeft () {
      // 移除右边的数据
      const { fieldConfig } = this
      this.rightData = this.rightData.filter(e => this.rightCheckedKeys.indexOf(e[fieldConfig.id]) < 0)
      // 把左侧树节点选中状态去除
      const treeCheckedKeys = this.$refs.lazyTree.getCheckedKeys(true, true) // 勾选的叶子节点
      const newArr = treeCheckedKeys.filter(e => this.rightCheckedKeys.indexOf(e) < 0)
      this.$refs.lazyTree.setCheckedKeys(newArr)
      this.$emit('change', this.rightData)
    }
  }
}
</script>

<style lang="scss">
.treeTransfer{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .transfer-left, .transfer-right{
    width: calc(50% - 25px);
    height: 100%;
    border: 1px solid #ebebeb;
  }
  .transfer-right {
    padding: 10px;
    overflow: auto;
    .el-checkbox{
      display: block;
      margin-bottom: 8px;
    }
    .el-checkbox+.el-checkbox{
      margin-left: 0;
    }
  }
  .transfer-btn{
    width: 50px;
    text-align: center;
    .el-button{
      margin-bottom: 10px;
    }
    .el-button--default {
      border: 1px solid #ccc;
      background-color: white;
      color: #4d4d4d;
    }
    .el-button.is-disabled.el-button--default {
      border: 1px solid #ebebeb;
      background-color: whitesmoke;
      color: #ccc;
      opacity: 1;
    }
  }
}
</style>
