### 组件说明

显示弹幕列表

### 文件说明

| 文件名    | 说明                   |
| --------- | ---------------------- |
| index.vue | 顶级容器，用于渲染item |
| item.vue  | 单条弹幕的组件         |



### props说明

###### item.vue

| propsName | required | 说明                     |
| --------- | -------- | ------------------------ |
| options   | false    | 设置选项，通过父组件传递 |
| data      | true     | 一条弹幕的数据           |



###### Index.vue

|      |      |      |
| ---- | ---- | ---- |
|      |      |      |
|      |      |      |
|      |      |      |





### 说明

关于默认的设置选项为：

```js
const defaultOptions = {
    // 弹幕内容颜色
    color: '#26ace3',
    // 字号
    fontSize: '18px',
    // 显示舰队标示
    showGuardIcon: true,
    // 显示粉丝勋章
    showFansIcon: true,
    // 显示用户名
    showUserName: true,
    // 显示用户等级
    showUserLevel: true,
    // 显示弹幕内容
    showContent: true
  }
```

