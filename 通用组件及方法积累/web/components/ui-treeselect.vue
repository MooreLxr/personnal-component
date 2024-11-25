<template>
  <el-select
    v-model="selectKeys"
    style="width: 100%"
    :popper-class="_popperClass"
    :clearable="clearable"
    ref="elSelect"
    :filterable="filterable"
    v-bind="$attrs"
    :multiple="multiple"
    :placeholder="_placeholder"
    :filter-method="inputFilter"
    :collapse-tags="collapseTags"
    @change="onChange"
    @clear="selectClear"
    @remove-tag="removeTag"
    @visible-change="onVisibleChange"
  >
    <!-- todo: 插槽无法从外部传入，此处暂时写这里 -->
    <svg-icon
      icon-class="icon-org"
      slot="prefix"
      class="el-input__icon"
      v-if="$attrs.showPrefix"
    />
    <el-option value="1" disabled>
        <el-tree v-loading="isLoading"
            :props="defaultProps"
            :data="treeData"
            :default-expanded-keys="defaultShowNodes"
            :check-strictly="checkStrict"
            :node-key="valueProperty"
            :lazy="lazy"
            :load="loadNode"
            ref="tree"
            :show-checkbox="checkbox"
            :check-on-click-node="_checkOnClickNode"
            :highlight-current="highlight"
            :expand-on-click-node="expandOnClickNode"
            :filter-node-method="filterMethod"
            @check="setSelectValue"
        >
            <template slot-scope="{ node, data}">
                <slot :node="node" :data="data">
                    <span class="el-tree-node__label" :title="node.label">{{ node.label }}</span>
                </slot>
            </template>
        </el-tree>
    </el-option>
    <el-option v-for="option in selectOptions" :key="option.value" :value="option.value" :label="option.label" style="display: none;" /> 
  </el-select>
</template>

<script>
import { pinyin } from 'pinyin-pro'
const noop = () => { }

export default {
  name: "UiTreeselect",
  props: {
    data: Array,
    // rules: Array,
    ntype: [String, Number],
    stype: [String, Number],
    value: [Array, String, Number],
    initValue: [Array, String, Number],
    multiple: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    labelProperty: { type: String, default: "label" },
    valueProperty: { type: String, default: "value" },
    props: { type: Object, default() { return {} } },
    lazy: { type: Boolean, default: false },
    checkStrictly: { type: Boolean, default: false },
    load: { type: Function, default: noop },
    filterable: { type: Boolean, default: false },
    lazySearch: { type: Function, default: null },
    loadOnCheckboxClick: { type: Function, default: null },
    placeholder: { type: String },
    popperClass: { type: String, default: '' },
    maxTagCount: { type: Number },
    checkOnClickNode: { type: Boolean, default: false }
  },
  data() {
    const originData = this.data || []
    return {
      defaultShowNodes: [],
      selectValue: [],
      selectNode: [],
      selectKeys: [],
      originData,
      searchData: [],
      filterKey: '',
      isLoading: false,
      searchValue: '',
      selectOptions: []
    };
  },
  computed: {
    treeData() {
      let currentData
      if (this.lazy && (this.searchData.length > 0 || this.searchValue)) {
        currentData = this.searchData
      } else {
        currentData = this.originData || []
      }
      if (!this.stype) return currentData;
      return this.handleData(currentData)
      // const newArray = [];
      // const loop = temp => {
      //     temp.disabled = temp.ntype === this.ntype ? false : true;
      //     if (temp.children && temp.children.length > 0) {
      //         temp.children.forEach(item => loop(item));
      //     }
      //     return temp;
      // };
      // currentData.forEach((value, index) => {
      //     const cache = JSON.parse(JSON.stringify(value));
      //     newArray[index] = loop(cache);
      // });
      // return newArray;
    },
    defaultProps() {
      let defaultProps = {
        label: this.labelProperty,
        // value: this.valueProperty,
        children: "children",
        disabled: 'disabled'
      }
      if (this.lazy) {
        defaultProps['isLeaf'] = 'isLeaf'
      }
      return Object.assign({}, defaultProps, this.props)
    },
    flatTreeData() {
      return this.data ? this.flatData(this.data) : []
    },
    checkStrict() {
      // 单选设置为一定不能父子关联，否则单选失去意义，多选情况下，checkStrictly优先级更高，默认是false，即关联选中
      return !this.multiple ? true : (this.checkStrictly ? true : false)
    },
    checkbox() {
      return this.multiple
    },
    expandOnClickNode() {
      return this.multiple
    },
    _placeholder() {
      return this.placeholder ? this.placeholder : (this.filterable ? '请选择或输入' : '请选择')
    },
    highlight() {
      return !this.multiple
    },
    isSearch() {
      return this.lazy && (this.searchData.length > 0 || this.searchValue) || this.searchValue
    },
    _popperClass() {
      return this.isSearch ? `ui-treeselect ${this.popperClass}` : 'ui-treeselect'
    },
    collapseTags() {
      return this.maxTagCount && (this.selectKeys.length > this.maxTagCount) ? true : false
    },
    _checkOnClickNode() {
      return !this.multiple ? true : this.checkOnClickNode
    }
  },
  methods: {
    handleData(data) {
      const { defaultProps } = this
      const currentData = Array.isArray(data) ? data : (data ? [data] : [])
      const newArray = [];
      const loop = temp => {
        temp.disabled = temp.ntype === this.stype ? false : true;
        if (temp[defaultProps.children] && temp[defaultProps.children].length > 0) {
          temp[defaultProps.children].forEach(item => loop(item));
        }
        return temp;
      };
      currentData.forEach((value, index) => {
        const cache = JSON.parse(JSON.stringify(value));
        newArray[index] = loop(cache);
      });
      return newArray;
    },
    flatData(data) {
      const { defaultProps } = this
      return data.reduce((acc, cur) => {
        acc.push(cur)
        if (cur[defaultProps.children] && cur[defaultProps.children].length > 0) {
          acc = acc.concat(this.flatData(cur[defaultProps.children]))
        }
        return acc;
      }, [])
    },
    //@click Tree
    setSelectValue(nodes, checkNodes) {
      const { multipleSelect, singleSelect, multiple } = this;
      const { checkedKeys } = checkNodes
      multiple ? multipleSelect(nodes, checkedKeys) : singleSelect(nodes);
    },
    multipleSelect(nodes, checkedKeys) {
      const { lazy, valueProperty, labelProperty, ntype, defaultProps, checkStrict } = this;
      const valueField = this.selectKeys.length > 0 ? this.selectKeys : []
      const labelField = this.selectValue.length > 0 ? this.selectValue : []
      const optionField = this.selectOptions.length > 0 ? this.selectOptions : []

      const checkNode = [];
      //懒加载且父子关联时，返回点击复选框加载的数据
      if (lazy && nodes && !checkStrict && typeof this.loadOnCheckboxClick === 'function') {
        const checked = checkedKeys.includes(nodes[valueProperty])
        this.loadOnCheckboxClick(nodes, (resData) => {
          const data = Array.isArray(resData) && resData.length > 0 ? [nodes, ...resData] : (!Array.isArray(resData) ? [nodes, resData] : [nodes])
          const loop = (temp) => {
            // if (temp[defaultProps.children] && temp[defaultProps.children].length > 0) {
            //     temp[[defaultProps.children]].forEach(item => loop(item));
            // }else {
            if (temp[defaultProps.children] && temp[defaultProps.children].length > 0) {
              temp[[defaultProps.children]].forEach(item => loop(item));
            }
            if (checked) {//选中
              if (ntype) {
                if (temp.ntype === ntype) {
                  const value = temp[valueProperty]
                  const label = temp[labelProperty]
                  if (!valueField.includes(value)) {
                    checkNode.push(temp)
                    valueField.push(value)
                    labelField.push(label)
                    optionField.push({ value, label });
                  }
                }
              } else {
                const value = temp[valueProperty]
                const label = temp[labelProperty]
                if (!valueField.includes(value)) {
                  checkNode.push(temp);
                  valueField.push(value)
                  labelField.push(label)
                  optionField.push({ value, label });
                }
              }
            } else {//反选
              const value = temp[valueProperty]
              const index = valueField.findIndex(v => v === value)
              valueField.splice(index, 1)
              labelField.splice(index, 1)
              optionField.splice(index, 1)
            }
            // }
          }
          data.forEach(item => {
            const cache = JSON.parse(JSON.stringify(item));
            loop(cache)
          })
          this.selectNode = checkNode
          this.selectValue = labelField;
          this.selectKeys = valueField
          this.deliveryMessage(valueField, labelField, optionField);
        })
      } else {
        const cache = this.$refs.tree.getCheckedNodes();
        cache.forEach(cur => {
          if (this.ntype) {
            if (cur.ntype === this.ntype) {
              const value = cur[valueProperty]
              const label = cur[labelProperty]
              checkNode.push(cur)
              if (!valueField.includes(value)) {
                valueField.push(value)
                labelField.push(label)
                optionField.push({ value, label });
              }
            }
          } else {
            const value = cur[valueProperty]
            const label = cur[labelProperty]
            checkNode.push(cur);
            if (!valueField.includes(value)) {
              valueField.push(value)
              labelField.push(label)
              optionField.push({ value, label });
            }
          }
        });
        if (Array.isArray(checkedKeys) && !checkedKeys.includes(nodes[valueProperty])) { //懒加载时考虑初始化参数，不在选中节点中，说明当前节点不勾选，应该在已选的数组中删除 
          if (valueField && valueField.length > 0) {
            const tempValue = [...valueField]
            tempValue.forEach((v) => {
              if (!checkedKeys.includes(v)) {
                let index = valueField.findIndex(item => item === v)
                valueField.splice(index, 1)
                labelField.splice(index, 1)
                optionField.splice(index, 1)
              }
            })
          }
        }
        this.selectNode = checkNode
        this.selectValue = labelField;
        this.selectKeys = valueField
        this.deliveryMessage(valueField, labelField, optionField);
      }
    },
    singleSelect(nodes) {
      const { valueProperty, labelProperty } = this;
      const value = nodes[valueProperty]
      const label = nodes[labelProperty]

      this.$refs.tree.setCheckedKeys([value]);
      this.selectValue = label;
      this.selectNode = nodes
      this.selectKeys = value
      this.deliveryMessage(value, label, [{ value, label }]);
      this.$refs.elSelect.blur();
    },
    deliveryMessage(valueField, labelField, optionField) {
      this.selectOptions = optionField
      this.$emit("input", valueField);
      this.$emit("update:value-field", valueField);
      this.$emit("update:init-value", labelField);
      this.$emit("update:label-field", labelField);
      this.$emit("update:option-field", optionField);
      this.$emit("change", valueField, labelField, optionField);
    },
    selectClear() {
      this.$refs['tree'].setCheckedKeys([])
      const { multiple } = this;
      const label = multiple ? [] : "";
      const value = multiple ? [] : "";
      const optionField = multiple ? [] : {};
      this.selectValue = label
      this.selectNode = optionField
      this.selectKeys = value
      this.deliveryMessage(value, label, optionField);
      this.$emit('clear')
    },
    removeTag(tag) {
      // const { valueProperty } = this
      this.$emit('remove', tag)
      if (Array.isArray(this.selectOptions)) {
        const index = this.selectOptions.findIndex(o => o.value === tag)
        this.selectOptions.splice(index, 1)
        this.selectValue.splice(index, 1)
      }

      if (tag) {
        this.$refs.tree.setChecked(tag, false, true);
      }
      this.deliveryMessage(this.selectKeys, this.selectValue, this.selectOptions);
    },

    loadNode(node, resolve) {
      const { labelProperty, valueProperty, selectKeys } = this

      this.load(node, (data) => {
        if (node.level === 0) {
          this.originData = data
        }
        resolve(this.stype ? this.handleData(data) : data)
        Array.isArray(data) && data.forEach(n => {
          if (this.multiple) {
            if (selectKeys.findIndex(k => k === n[valueProperty]) > -1) {
              this.$refs['tree'] && this.$refs['tree'].setCheckedKeys(this.selectKeys)
            }
          } else {
            // const target = selectKeys.find(k => k === n[valueProperty])
            // if(target) {
            //     this.$refs['tree'] && this.$refs['tree'].setCurrentKey(n[valueProperty])
            // }
            if (selectKeys == n[valueProperty]) {
              this.$refs['tree'] && this.$refs['tree'].setCurrentKey(n[valueProperty])
            }
          }
        })

      })

    },
    filterMethod(value, data) {
      if (!value) return true;
      const pinName = pinyin(data[this.labelProperty] || '', { toneType: 'num', type: 'array' })
      const pinValue = pinyin(value || '', { toneType: 'num', type: 'array' })
      return pinValue.every(v => pinName.join().includes(v))
    },
    getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.$refs['tree'].getCheckedNodes(leafOnly, includeHalfChecked)
    },
    inputFilter(v) {
      this.searchValue = v
      if (v) {
        if (this.lazy) {
          if (typeof this.lazySearch === 'function') {
            this.isLoading = true
            this.lazySearch(v,
              (data) => {
                this.isLoading = false
                this.searchData = data || []
                const { valueProperty, selectKeys } = this
                Array.isArray(data) && data.forEach(n => {
                  if (!this.multiple) {
                    const target = selectKeys.find(k => k === n[valueProperty])
                    if (target) {
                      // this.$refs['tree'].setChecked(n[valueProperty], true)
                      this.$refs['tree'] && this.$refs['tree'].setCurrentKey(n[valueProperty])
                    }
                  } else {
                    if (selectKeys.findIndex(k => k === n[valueProperty]) > -1) {
                      this.$refs['tree'] && this.$refs['tree'].setCheckedKeys(selectKeys)
                    }
                  }
                })
              },
              () => {
                this.isLoading = false
              }
            )
          }
        } else {
          this.$refs['tree'].filter(v)
        }
      } else {
        if (this.multiple) {
          if (!this.selectValue || (Array.isArray(this.selectValue) && this.selectValue.length === 0))
            this.clearFilter()
        } else {
          this.clearFilter()
        }
      }
    },
    clearFilter() {
      if (this.lazy) {
        this.searchData = []
      } else {
        this.$refs['tree'].filter('')
      }
    },
    setDefaultSelect() {
      if (this.lazy) {
        const { value, multiple, initValue } = this
        if (multiple) {
          this.selectValue = Array.isArray(initValue) ? initValue : (initValue ? [initValue] : [])
          this.selectKeys = Array.isArray(value) ? value : (value ? [value] : [])
          this.selectOptions = this.selectKeys.length > 0 ?
            this.selectKeys.map((v, i) => { return { 'value': v, 'label': this.selectValue[i] } })
            : [];
        } else {
          this.selectValue = Array.isArray(initValue) ? initValue[0] : (initValue ? initValue : '')
          this.selectKeys = Array.isArray(value) ? value[0] : (value ? value : '')
          this.selectOptions = this.selectKeys ? [{ 'value': this.selectKeys, 'label': this.selectValue }] : []
        }
      } else {
        if (this.multiple) {
          const selectValue = Array.isArray(this.value) ? this.value : (this.value ? [this.value] : [])
          this.$nextTick(() => {
            this.$refs['tree'] && this.$refs['tree'].setCheckedKeys(selectValue)
            const selectNode = this.$refs['tree'] && this.$refs['tree'].getCheckedNodes() || []
            if (selectNode.length > 0) {
              if (this.ntype) {
                this.selectNode = selectNode.filter(n => n.ntype === this.ntype)
              } else {
                this.selectNode = JSON.parse(JSON.stringify(selectNode))
              }

              this.selectValue = this.selectNode.map(s => s[this.labelProperty])
              this.selectKeys = this.selectNode.map(s => s[this.valueProperty])
              this.selectOptions = this.selectKeys.length > 0 ?
                this.selectKeys.map((v, i) => { return { 'value': v, 'label': this.selectValue[i] } })
                : [];
              this.deliveryMessage(this.selectKeys, this.selectValue, this.selectOptions)
            }
          })

        } else {
          const selectValue = Array.isArray(this.value) ? this.value[0] : (this.value ? this.value : '')
          this.selectKeys = selectValue

          this.$nextTick(() => {
            if (selectValue) {
              this.$refs['tree'] && this.$refs['tree'].setCurrentKey(selectValue)
              const selectNodes = this.$refs['tree'] && this.$refs['tree'].getCurrentNode() || []
              if (selectNodes) {
                if ((this.ntype && this.ntype === selectNodes.ntype) || !this.ntype) {
                  this.selectValue = selectNodes[this.labelProperty]
                  this.selectNode = selectNodes
                  this.selectOptions = this.selectKeys ? [{ 'value': this.selectKeys, 'label': this.selectValue }] : []
                  this.deliveryMessage(this.selectKeys, this.selectValue, this.selectOptions)
                }
              }
            }
          })
        }
      }
    },
    onChange(v) {
      if (!this.selectValue || (Array.isArray(this.selectValue) && this.selectValue.length === 0)) {
        this.clearFilter()
      }
    },
    onVisibleChange(bool) {
      if (!bool) {
        this.searchValue = ''
        this.clearFilter()
        this.$emit("update:searching", false)
      }
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.originData = val
        if (val.length > 0) {
          this.setDefaultSelect()
        }
      }
    },
    searchValue(v) {
      this.$emit("update:searching", this.isSearch ? true : false)
    },
    initValue: {
      handler(v) {
        if (v) {
          this.setDefaultSelect()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.setDefaultSelect()
  }
};
</script>

<style lang="scss">
@import "./treeselect.scss";
</style>
