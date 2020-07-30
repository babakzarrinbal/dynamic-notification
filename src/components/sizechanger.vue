<template>
  <div
    class="bg-dark text-light"
    style="z-index:9999;width:10px;user-select:none;user-drage:none;cursor:ew-resize;margin-top:-15px;margin-bottom:-15px;position:relative; "
    @mousedown="lock($event)"
    @touchmove="lock($event)"
    draggable="false"
    ref="dragger"
  >
    <div
      class="collapse-btn position-absolute bg-dark "
      style="top:10px; transform:rotateZ(180deg)"
      @mousedown.stop
      @click.stop="$emit('mousemove',0)"
    >&#10144;</div>
    <div
      class="collapse-btn position-absolute bg-dark "
      style="top:calc(50% - 15px); font-weight:300;font-size: 27px;line-height: 30px;
"
      
      @click.stop="$emit('mousemove',50)"
    >&#9775;</div>
    <div
      class="collapse-btn position-absolute bg-dark "
      style="bottom:10px;"
      @mousedown.stop
      @click.stop="$emit('mousemove',100)"
    >&#10144;</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentEle: null,
      width: 0
    };
  },
  mounted() {
    this.parentEle = this.$refs.dragger.parentElement;
  },
  methods: {
    mouseup() {
      window.document.body.style.cursor = "";
      window.removeEventListener("mousemove", this.mousemove);
      window.removeEventListener("touchmove", this.mousemove);
      window.removeEventListener("mouseup", this.mouseup);
    },
    mousemove(e) {

      let width =
        ((e.clientX || e.touches[0].clientX) - this.containerOffset) /
        this.containerwidth;
      window.Math.round((width < 0 ? 0 : width > 1 ? 1 : width) * 100) + "%";
      this.$emit(
        "mousemove",
        window.Math.round((width < 0 ? 0 : width > 1 ? 1 : width) * 100)
      );
    },
    lock() {
      this.containerwidth = this.parentEle.offsetWidth;
      this.containerOffset = this.parentEle.offsetLeft;
      window.document.body.style.cursor = "ew-resize";

      window.addEventListener("mouseup", this.mouseup);
      window.addEventListener("mousemove", this.mousemove);
      window.addEventListener("touchmove", this.mousemove);
    },
    touch(e) {
      console.log(e);
    }
  }
};
</script>

<style>
.collapse-btn {
  left: -10px;
  width: 30px;
  height: 30px;
  font-size: 21px;
  font-weight: 900;
  padding-top: 0px;
  border-radius: 50%;
  cursor:pointer;
}
</style>