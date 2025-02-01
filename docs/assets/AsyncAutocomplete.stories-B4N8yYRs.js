import{j as m}from"./jsx-runtime-Cw8dmJ57.js";import{R as d}from"./index-C57_-39e.js";import{f as n}from"./index-MpUCZ_R_.js";import{T as l}from"./index-DpuSo-Dk.js";import"./index-B_KJRbAy.js";import"./index-D9XJHvQl.js";const k=[{type:"Mango",value:"1540",subType:"Peach"},{type:"Mango",value:"1540",subType:"Plum"},{type:"Grape",value:"1079",subType:"Cherry"},{type:"Grape",value:"1079",subType:"Lemon"},{type:"Banana",value:"399",subType:"Raisin"},{type:"Apple",value:"30"},{type:"Orange",value:"7195"},{type:"Pear",value:"1563"},{type:"Kiwi",value:"2"}],g=[{key:"Apple",count:30,deps:1,totalDeps:2},{key:"Banana",count:399,deps:1,totalDeps:3},{key:"Raisin",count:399,deps:2,parent:"Banana",totalDeps:3},{key:"Orange",count:7195,deps:1,totalDeps:2},{key:"Mango",count:1540,deps:1,totalDeps:3},{key:"Grape",count:1079,deps:1,totalDeps:3},{key:"Peach",count:1200,deps:2,totalDeps:3,parent:"Mango"},{key:"Plum",count:340,deps:2,totalDeps:3,parent:"Mango"},{key:"Cherry",count:1059,deps:2,totalDeps:3,parent:"Grape"},{key:"Lemon",count:20,deps:2,totalDeps:3,parent:"Grape"},{key:"Pear",count:1563,deps:1,totalDeps:2},{key:"Kiwi",count:2,deps:1,totalDeps:2}],C=(o,e)=>{var p,u;const t=(p=e==null?void 0:e.type)==null?void 0:p.key,s=(u=e==null?void 0:e.subType)==null?void 0:u.key;return k.filter(a=>t?a.type.toLowerCase()===t.toLowerCase():!0).filter(a=>s?a.subType.toLowerCase()===s.toLowerCase():!0).filter(a=>a.value.toLowerCase().includes(o.toLowerCase()))},f=(o,e)=>new Promise(t=>{setTimeout(()=>{t(C(o,e))},1e3)}),h={title:"applejelly/autocomplete/AsyncAutocomplete",component:l,args:{data:g,overflowerType:"gradient",size:"md",onChange:n(),onClickClear:n(),onPanelOpen:n(),minSearchLength:1},argTypes:{hasCaretDownIcon:{type:"boolean"},validationMessage:{type:"string"},creatable:{type:"boolean"},placeholder:{type:"string"},minSearchLength:{type:"number"}},parameters:{layout:"centered"},tags:["autodocs"]},r={decorators:[o=>{const[e,t]=d.useState(g);return m.jsx(l,{categoryProps:e,queryFunction:f,displayProperties:{kind:"type",id:"value"}})}]};var y,c,i;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  decorators: [Story => {
    const [category, setCategory] = React.useState<CategoryProps[]>(categoryProps);

    //   React.useEffect(() => {
    //     const timer = setTimeout(() => {
    //       setCategory(newCategoryProps);
    //     }, 5000);
    //     return () => clearTimeout(timer);
    //   }, []);

    return <AsyncAutocomplete categoryProps={category} queryFunction={queryFn} displayProperties={{
      kind: "type",
      id: "value"
    }} />;
  }]
}`,...(i=(c=r.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};const L=["Basic"];export{r as Basic,L as __namedExportsOrder,h as default};
