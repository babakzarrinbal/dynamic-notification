<template>
  <div class="d-block overflow-auto bg-light d-flex p-3 flex-column ">
    <div v-if="!$root.logList.length" class="alert alert-warning m-1 w-100">Still no action received</div>
    <div v-for="(d,i) in $root.logList" :key="i" :class="'mb-3 alert alert-'+d.msgtype" >
      <div class="text-left">
        <strong>
          timestamp:
        </strong>
        {{(d.msgdata||{}).timeStamp}}
        <br />
        <strong>
          message:
        </strong>
        {{(d.msgdata||{}).text}}
      </div>
      <div v-if="d.msgdata.data">{{d.msgdata.data}}</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>