<template>
  <div>
    <h1>关于</h1>
    <p>版本号： {{version}}</p>
    <p>Git版本号： {{GitVersion}}</p>
    <p>Git Hash： {{GitHash}}</p>
    <p>Git 分支： {{GitVersion}}</p>

  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        'moduleId': '9ead739b-a95d-4673-9e40-2f18f4ad895e',
        'version': '',
        'GitVersion': '',
        'GitHash': '',
        'GitBranch': ''
      }
    },
    mounted () {
      this.$main.getGitVersion().then((e) => {
        this.GitVersion = e.version
        this.GitHash = e.hash
        this.GitBranch = e.branch
      })
      this.$main.getVersion().then((e) => {
        this.version = e
      })
    }
  }
</script>
