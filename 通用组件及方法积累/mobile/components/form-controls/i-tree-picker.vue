<template>
  <div class="i-tree-picker">
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      :required="required"
      :label="label"
      :rules="rules"
      placeholder="请选择"
      :input-align="inputAlign"
      @click="openPicker"
    />
    <van-popup v-model="show" position="left" :style="{ width: '100%', height: '100%', padding: '10px' }">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        class="filter-tree-input"
      ></el-input>
      <div class="tree-wrap">
        <el-tree
          :icon-class="'h-icon-angle_right'"
          :node-key="nodeKey"
          :data="source"
          :props="defaultProps"
          ref="simpleTree"
          :show-checkbox="showCheckbox"
          :filter-node-method="filterNode"
          :default-expand-all="defaultExpandAll"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="expandOnClickNode"
          :check-strictly="checkStrictly"
          :currentNodeKey="currentNodeKey"
          @node-click="handleNodeClick"
          @check="handleNodeCheck"
          v-if="source && source.length"
        >
          <span
            class="custom-tree-node"
            slot-scope="{ data }"
          >
            <img
              :src="require(`../../assets/images/${data.icon}`)"
              alt=""
              class="icon"
              v-if="data.icon"
            >
            <span class="label">{{ data[defaultProps.label] }}</span>
            <i
              class="h-icon-done"
              v-if="!showCheckbox && currentNode && currentNode[nodeKey] === data[nodeKey]"></i>
          </span>
          <span slot="empty" class="el-tree__empty-text">暂无数据</span>
        </el-tree>
      </div>
      <div class="button-wrap">
        <van-button type="default" @click="show = false" native-type="button">取消</van-button>
        <van-button type="info" @click="confirm" native-type="button">保存</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-10-28 10:20:10
* @description
*/
import Vue from 'vue'
import { Input, Tree } from 'hui'
import 'hui/lib/hui.css'
Vue.use(Input)
Vue.use(Tree)

export default {
  name: 'i-tree-picker',
  props: {
    label: {
      type: String,
      required: true
    },
    required: Boolean, // 是否必填
    rules: Array, // 表单校验规则
    disabled: Boolean,
    disabledMessage: String,
    source: { // 树数据源
      type: Array,
      required: true
    },
    nodeKey: { // 树主键
      type: String,
      default: 'id'
    },
    defaultProps: { // 树自定义字段
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
          disabled: 'disabled'
        }
      }
    },
    value: [String, Number, Array],
    // 有复选框时有效： singleSelect单选， multiSelect多选
    mold: {
      type: String,
      default: 'multiSelect'
    },
    currentNodeKey: [String, Number], // 当前选中节点的 key，只写属性
    showCheckbox: Boolean, // 是否显示checkbox
    defaultCheckedKeys: Array, // 默认选中项
    defaultExpandedKeys: Array, // 默认展开的节点的 key 的数组
    defaultExpandAll: Boolean, // 是否默认展开全部
    expandOnClickNode: Boolean, // 是否在点击节点的时候展开或者收缩节点,默认false，只有点箭头图标的时候才会展开或者收缩节点
    checkStrictly: Boolean, // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
    /**
     * 输入框对齐方式，可选值为 center right
    */
    inputAlign: {
      type: String,
      default: 'left'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      show: false,
      fieldValue: '',
      filterText: '',
      currentNode: null
    }
  },
  created () {
    this.setInitValue()
  },
  mounted () {},
  methods: {
    // 初始化fieldValue值
    setInitValue () {
      const { value, source, defaultProps } = this
      if (!value || !source || !source.length) {
        this.fieldValue = ''
        return
      }
      const nodes = []
      const each = (arr) => {
        if (!arr || arr.length === 0) return
        arr.forEach(e => {
          if ((e[this.nodeKey] === value || value.includes(e[this.nodeKey])) && !e.disabled) nodes.push(e)
          if (!this.showCheckbox && e[this.nodeKey] === value) this.currentNode = e
          each(e.children)
        })
      }
      each(source)
      if (nodes.length) {
        this.fieldValue = nodes.length === 1 ? nodes[0][defaultProps.label] : nodes.length
      } else {
        this.fieldValue = ''
      }
    },
    openPicker () {
      if (this.disabled) {
        this.$toast.fail(this.disabledMessage)
        return
      }
      this.show = true
    },
    // 树节点点击
    handleNodeClick (data, node) {
      this.$emit('node-click', data, node)
      this.currentNode = data
    },
    // 树节点checkbox选中
    handleNodeCheck (data, nodes) {
      // 树单选
      if (this.showCheckbox && this.mold === 'singleSelect') {
        this.$refs.simpleTree.setCheckedNodes([])
        this.$refs.simpleTree.setCheckedNodes([data])
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    confirm () {
      // 显示checkbox
      if (this.showCheckbox) {
        const tree = this.$refs.simpleTree
        const checkedKeys = tree.getCheckedKeys(true, true) // 仅返回被勾选的叶子节点的key值
        const checkNodes = tree.getCheckedNodes(true, true) // 仅返回被勾选的叶子节点
        if (!checkedKeys.length) {
          this.$toast.fail('未选中数据！')
          return
        }
        this.fieldValue = this.mold === 'singleSelect' ? checkNodes[0][this.defaultProps.label] : checkNodes.length
        this.$emit('change', checkedKeys, checkNodes)
      } else {
        this.fieldValue = this.currentNode[this.defaultProps.label]
        this.$emit('change', this.currentNode[this.nodeKey], this.currentNode)
      }
      this.show = false
    }
  },
  watch: {
    filterText (val) {
      this.$refs.simpleTree.filter(val, !this.filterText)
    },
    value () {
      this.setInitValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.i-tree-picker {
  position: relative;

  &::after {
    position: absolute;
    box-sizing: border-box;
    content: '';
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .button-wrap {
    display: flex;
    align-items: center;
    justify-content: center;

    .van-button {
      flex: 1;
      margin: 0 10px;
    }
  }

  .noData {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
}

.tree-wrap {
  height: calc(100% - 100px);
  margin: 10px 0;

  ::v-deep .el-scrollbar {
    height: 100%;
  }

  ::v-deep .el-tree-scrollbar__view.el-scrollbar__view {
    height: 100%;
  }

  ::v-deep .el-tree--highlight-current .el-tree-node.is-current:not(.is-drag) > .el-tree-node__content {
    background-color: #fbfbfb;

    & > .el-tree-node__label,
    & > .el-tree-node__expand-icon {
      color: #4d4d4d;
    }

    .el-checkbox .el-checkbox__inner {
      background-color: #fff;
      color: #b3b3b3;
      border-color: #b3b3b3;
    }
  }

  ::v-deep .el-tree {
    .el-tree-node__content {
      position: relative;
      height: 45px;
      line-height: 45px;
      border: none;
      border-bottom: 1px solid #eee;

      .el-checkbox__input {
        width: 30px;
        height: 30px;
      }

      .el-checkbox__input .el-checkbox__inner {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        border: 1px solid #dcdfe6;
      }

      .el-tree-node__icon {
        display: none;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #409eff;

        .h-svg-icon-wrapper .el-checkbox__tick {
          fill: #fff;
        }

        .h-svg-icon-wrapper {
          position: absolute;
          top: 2px;
          left: 2px;
        }
      }

      .el-tree-node__expand-icon {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 24px;
      }

      & > .el-checkbox {
        margin-right: 10px;
        vertical-align: middle;
      }
    }

    .custom-tree-node {
      width: calc(100% - 25px);
      vertical-align: middle;

      .label {
        font-size: 16px;
        vertical-align: middle;
      }

      .arrow-icon {
        float: right;
        margin-top: 3px;
      }

      .icon {
        width: 30px;
        vertical-align: middle;
      }
    }

    .h-icon-done {
      color: green;
      font-size: 30px;
      position: absolute;
      right: 10px;
      top: 5px;
      font-weight: bold;
    }
  }
}
</style>
