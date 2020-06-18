<template>
  <span>
    <input class="my-input" type="text" placeholder="提示信息..."/>
  </span>
</template>

<script>
  export default {
    name: 'my-input'
  }
</script>

<style scoped>
  .my-input{
    outline: none;
    height: 31px;
    box-sizing: border-box;
    border: 1px solid #E2E2EA;
    border-radius: 8px;
    padding: 0 8px;
    width: 200px;
    font-size: 11px;
    overflow: hidden;
  }
  .my-input::placeholder{
    color: #92929D;
  }

</style>
