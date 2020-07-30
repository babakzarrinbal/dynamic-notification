import Vue from "vue";
import Router from "vue-router";
import templates from "./views/templates"
import notification from "./views/notification"
import logs from "./views/logs"
import help from "./views/help"

Vue.use(Router);

var router = new Router({
  routes: [
    {
      path: "/",
      name: "templates",
      component: templates,
      meta: { keepAlive: true }
    
    },
    {
      path: "/notification",
      name: "notification",
      component: notification,
      meta: { keepAlive: true }
    },
    {
      path: "/logs",
      name: "logs",
      component: logs,
      meta: { keepAlive: true }
    },
    {
      path: "/help",
      name: "help",
      component: help,
      meta: { keepAlive: true }
    }
  ]
});


export default router;
