<template>
  <div class="d-flex bg-light pt-3 p-2 overflow-auto flex-column">
    <div class="clearfix">
      <div
        class="btn btn-success float-right"
        :class="{'disabled': !template || !language || !email}"
        @click="sendRequest()"
      >Send Notification</div>
    </div>
    <div
      class="emails rounded border border-secondary position-relative p-2 pt-4 m-1 mb-5"
      style="width:calc(100% - 0.5rem)"
    >
      <h4 class="position-absolute bg-light px-2 text-primary" style="top:-15px;left:10px">Template</h4>
      <div class="input-group mb-1">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01">Template Name</label>
        </div>
        <select class="custom-select" id="inputGroupSelect01" v-model="template">
          <option v-for="(t,i) in templates" :key="i" :value="i">{{i}}</option>
        </select>
      </div>
      <div class="input-group mb-1">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect02">Template Language</label>
        </div>
        <select class="custom-select" id="inputGroupSelect02" v-model="language">
          <option v-for="(t,i) in languages" :key="i" :value="i">{{i}}</option>
        </select>
      </div>
    </div>
    <div
      class="emails rounded border border-secondary position-relative p-2 pt-4 m-1 mb-5"
      style="width:calc(100% - 0.5rem)"
    >
      <h4 class="position-absolute bg-light px-2 text-primary" style="top:-15px;left:10px">Email</h4>
      <div class="input-group mb-3 w-100 d-flex">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">Email Addresses</span>
        </div>
        <input
          type="text"
          class="flex-grow-1"
          v-model="email"
          placeholder="can be camma seperated list also"
          aria-describedby="basic-addon1"
        />
      </div>
      <div class="input-group mb-3 w-100 d-flex">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">Email Subject</span>
        </div>
        <input
          type="text"
          class="flex-grow-1"
          v-model="emailsubject"
          placeholder="subject of email to send"
          aria-describedby="basic-addon1"
        />
      </div>
    </div>
    <div
      class="variables rounded border border-secondary position-relative p-2 pt-4 m-1 mb-5"
      style="width:calc(100% - 0.5rem)"
    >
      <h4 class="position-absolute bg-light px-2 text-primary" style="top:-15px;left:10px">VARIABLES</h4>
      <div class="variables">
        <div v-if="!variables" class="alert alert-warning w-100">No Templates Selected</div>
        <div v-else>
          <div
            v-if="!variables.length"
            class="alert alert-success w-100"
          >this templates needs no variable</div>
          <div v-else>
            <div
              class="input-group var m-1 border px-1 rounded text-light position-relative"
              v-for="(v,i) in variables"
              :key="i"
            >
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">{{v.text}}</span>
              </div>
              <input
                :type="v.type || 'text'"
                class="form-control"
                :placeholder="v.type == 'text'?'String':'Number'"
                v-model="v.value"
              />
              <div class="input-group-append pl-2">
                <div class="form-check form-check-inline small text-primary">
                  <input
                    :name="v.text+'_vname'"
                    type="radio"
                    :id="v.text+'_num'"
                    value="number"
                    v-model="v.type"
                  />
                  <label class="form-check-label pl-1" :for="v.text+'_num'">Number</label>
                </div>
                <div class="form-check form-check-inline small text-primary">
                  <input
                    :name="v.text+'_vname'"
                    type="radio"
                    :id="v.text+'_text'"
                    value="text"
                    v-model="v.type"
                  />
                  <label class="form-check-label pl-1" :for="v.text+'_text'">Text</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      languages: {},
      template: null,
      language: null,
      email: "",
      emailsubject: "",
      variables: null,
    };
  },
  created() {},
  methods: {
    getvariables(str) {
      let r = /%%\w+/g;
      let c = r.exec(str);
      let vars = [];
      let errors = [];
      while (c != null) {
        let oldvar = vars.find((v) => v.text == c[0].replace("%%", ""));
        if (oldvar) {
          oldvar.index.push(c.index);
        } else {
          vars.push({
            text: c[0].replace("%%", ""),
            var: c[0],
            index: [c.index],
            type: "text",
            value: "",
          });
        }
        c = r.exec(str);
      }
      r = /\{\{(.*?)\}\}/g;
      let getvar = /[a-zA-Z]\w*/g;
      let geterror = /\.|`/g;
      c = r.exec(str);
      while (c) {
        let strings = [];
        let exp = c[1]
          .replace(/".*?"/g, (str) => {
            strings.push(str);
            return "%%" + "-".repeat(str.length - 2);
          })
          .replace(/'.*?'/g, (str) => {
            strings.push(str);
            return "%%" + "-".repeat(str.length - 2);
          });
        let e = geterror.exec(exp);
        while (e) {
          errors.push({
            index: c.index + e.index + 2,
            text: e[0],
            error:
              'unsupported charecter in template expression "' + e[0] + '"',
          });
          e = geterror.exec(exp);
        }
        let v = getvar.exec(exp);
        while (v != null) {
          if (
            exp.slice(v.index + v[0].length, v.index + v[0].length + 1) == "("
          ) {
            if (
              !["rounddown", "roundup", "round", "number", "gettemp"].includes(
                v[0]
              )
            ) {
              errors.push({
                index: c.index + v.index + 2,
                text: v[0],
                error: '"' + v[0] + '()" function can not be used!!!',
              });
            }
          } else {
            let oldvar = vars.find((ov) => ov.text == v[0]);
            if (oldvar) {
              oldvar.index.push(c.index + v.index + 2);
            } else {
              vars.push({
                text: v[0],
                var: v[0],
                index: [c.index + v.index + 2],
                type: "text",
                value: "",
              });
            }
          }
          v = getvar.exec(exp);
        }
        c = r.exec(str);
      }
      return { variables: vars, errors };
    },
    sendRequest() {
      if (!this.template || !this.language || !this.email) return;
      let body = {
        templateID: this.template,
        templateLang: this.language,
        emails: this.email.split(","),
        EMAIL_SUBJECT: this.emailsubject,
        VALUES: this.variables.reduce(
          (cu, v) => ({ ...cu, [v.text]: v.value }),
          {}
        ),
      };
      this
        .fetch("/api/email", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify(body),
        })
        .then((r) => r.json())
        .then((r) => {
          if (r.error)
            this.$swal({
              type: "error",
              title: "Error in request",
              text: "couln't send request of notification to DNS server",
            });
          else
            this.$swal({
              type: "success",
              title: "request sent",
              text:
                "request of notification was sent successfully to dns , for result refer to log page",
            });
        })
        .catch(() => {
          this.$swal({
              type: "error",
              title: "Error in request",
              text: "couln't send request of notification to DNS server",
            });
        });
    },
  },
  computed: {
    templates() {
      return this.$root.cache;
    },
  },
  watch: {
    template(val) {
      this.language = null;
      this.languages = this.templates[val];
    },
    language(val) {
      if (!val) this.variables = null;
      let vars = this.getvariables(
        this.templates[this.template][this.language]
      );
      if (vars.errors.length) {
        this.variables = null;
        return this.$swal({
          icon: "error",
          title: "Error!!!",
          text: "templates has errors, please resolve them first",
        });
      }
      this.variables = vars.variables;
    },
    variables: {
      deep: true,
      handler: () => {},
    },
  },
};
</script>

<style>
</style>