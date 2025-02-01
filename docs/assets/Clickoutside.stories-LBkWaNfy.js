import{j as t}from"./jsx-runtime-Cw8dmJ57.js";import{R as a}from"./index-C57_-39e.js";import{C as i}from"./index-C9BqlD_n.js";import{f as d}from"./index-MpUCZ_R_.js";import"./index-B_KJRbAy.js";import"./index-D9XJHvQl.js";const k={title:"applejelly/misc/Clickoutside",component:i,args:{},parameters:{layout:"centered"},tags:["autodocs"],argTypes:{onClick:d(),isDisabled:{control:"boolean"}}},e={decorators:[p=>{const[r,c]=a.useState(0);return t.jsxs(t.Fragment,{children:[t.jsx(i,{onClick:()=>c(r+1),children:t.jsx("div",{style:{width:"100px",height:"100px",border:"1px solid red"}})}),t.jsxs("p",{children:["Click Outside Count : ",r]})]})}]};var o,s,n;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  decorators: [Story => {
    const [count, setCount] = React.useState(0);
    return <>\r
          <ClickOutside onClick={() => setCount(count + 1)}>\r
            <div style={{
          width: "100px",
          height: "100px",
          border: "1px solid red"
        }} />\r
          </ClickOutside>\r
          <p>Click Outside Count : {count}</p>\r
        </>;
  }]
}`,...(n=(s=e.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const f=["Basic"];export{e as Basic,f as __namedExportsOrder,k as default};
