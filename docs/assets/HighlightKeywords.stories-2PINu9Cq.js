import{j as t}from"./jsx-runtime-Cw8dmJ57.js";import{R as m}from"./index-C57_-39e.js";import{f as n}from"./index-DpuSo-Dk.js";import"./index-B_KJRbAy.js";import"./index-D9XJHvQl.js";const v={title:"applejelly/misc/HighlightKeywords",component:n,argTypes:{textToHighlight:{control:"text"},isCaseSensitive:{control:"boolean"},searchWords:{control:"text"}},parameters:{layout:"centered"},tags:["autodocs"]},e={args:{},decorators:[u=>{const i="Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, sunt!",[r,c]=m.useState("Lorem");return t.jsxs(t.Fragment,{children:[t.jsx(n,{searchWords:r,textToHighlight:i}),t.jsx("div",{style:{marginTop:50},children:t.jsx("input",{value:r,onChange:l=>c(l.target.value)})})]})}]};var o,s,a;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => {
    const content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, sunt!";
    const [value, setValue] = React.useState("Lorem");
    return <>\r
          <HighlightKeywords searchWords={value} textToHighlight={content} />\r
          <div style={{
        marginTop: 50
      }}>\r
            <input value={value} onChange={e => setValue(e.target.value)} />\r
          </div>\r
        </>;
  }]
}`,...(a=(s=e.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const y=["Basic"];export{e as Basic,y as __namedExportsOrder,v as default};
