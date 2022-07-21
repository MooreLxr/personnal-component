<template>
  <div class="area-picker-popover">
    <el-popover placement="bottom" width="480" trigger="click" :popper-class="'area-picker'">
      <div style="padding:0 16px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="width:100%;">
          <el-breadcrumb-item v-for="(item,index) in selAreas" :key="index">
            <span @click="loadArea(item,index===0)" role="button">{{item[labelKey]+(index===selAreas.length-1?'>':'')}}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <span class="county-item"
              v-for="(item,index) in areaItems"
              :key="index"
              :class="{'active':selected==item}"
              @click="loadArea(item)">{{item[labelKey]}}</span>
      </div>
      <el-input slot="reference" prefix-icon="el-icon-location-outline" v-model="areaName"></el-input>
    </el-popover>
    
  </div>
</template>

<script>
/**
 * created by lxr at 2019-10-23 19:04:00
 * @description：行政区划选择
 * <area-picker-popover :source="areaData"></area-picker-popover>
 * areaData:[//类似该数据结构
 *  idno: "370000",
    label: "山东省",
    items: [{idno: "370100", label: "济南市",…}, {idno: "370200", label: "青岛市",…}, {idno: "370300", label: "淄博市",…},…]
 * ]
 */
import Vue from "vue"
import { Breadcrumb,BreadcrumbItem,Popover,Input } from 'element-ui'
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Popover)
Vue.use(Input)

export default {
  props: {
    source: Object,
    labelKey: {
      type: String,
      default: "label"
    },
    childrenKey: {
      type: String,
      default: "items"
    },
    isActive:{
      type:Boolean,
      default:true
    }
  },
  data () {
    return {
      selected: null,
      selAreas: [],//选中的区划级联数据
      areaItems: [],//当前选中区划的所有子级
      areaName:""
    }
  },
  mounted () {
    if(!this.isActive){
      this.areaItems = [this.source]
      this.selAreas = []
      return
    }
    this.loadArea(this.source,true);
  },
  methods: {
    loadArea (selItem,isFullView) {
      let { childrenKey,labelKey } = this
      if (selItem) {
        if (isFullView) {
          this.areaItems = selItem[childrenKey];
          this.selAreas = [selItem];
        } else if (selItem[childrenKey]) {
          let { selAreas } = this;
          if(selAreas.length){
            for (let index = 0; index < selAreas.length; index++) {
              let area = selAreas[index];
              if (area[childrenKey].includes(selItem)) {
                this.selAreas = selAreas.slice(0,index + 1);
                this.selAreas.push(selItem);
                this.areaItems = selItem[childrenKey];
                break;
              }
            }
          }else{
            this.selAreas = [selItem]
            this.areaItems = selItem[childrenKey]
          }
        }
        this.selected = selItem
        this.areaName = selItem && selItem[labelKey]
        this.$emit("changeCode",selItem)
      }
    }
  }
}
</script>

<style lang="scss">
.area-picker-popover{
  .el-input--small .el-input__icon{
    font-size: 20px;
    color: rgb(135, 135, 135);
  }
}
.area-picker{
  .el-breadcrumb{
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }
  .el-breadcrumb__item{
    line-height: 30px;
    font-size: 16px;
  }
  .county-item{
    display: inline-block;
    cursor: pointer;
    margin:5px;
    padding: 5px 10px;
    border-radius: 5px;
    line-height: 30px;
    &.active, &:hover{
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>