<template>
  <span>
    <input class="d-input" type="text" :placeholder="placeholder"/>
  </span>
</template>

<script>
  export default {
    name: 'd-input',
    props: ['placeholder']
  }
</script>

<style scoped>
  .d-input{
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
  .d-input::placeholder{
    color: #92929D;
  }

</style>
