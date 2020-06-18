<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="false"
  >
    <span slot="name" slot-scope="text">
      <span class="icon iconfont iconic_Checkbox" style="color: #3DD598"></span>
      <span style="overflow: hidden;text-overflow:ellipsis;white-space:nowrap;width: 270px;display: inline-block">
        {{ text }}
      </span>
    </span>
    <span slot="types" slot-scope="types">
      {{types}}
    </span>
    <span slot="action" slot-scope="text, record">
      ...
    </span>
  </a-table>
</template>

<script>
  const columns = [
    {
      title: '直播间标题',
      dataIndex: 'title',
      width: 300,
      key: 'title',
      scopedSlots: { customRender: 'name' }
    },
    {
      title: '#id',
      dataIndex: 'id',
      width: 80,
      key: 'id'
    },
    {
      title: '主播',
      dataIndex: 'name',
      width: 120,
      key: 'name'
    },
    {
      title: '分区',
      key: 'types',
      width: 100,
      dataIndex: 'types',
      scopedSlots: { customRender: 'types' }
    },
    {
      title: 'Action',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]

  const data = [
    {
      key: '1',
      title: '【呆河马羽风】解说型相声主播说的话说肯定会手机客户端撒科技等哈看',
      id: '#123213',
      name: '呆河马羽风',
      types: '娱乐 · 学习',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      title: '【呆河马羽风】解说型相声主播说的话说肯定会手机客户端撒科技等哈看',
      id: '#9120',
      name: '直播用户名',
      types: '娱乐 · 学习',
      tags: ['loser']
    },
    {
      key: '3',
      title: '【呆河马羽风】解说型相声主播说的话说肯定会手机客户端撒科技等哈看',
      id: '#2221',
      name: '呆河马羽风',
      types: '娱乐 · 学习',
      tags: ['cool', 'teacher']
    }
  ]
  export default {
    name: 'mytable',
    data () {
      return {
        data,
        columns,
        selectedRowKeys: []
      }
    },
    computed: {
      hasSelected () {
        return this.selectedRowKeys.length > 0
      }
    }
  }
</script>

<style scoped>

</style>
