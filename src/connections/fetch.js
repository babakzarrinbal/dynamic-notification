import config from "./config";
//mock front
const paths = [
  { url: "/api/db-cache", response: {data: [],error:null} },
  {
    regex: /\/api\/template\/.*?\/[^/]*/,
    method: "delete",
    response: { error: null, data: "success" },
  },
  {
    url: "/api/template",
    method: "post",
    response: { error: null, data: "sucess" },
  },
  {
    url: "/api/template-process",
    response: { errors: [],error:[], result: "", localcheck: true },
  },
  { url: "/api/email", response: { error: null, data: "sucess" } },
];

const mockfetch = async function(path, options = {}) {
  let pathres = (
    paths.find((p) => {
      if (p.method) {
        if (
          ((!options.method || options.method.toLowerCase() == "get") &&
            p.method.toLowerCase() != "get") ||
          p.method != options.method
        )
          return false;
      }
      if (p.regex) {
        if ((p.regex.exec(path) || [])[0] != path) return false;
      } else if (p.url) {
        if (path.toLowerCase() != p.url.toLowerCase()) return false;
      }
      return true;
    }) || {}
  );
  return {
    json: () => pathres.response,
    text: () => (pathres.response != "string" ? JSON.stringify(pathres.response) : pathres.response),
  };
};

const fetch = function(path, ...args) {
  return window.fetch(config.host + path, ...args);
};
export default config.mock ? mockfetch : fetch;
