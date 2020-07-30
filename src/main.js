import socket from "./connections/socket";
import fetch from "./connections/fetch.js"
// my own proto functions
require("./utils/prototypes");

 
// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';
// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

// custom styles
import "./scss/globalstyle.scss";
import "./scss/vue-transitions.scss";

//toastr
// window.toastr = require("toastr");
// window.toastr.options.preventDuplicates = true;
// import "toastr/build/toastr.min.css";

// prepairing vue
import Vue from "vue";
import VueSweetalert2 from 'vue-sweetalert2';
import App from "./App.vue";
import router from "./router";
Vue.use(VueSweetalert2);
Vue.mixin({
  data: function() {
    return {
      socket,
      fetch
    };
  }
});
// initializing app
Vue.config.productionTip = true;
new Vue({
  router,
  data(){
    return{
      logList:[],
      cache:[],
    }
  },
  render: h => h(App)
}).$mount("#app");
