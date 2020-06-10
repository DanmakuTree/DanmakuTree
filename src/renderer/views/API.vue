<template>
  <div class="container">
    <div>
      <v-treeview
        :items="tree"
        :load-children="fetch"
        dense
      ></v-treeview>
    </div>
    <div>123</div>
  </div>

</template>
<style scoped>
.container{
  margin: 0;
  padding: 0;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
}
</style>

<script>
  export default {
    data () {
      return {
        tree: [{
          name: 'Platform',
          id: 'Platform',
          children: []
        }]
      }
    },
    methods: {
      fetch (item) {
        var tree = item.id.split('.')
        var current = window.API
        while (tree.length > 0) {
          current = current[tree.shift()]
        }
        return current.getAvailable().then((res) => {
          if (res.status === 0) {
            res.result.forEach(element => {
              item.children.push({
                name: element,
                id: item.id + '.' + element,
                children: []
              })
            })
          } else {
            this.$delete(item, 'children')
          }
        })
      }
    }
  }
</script>
