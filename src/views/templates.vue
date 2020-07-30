<template>
  <div class="d-flex pb-2">
    <div class="sidebar bg-info h-100 border-right px-2 pt-0 flex-shrink-0">
      <div class="pt-1 d-flex mode border-bottom border-dark mb-3">
        <div
          class="mod flex-grow-1 p-1 clickable border-right border-dark"
          @click="mode='edit'"
          :class="{'active':mode=='edit'}"
        >Edit</div>
        <div
          class="mod flex-grow-1 p-1 clickable"
          @click="mode='test'"
          :class="{'active':mode=='test'}"
        >Test</div>
      </div>
      <ul class="list-group w-100 overflow-auto">
        <li
          class="clickable btn-success btn list-group-item-info rounded bg-success text-center list-group-item-action text-light"
          @click="createTemp"
        >+ new</li>
        <li
          v-for="(t,i) in temps"
          :key="i"
          @click="selectTemp(i)"
          :class="{'active': selectedtemp==i}"
          class="clickable list-group-item-info rounded my-1 list-group-item list-group-item-action text-left justify-content-between d-flex"
        >
          <span>{{t.tid}}</span>
          <span>{{t.tlang}}</span>
        </li>
      </ul>
    </div>
    <div
      class="p-2 pt-4 editcontent h-100 flex-grow-1 bg-light rounded overflow-auto d-flex flex-column position-relative"
      v-if="selectedtemp !=null && mode =='edit'"
    >
      <div
        class="btn btn-danger position-absolute"
        style="top:10px;right:10px;"
        @click="deleteTemp()"
      >Delete</div>
      <h4 class="title bg-light text-primary pl-4 fort-weight-bold m-0 text-left">Variables</h4>
      <!-- <div class="btn btn-warning"></div> -->
      <div
        class="varlist mb-2 mt-0 border rounded d-flex flex-wrap overflow-auto position-relative"
        style="min-height:45px;max-height:200px"
      >
        <div
          class="novar d-flex justify-content-center align-items-center text-secondary w-100"
          v-if="!temps[selectedtemp].variables.length"
        >No Variable found in this template</div>
        <div
          class="var m-1 border px-1 rounded text-light btn btn-secondary position-relative"
          style="height:32px;overflow:visible"
          v-for="(v,i) in temps[selectedtemp].variables"
          :key="i"
          @click="gotovar(v)"
        >
          {{v.text}}
          <span
            class="position-absolute bg-info text-light d-flex small justify-content-center align-items-center"
            style="border-radius:50%;bottom:-5px;right:-5px;height:15px;width:15px;;"
            v-if="v.index.length>1"
          >{{v.index.length}}</span>
        </div>
      </div>
      <div class="editor w-100 flex-grow-1 position-relative mt-4">
        <h4
          class="title position-absolute bg-light text-primary px-2 fort-weight-bold"
          style="top:-20px;left:20px;"
        >Template</h4>
        <div class="actions position-absolute" style="right:5px;top:5px;">
          <div class="edit" v-if="!temps[selectedtemp].editable">
            <img
              src="/img/icon/edit-text.svg"
              class="imgclick"
              width="30px"
              height="30px"
              alt
              @click="edit()"
            />
          </div>
          <div class="edit d-flex flex-column" v-else>
            <img
              src="/img/icon/accept.svg"
              @click="saveEdit()"
              class="imgclick mb-3"
              width="30px"
              height="30px"
              alt
            />
            <img
              src="/img/icon/cancel.svg"
              class="imgclick"
              width="30px"
              height="30px"
              alt
              @click="cancelEdit()"
            />
          </div>
        </div>
        <div
          class="custom-control custom-switch actions position-absolute"
          style="top:-25px;right:20px;"
        >
          <input
            type="checkbox"
            class="custom-control-input"
            v-model="textDirection"
            id="customSwitch1"
          />
          <label class="custom-control-label clickable" for="customSwitch1">RTL</label>
        </div>
        <textarea
          class="w-100 h-100 px-2 pb-1 pt-3 rounded pr-5"
          @keyup="tempChange(temps[selectedtemp])"
          v-model="currtmp"
          style="resize: none;"
          :style="textDirection?'direction:rtl;':''"
          ref="textarea"
          :readonly="!temps[selectedtemp].editable"
          :class="{disabled:!temps[selectedtemp].editable}"
        ></textarea>
      </div>
    </div>
    <div
      v-if="selectedtemp !=null && mode =='test'"
      class="p-2 pt-4 testcontent h-100 flex-grow-1 bg-light rounded overflow-auto d-flex flex-column position-relative"
    >
      <div
        class="btn btn-success position-absolute"
        style="top:10px;right:10px;"
        @click="runTemp()"
      >Run</div>
      <h4 class="title bg-light text-primary pl-4 fort-weight-bold m-0 text-left">Variables</h4>
      <!-- <div class="btn btn-warning"></div> -->
      <div
        class="varlist mb-2 mt-0 border rounded d-flex flex-wrap overflow-auto position-relative"
      >
        <div
          class="novar d-flex justify-content-center align-items-center text-secondary w-100"
          v-if="!temps[selectedtemp].variables.length"
        >No Variable found in this template</div>
        <div
          class="input-group var m-1 border px-1 rounded text-light position-relative"
          v-for="(v,i) in temps[selectedtemp].variables"
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
      <div
        class="flex-grow-1 position-relative border rounded border-secondary overflow-auto"
        style="min-height:50%;padding-top:10px;"
      >
        <div class="w-100 h-100" v-if="runResult.errors.length">
          <div
            v-for="(e,i) in runResult.errors"
            :key="i"
            class="alert alert-danger m-1 w-100"
          >{{e.text}}</div>
        </div>
        <textarea
          v-model="runResult.result"
          disabled="disabled"
          style="resize: none;height:calc(100% - 7px) !important;border:none; margin:0;padding:10px"
          :style="textDirection? 'direction:rtl':''"
          class="w-100"
          v-else
        ></textarea>
        <div
          class="custom-control custom-switch actions position-absolute"
          style="top: -2px;right: 21px;"
        >
          <input
            type="checkbox"
            class="custom-control-input"
            v-model="textDirection"
            id="customSwitch2"
          />
          <label class="custom-control-label clickable" for="customSwitch2">RTL</label>
        </div>
      </div>
    </div>
    <div
      class="position-absolute w-100 d-flex flex-wrap errorbox border border-secondary bg-light"
      v-if="selectedtemp&&(temps[selectedtemp].errors||[]).length"
      :class="{'visible':showerror}"
    >
      <div class="btn btn-danger position-absolute toggler" @click="showerror=!showerror">errors</div>
      <div
        v-for="(e,i) in temps[selectedtemp].errors"
        :key="i"
        class="alert alert-danger m-1"
        @click="gotoerror(e)"
      >{{e.error}}</div>
    </div>
  </div>
</template>
<style lang="scss">
.sidebar {
  width: 215px;
  .mode {
    border-color: #80808075 !important;
    .mod {
      border-color: #80808075 !important;
    }
    .active {
      background-color: #80808075;
    }
  }
}
.imgclick {
  filter: drop-shadow(0 5px 2px gray);
  &:hover {
    filter: drop-shadow(0 5px 2px black);
  }
  &:active {
    filter: none;
    transform: translateY(2px);
    transition: all 0.2s;
  }
}
.disabled {
  color: gray;
  border-color: gray !important;
  background-color: #f6f6f7;
  &:focus {
    border-color: gray !important;
    outline: none;
  }
}
.errorbox {
  overflow: visible;
  bottom: 0;
  transform: translateY(100%);

  .toggler {
    right: 5px;
    top: -35px;
  }
  &.visible {
    transform: translateY(0);
  }
}
</style>


<script>
export default {
  data() {
    return {
      mode: "edit",
      temps: [],
      selectedtemp: null,
      statingtemp: "",
      currtmp: "",
      checktimeout: null,
      textDirection: false,
      showerror: false,
      runResult: { errors: [], result: "" },
    };
  },
  created() {
    this.mergecache(this.$root.cache);
  },
  computed: {},
  methods: {
    async selectTemp(i) {
      this.selectedtemp = i;
      this.currtmp = this.temps[i].value;
      let getvar = await this.getvariables(this.temps[i].value);
      this.temps[i].variables = getvar.variables;
      this.temps[i].errors = getvar.errors;
      this.runResult = { errors: [], result: "" };
      // this.showerrors(this.temps[i].errors);
    },
    tempChange(temp) {
      if (this.checktimeout) window.clearTimeout(this.checktimeout);
      this.checktimeout = window.setTimeout(() => {
        this.getvariables(this.currtmp).then(
          (v) => (
            (temp.variables = v.variables), (temp.errors = v.errors)
            // this.showerrors(temp.errors)
          )
        );
        this.checktimeout = null;
      }, 300);
    },
    edit() {
      this.temps[this.selectedtemp].editable = true;
      this.statingtemp = this.currtmp;
    },
    cancelEdit() {
      this.currtmp = this.temps[this.selectedtemp].value;
      this.temps[this.selectedtemp].errors = [];
      this.temps[this.selectedtemp].editable = false;
    },
    saveEdit() {
      try {
        const { errors: err } = this.runtempLocally(this.currtmp);
        if (err) this.temps[this.selectedtemp].errors.push(...err);
      } catch (e) {
        console.log("-----------", e);
      }
      if (this.temps[this.selectedtemp].errors.length) {
        this.showerror = true;
        return this.$swal({
          icon: "error",
          title: "Error!!!",
          text: "templates has errors, please resolve them first",
        });
      }

      if (this.statingtemp != this.temps[this.selectedtemp].value) {
        return this.$swal({
          icon: "error",
          title: "Error!!!",
          text:
            "template changed while you were editing... please cancel and edit agian",
        });
      }
      this.fetch("/api/template", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({
          TEMPLATE_V: this.currtmp,
          TEMPLATE_ID_N: this.temps[this.selectedtemp].tid,
          LANGUAGE_ID_N: this.temps[this.selectedtemp].tlang,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            this.$swal({
              icon: "error",
              title: "Error!!!",
              text: "Update/Create encounterd problems",
            });
            return;
          }
          this.temps[this.selectedtemp].editable = false;
          this.temps[this.selectedtemp].value = this.currtmp;
          this.$swal({
            icon: "success",
            title: "Update/Create successfull ",
            // text: "Update/Create encounterd problems",
          });
        })
        .catch(() =>
          this.$swal({
            icon: "error",
            title: "Error!!!",
            text: "Update/Create encounterd problems",
          })
        );
    },
    async getvariables(str) {
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
    gotovar(variable) {
      let start =
        variable.index.find((i) => i > this.$refs.textarea.selectionEnd) ||
        variable.index[0];
      this.$refs.textarea.focus();
      this.$refs.textarea.setSelectionRange(start, start + variable.var.length);
    },
    gotoerror(error) {
      this.$refs.textarea.focus();
      this.$refs.textarea.setSelectionRange(
        error.index,
        error.index + error.text.length
      );
    },
    mergecache(cache) {
      for (let t in cache) {
        for (let l in cache[t]) {
          let cur = this.temps.find((te) => te.tid == t && te.tlang == l);

          if (cur) cur.value = cache[t][l];
          else
            this.temps.push({
              tid: t,
              tlang: l,
              value: cache[t][l],
              editable: false,
              variables: [],
              errors: [],
            });
        }
      }
      this.temps.sort((a, b) =>
        a.tid + ":" + a.tlang > b.tid + ":" + b.tlang ? 1 : -1
      );
      if (this.temps.length && this.selectedtemp === null)
        this.selectedtemp = 0;
    },
    async createTemp() {
      const { value: tempid } = await this.$swal.fire({
        input: "text",
        inputPlaceholder: "Enter Template Name ID",
        showCancelButton: true,
        inputAttributes: {
          maxlength: 11,
        },
      });
      if (!tempid) return;
      const { value: templang } = await this.$swal.fire({
        input: "text",
        inputPlaceholder: "Enter Template Language ID",
        showCancelButton: true,
        inputAttributes: {
          maxlength: 2,
        },
      });
      if (!templang) return;
      if (this.temps.find((t) => t.tid == tempid && t.tlang == templang))
        return this.$swal({
          icon: "error",
          title: "Duplicate template!!!",
          text: "This template exist already " + tempid + ":" + templang,
        });
      this.temps.push({
        tid: tempid,
        tlang: templang,
        value: "",
        editable: true,
        variables: [],
        unsavedtemp: true,
      });
      this.selectTemp(this.temps.length - 1);
    },
    async deleteTemp() {
      const { value } = await this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "delete!",
      });
      if (!value) return;
      let temp = this.temps[this.selectedtemp];
      if (temp.unsavedtemp) {
        this.$swal({
          icon: "success",
          title: "Deleted successfully ",
        });
        let tid = temp.tid;
        let tlang = temp.tlang;
        this.selectedtemp = null;
        this.temps = this.temps.filter((t) => t.tid != tid && t.tlang != tlang);
        return;
      }

      this.fetch(`/api/template/${temp.tid}/${temp.tlang}`, {
        method: "delete",
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error)
            return this.$swal({
              icon: "error",
              title: "Error!!!",
              text: "Couldn't delete this template",
            });
          this.$swal({
            icon: "success",
            title: "Deleted successfully ",
          });
          let tid = temp.tid;
          let tlang = temp.tlang;
          this.selectedtemp = null;
          this.temps = this.temps.filter(
            (t) => t.tid != tid && t.tlang != tlang
          );
        })
        .catch(() =>
          this.$swal({
            icon: "error",
            title: "Error!!!",
            text: "Couldn't delete this template",
          })
        );
    },
    showerrors(errors) {
      if (!Array.isArray(errors)) errors = [errors];
      (this.curerrors || []).forEach((ce) => ce.close());
      this.curerrors = errors.map((error) =>
        this.$swal
          .mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 0,
            timerProgressBar: true,
            icon: "error",
            title: error.error,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", this.$swal.stopTimer);
              toast.addEventListener("mouseleave", this.$swal.resumeTimer);
              toast.addEventListener("click", () => {
                this.$refs.textarea.focus();
                this.$refs.textarea.setSelectionRange(
                  error.index,
                  error.index + error.text.length
                );
              });
            },
          })
          .fire()
      );
    },
    runTemp() {
      let templateID = this.temps[this.selectedtemp].tid;
      let templateLang = this.temps[this.selectedtemp].tlang;
      let values = this.temps[this.selectedtemp].variables.reduce(
        (cu, v) => ({ ...cu, [v.text]: v.value === undefined ? "" : v.value }),
        {}
      );
      this.fetch("/api/template-process", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ templateID, templateLang, values }),
      })
        .then((r) =>( r.json()))
        .then((rr) => {
          if (rr.localcheck) {
            let temp = this.temps[this.selectedtemp].value;
            if (temp === undefined) {
              return (this.runResult = {
                errors: [
                  {
                    index: 0,
                    text: "",
                    error: `couldn't find template ${templateID} with Language ${templateLang}`,
                  },
                ],
                result: "",
              });
            }
            this.runResult = this.runtempLocally(temp,values);
          } else {
            this.runResult = rr;
          }
        })
        .catch(() => (this.runResult = { errors: [], result: "" }));
    },

    runtempLocally(str, VALUES = {}) {
      let errors = [];
      let resultstr = "";

      str = str.replace(/%%\w+/g, (s) => {

        let v = VALUES[s.replace("%%", "")];
        return v || (v === 0 ? v : "");
      });
      let number = Number; // eslint-disable-line no-unused-vars
      let round = Math.round; // eslint-disable-line no-unused-vars
      let rounddown = Math.floor; // eslint-disable-line no-unused-vars
      let roundup = Math.ceil; // eslint-disable-line no-unused-vars
      // eslint-disable-next-line no-unused-vars
      let gettemp = (templateID, LANGUAGE, val) => {
        let temp = (
          this.temps.find((t) => t.tid == templateID && t.tlang == LANGUAGE) ||
          {}
        ).value;
        if (temp === undefined) {
          errors.push({
            index: 0,
            text: "",
            error: `couldn't find template ${templateID} with Language ${LANGUAGE}`,
          });
          return "";
        }
        let { result, ers } = this.runtempLocally(temp, val || VALUES);
        errors.push(...ers);
        return result;
      };
    
      // remove strings with quotes
      resultstr = str;
      let r = /\{\{(.*?)\}\}/g;
      let getvar = /[a-zA-Z]\w*/g;
      let c = r.exec(str);
      while (c) {
        let exp = "";
        let index = 0;
        let strings = [];
        let expre = c[1]
          .replace(/".*?"/g, (str) => {
            strings.push(str);
            return "%%" + "-".repeat(str.length - 2);
          })
          .replace(/'.*?'/g, (str) => {
            strings.push(str);
            return "%%" + "-".repeat(str.length - 2);
          });
        let v = getvar.exec(expre);
        while (v) {
          if (
            c[1].slice(v.index + v[0].length, v.index + v[0].length + 1) != "("
          ) {
            exp += c[1].slice(index, v.index) + "VALUES." + v[0];
            index = v.index + v[0].length;
          }
          v = getvar.exec(expre);
        }
        exp += c[1].slice(index, c[1].length);
        let result = "";
        try {
          result = eval(exp);
        } catch (error) {
          errors.push({
            error: `Couln'nt process ${c[0]} with values ${JSON.stringify(
              VALUES
            )}`,
            index: c.index,
            text: c[0],
          });
        }
        resultstr = resultstr.replace(c[0], result);
        c = r.exec(str);
      }
      return { result: resultstr, errors };
    },
  },
  watch: {
    temps: {
      deep: true,
      handler: () => {},
    },
    "$root.cache":{
      handler:function(cache){return this.mergecache(cache)}
    },
  },
};
</script>