function observable(obj, isasync = false, cb) {
  let asyncid = null;
  const handler = {
    get: (target, prop) => {
      if (typeof target[prop] === "object" && target[prop] !== null) {
        return new Proxy(target[prop], handler);
      }
      return Reflect.get(target, prop);
    },
    set: (target, prop, value) => {
      const result = Reflect.set(target, prop, value);
      if (isasync) {
        if (asyncid) {
          clearTimeout(asyncid);
        }
        asyncid = setTimeout(() => {
          cb(obj);
        }, 0);
      } else {
        cb(obj);
      }
      return result;
    }
  };
  const proxyobj = new Proxy(obj, handler);
  return proxyobj;
}
const $ = document.querySelector.bind(document);
let root = undefined;
function render(target, arr) {
  target.innerHTML = "";
  for (const l of arr) {
    const li = document.createElement("li");
    li.textContent = l;
    target.appendChild(li);
  }
}
function mount(id) {
  root = $(id);
  return function(a) {
    render.call(null, root, a);
  };
}
let array = ["1", "2", "3"];
const renderFunc = mount("#root");
renderFunc(array);
window.data = observable(array, false, renderFunc);
