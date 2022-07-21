<template>
  <div class="i-mul-time-picker">
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      :required="required"
      :label="label"
      :rules="rules"
      @click="show = true"
    />
    <van-popup v-model="show" position="left" :style="{ width: '100%', height: '100%', padding: '10px' }">
      <div class="detail-wrap">
        <div v-for="item in dataProvider" :key="item.id" class="add-form-item-row">
          <div style="flex: 1;">
            <i-datetime-picker
              v-model="item.startTime"
              :required="required"
              label="开始时间"></i-datetime-picker>
            <i-datetime-picker
              v-model="item.endTime"
              :required="required"
              label="结束时间"></i-datetime-picker>
          </div>
          <van-icon name="delete-o" @click="delSingleInput(item.id)" />
        </div>
        <add-form-button :curNum="dataProvider.length" :maxNum="maxNum" @click="addSingleInput"></add-form-button>
      </div>
      <div class="button-wrap">
        <van-button type="default" @click="show = false">取消</van-button>
        <van-button type="info" @click="confirm">保存</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-10-29 16:28:56
* @description 多时间段选择器
*/
import addFormButton from './add-form-button'
import iDatetimePicker from '../i-datetime-picker'

export default {
  name: 'i-mul-time-picker',
  props: {
    label: {
      type: String,
      required: true
    },
    // 是否必填
    required: Boolean,
    // 表单校验规则
    rules: {
      type: Array,
      default: () => []
    },
    // 数据源：例如[{ startTime: '2021-10-01 00:00:00', endTime: '2021-10-02 00:00:00' }]
    value: {
      type: Array,
      default: () => []
    },
    // 最大限制个数
    maxNum: Number
  },
  components: { addFormButton, iDatetimePicker },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      fieldValue: '',
      show: false,
      dataProvider: this.value,
      showPicker: false
    }
  },
  created () {
    if (this.value.length) {
      this.dataProvider.forEach((e, i) => {
        e.id = 'data-' + i
      })
    } else {
      this.dataProvider = [
        { id: 'data-0', startTime: '', endTime: '' }
      ]
    }
  },
  mounted () {},
  methods: {
    addSingleInput () {
      const lastItem = this.dataProvider[this.dataProvider.length - 1]
      const i = lastItem.id.split('-')[1]
      this.dataProvider.push({ id: `data-${+i + 1}`, startTime: '', endTime: '' })
    },
    delSingleInput (id) {
      const index = this.dataProvider.findIndex(e => e.id === id)
      this.dataProvider.splice(index, 1)
    },
    confirm () {
      this.$emit('change', this.dataProvider)
      this.fieldValue = `已选${this.dataProvider.length}个时间段`
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.i-mul-time-picker {
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

  .detail-wrap {
    height: calc(100% - 60px);
    overflow-y: auto;

    .add-form-item-row {
      background-color: #f5f5f5;
      padding: 15px 5px 15px 10px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    .van-icon-delete-o {
      width: 30px;
      font-size: 26px;
      color: #333;
      margin-left: 5px;
    }
  }

  .button-wrap {
    padding: 8px 10px;
    display: flex;
    align-items: center;

    .van-button--normal {
      flex: 1;

      &:not(:last-child) {
        margin-right: 15px;
      }
    }
  }
}
</style>
