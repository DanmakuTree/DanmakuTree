<template>
  <div style="flex: 1;padding: 16px 20px 80px 20px;background: #fafafb;display: flex;flex-direction: column">
    <div style="margin-bottom: 8px">
      <span class="h2">弹幕历史</span>
      <span>房间选择下拉框</span>
    </div>
    <div style="display: flex;flex: 1;justify-content: space-between;overflow: hidden">
      <div class="card-r" style="width: 134px;padding: 16px 8px;display: flex;flex-direction: column">
        <span
          style="height: 28px;text-align: center;background: #f2f7ff;border-radius: 8px;line-height: 31px;
        font-family: Poppins-SemiBold,sans-serif;font-size: 12px;color: #0062FF;margin-bottom: 6px">2020-06-01</span>
        <span
          style="height: 28px;text-align: center;background: transparent;border-radius: 8px;line-height: 31px;
        font-family: Poppins,sans-serif;font-size: 12px;color: #92929D;margin-bottom: 6px">2020-06-01</span>
        <span
          style="height: 28px;text-align: center;background: transparent;border-radius: 8px;line-height: 31px;
        font-family: Poppins,sans-serif;font-size: 12px;color: #92929D;margin-bottom: 6px">2020-06-01</span>
        <span style="flex: 1"/>
        <span>清空本日数据</span>
        <span>清空所有日志</span>
      </div>
      <div class="card-r" style="width: 568px;padding: 16px;display: flex;flex-direction: column;">
        <div style="margin-bottom: 16px">
          <a-select default-value="显示：弹幕" style="width: 120px">
            <a-select-option value="显示：弹幕">
              显示：弹幕
            </a-select-option>
            <a-select-option value="显示：礼物">
              显示：礼物
            </a-select-option>
          </a-select>
          <d-input style="float: right"/>
        </div>
        <div style="flex: 1;display: flex;overflow: scroll">
          <DynamicScroller
            :items="items"
            :min-item-size="54"
            class="scroller"
          >
            <template v-slot="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :size-dependencies="[
                  item.message,
                ]"
                :data-index="index"
              >
                <d-item/>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dItem from '../components/danmaku/item'
  import dInput from '../components/form/input'
  export default {
    name: 'History',
    components: {
      'd-input': dInput,
      'd-item': dItem
    },
    data: () => {
      return {
        items: [
          { message: '11231', id: 1 },
          { message: '11231', id: 2 },
          { message: '11231', id: 3 },
          { message: '1', id: 4 },
          { message: '11231', id: 5 },
          { message: 'sse', id: 6 },
          { message: 'sse', id: 7 },
          { message: 'sse', id: 8 },
          { message: 'sse', id: 9 },
          { message: 'sse', id: 10 },
          { message: 'sse', id: 11 },
          { message: 'sse', id: 12 },
          { message: 'sse', id: 13 },
          { message: 'sse', id: 14 }
        ]
      }
    }
  }
</script>

<style scoped>
  .scroller{
    flex: 1;
    overflow: scroll;
  }

</style>
