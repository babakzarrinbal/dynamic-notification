<template>
  <div id="app" style="widht:100vw;height:100%;" @drop="createNewJson($event.dataTransfer.files)">
    <Header style="height:45px" />
    <transition name="fade">
      <router-view class="body" />
    </transition>
  </div>
</template>
<script>
import Header from "@/components/header";
export default {
  data() {
    return {
      expandSettings: false,
    };
  },
  components: {
    Header,
  },
  async created() {
    this.socket.on("log", (d) => {
      this.$root.logList.push(d);
      if ((this.$root.logList||[]).length > 200) this.$root.logList.shift();
    });
    this.socket.on("db-cache updated", (d) => {
      this.$root.cache = d;
    });
    this.fetch("/api/db-cache")
      .then((r) => r.json())
      .then((d) => (this.$root.cache = d.data || []));
  },
  watch: {},
  computed: {},
};
</script>
<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#header {
  height: 30px;
}
.body {
  position: relative;
  background-color: white;
  display: flex;
  overflow: hidden;
  // padding: 10px;
  height: calc(100% - 45px);
}
/deep/ .clickable {
  user-select: none;
  cursor: pointer;
}
</style>
