<template>
  <div class="header d-flex border-bottom border-secondary pb-3 pt-1 pl-3 clickable bg-dark text-light">
    <router-link
      tag="div"
      class="p-2 d-flex justify-content-center align-items-center border-right border-primary "
      to="/"
    >templates</router-link>
    <router-link
      tag="div"
      class="p-2 d-flex justify-content-center align-items-center border-right border-primary "
      to="/notification"
    >Notifications</router-link>
    <router-link
      tag="div"
      class="p-2 d-flex justify-content-center align-items-center border-right border-primary "
      to="/logs"
    >logs</router-link>
    <router-link
      tag="div"
      class="p-2 d-flex justify-content-center align-items-center "
      to="/help"
    >help?</router-link>

  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.router-link-exact-active {
  background: #41577d;
}
</style>