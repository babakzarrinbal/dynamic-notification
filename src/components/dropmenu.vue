<template>
  <div class="position-absolute dropdown-parent " >
    <ul class="position-relative list-group">
      <li
        class="list-group-item rounded-0 position-relative"
        v-for="(itm,k) in menuItems"
        :key="k"
        :class="itm.customClass +' '+ customClass"
        @click.stop="itm.action ? itm.action(itm,k,$event) : null"
      >
        <div class="title position-relative" style="z-index:2;">{{itm.title || ""}}</div>
        <div v-if="itm.children" class="position-absolute" style="z-index:2;top:5px;right:10px;font-size:20px;font-weight:900">&#x203A;</div>
        <DropMenu
          v-if="itm.children"
          :menuItems="itm.children"
          :customClass="customClass.replace(
            /\[([0-9]+)\]+$/,
            (fm, n) => '[' + (parseInt(n) + 1) + ']'
          )"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DropMenu",
  props: {
    menuItems: [Object, Array],
    customClass: {
      type: String,
      default: "Level-0"
    },
  }
};
</script>

