import{j as r}from"./jsx-runtime-Cw8dmJ57.js";import{b,m as c,c as $,n as y,W as e}from"./index-C9BqlD_n.js";import{R as v}from"./index-C57_-39e.js";import"./index-B_KJRbAy.js";import"./index-D9XJHvQl.js";const o="form_group";function p({children:s,size:a="md",isFullWidth:x=!1,className:B,direction:j="horizontal",shouldOverrideContext:f,as:n="div",...z}){const g=n;console.log("as",n);const l=!!b().size,u=f&&a||l||a,h=v.useMemo(()=>({size:u}),[u]);return c.jsx(g,{role:"group",className:$(o,`${o}--${j}`,{[`${o}--is-full-width`]:x,[`${o}--is-nested`]:l},B),children:c.jsx(y.Provider,{value:h,children:s})})}const N={title:"applejelly/form/Group",component:p,parameters:{layout:"centered"},argTypes:{},tags:["autodocs"]},t={args:{},decorators:[s=>r.jsxs(p,{children:[r.jsx(e,{label:"Button1"}),r.jsx(e,{label:"Button2"}),r.jsx(e,{label:"Button3"})]})]};var i,m,d;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => {
    return <Group>\r
          <Button label="Button1" />\r
          <Button label="Button2" />\r
          <Button label="Button3" />\r
        </Group>;
  }]
}`,...(d=(m=t.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const O=["Basic"];export{t as Basic,O as __namedExportsOrder,N as default};
