<template>
  <div ref="lineChart" style="flex: 1"></div>
</template>

<script>
  const option = {
    backgroundColor: 'white',
    grid: {
      top: 8,
      left: 50,
      right: 20,
      bottom: 20
    },
    xAxis: {
      type: 'category',
      data: ['1', '2', '3', '4', '5', '6', '7','8','9','10'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F1F1F5'
        }
      },
      axisLabel: {
        color: '#92929D'
      },
      axisLine: {
        show: false
      },
      boundaryGap: false,
      axisTick: {
        show: false,
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      splitNumber: 5,
      axisLabel: {
        color: '#92929D',
        margin: 15
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [{
      data: [230, 324, 500, 1056, 605, 400, 200,239,320,312],
      symbol: 'none',
      type: 'line',
      lineStyle: {
        width: 3,
        color: '#0062FF'
      },
      smooth: true
    }]
  }

  export default {
    name: 'linecharts',
    mounted () {
      const chart = this.$echarts.init(this.$refs.lineChart)
      chart.setOption(option)
    }
  }
</script>

<style scoped>

</style>
