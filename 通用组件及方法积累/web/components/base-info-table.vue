<template>
  <div class="basic-info-table">
    <table>
      <tr v-for="i in Math.ceil(dataProvider.length/groupNum)" :key="i">
        <template v-for="(item,index) in dataProvider">
          <template v-if="index <= (groupNum*i - 1) && index >= (groupNum*i - groupNum)">
            <td :key="index +'label'"  class="label">{{item.label}}</td>
            <td :key="index + 'value'" class="value">{{item.value}}</td>
          </template>
        </template>
      </tr>
    </table>
  </div>
</template>
<script>
  export default {
    name: 'basic-info-table',
    props: {
      dataProvider: {
        type: Array,
        default: []
      },
      groupNum: {
        type: Number,
        default: 1
      }
    },
  }
</script>
<style lang="scss">
  .basic-info-table {
    width: 100%;
    height: 100%;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
      table-layout: fixed;
      td {
        font-size: 12px;
        padding: 5px 2px;
        border: 1px solid #e6e6e6;
      }
      .label {
        color: #000;
        background-color: #F2F2F2;
      }
      .value {
        color: #333;
        background-color: #FFFFFF;
      }
    }
  }
</style>
