import{r as i}from"./index-C57_-39e.js";import{r as m}from"./index-D9XJHvQl.js";var n={},u;function c(){if(u)return n;u=1;var e=m();return n.createRoot=e.createRoot,n.hydrateRoot=e.hydrateRoot,n}var R=c(),s=new Map;function v(){return globalThis.IS_REACT_ACT_ENVIRONMENT}var f=({callback:e,children:t})=>{let r=i.useRef();return i.useLayoutEffect(()=>{r.current!==e&&(r.current=e,e())},[e]),t};typeof Promise.withResolvers>"u"&&(Promise.withResolvers=()=>{let e=null,t=null;return{promise:new Promise((r,o)=>{e=r,t=o}),resolve:e,reject:t}});var d=async(e,t,r)=>{let o=await p(t,r);if(v()){o.render(e);return}let{promise:a,resolve:l}=Promise.withResolvers();return o.render(i.createElement(f,{callback:l},e)),a},w=(e,t)=>{let r=s.get(e);r&&(r.unmount(),s.delete(e))},p=async(e,t)=>{let r=s.get(e);return r||(r=R.createRoot(e,t),s.set(e,r)),r};export{d as renderElement,w as unmountElement};
