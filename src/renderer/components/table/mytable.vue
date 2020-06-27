<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="false"
  >
    <span slot="name" slot-scope="text">
      <span class="icon iconfont iconic_Checkbox" style="color: #3DD598"></span>
      <span style="overflow: hidden;text-overflow:ellipsis;white-space:nowrap;width: 220px;display: inline-block">
        {{ text }}
      </span>
    </span>
    <span slot="types">
      删除按钮
    </span>
    <span slot="action" >
      <a-switch default-checked style="transform: scale(0.8)"/>
    </span>
  </a-table>
</template>

<script>
  const columns = [
    // {
    //   title: '直播间标题',
    //   dataIndex: 'title',
    //   width: 280,
    //   key: 'title',
    //   scopedSlots: { customRender: 'name' }
    // },
    {
      title: '#直播房间id',
      dataIndex: 'id',
      width: 220,
      key: 'id'
    },
    {
      title: '最后一次链接时间',
      dataIndex: 'name',
      width: 220,
      key: 'name'
    },
    {
      title: '链接开关',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    },
    {
      title: '显示删除按钮',
      key: 'types',
      width: 100,
      dataIndex: 'types',
      scopedSlots: { customRender: 'types' }
    }
  ]

  const data = [
    {
      key: '1',
      title: '2020-06-09 12:06:30',
      id: '#123213',
      name: '2020-06-09 12:06:30',
      types: '珊瑚虫',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      title: '【呆河马羽风】解说型相声主播说的话说肯定会手机客户端撒科技等哈看',
      id: '#9120',
      name: '2020-06-09 12:06:30',
      types: '娱乐 · 学习',
      tags: ['loser']
    },
    {
      key: '3',
      title: '【呆河马羽风】解说型相声主播说的话说肯定会手机客户端撒科技等哈看',
      id: '#2221',
      name: '2020-06-09 12:06:30',
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
