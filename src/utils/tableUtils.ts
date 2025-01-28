// export const isCssValidUnit = (value: any) => {
//   if (typeof value == "string" && value !== "0px") {
//     return Boolean(value.match(/^(?:\d*\.)?\d+(px|em|rem|ch)$/))
//   }
//   return false
// }
// export const getMinMax = (min: any, max: any) => {
//   if (max && max.indexOf("minmax") !== -1 ) return max;
//   if (min.indexOf("minmax") !== -1) return min;

//   const minValue = isCssValidUnit(min) ? `calc(${min} + 2 * var(--table-cell-padding-x))` : min
//   const maxValue = max ? isCssValidUnit(max) ? `calc(${max} + 2 * var(--table-cell-padding-x))` : max : "auto";
//   return `minmax(${minValue}, ${maxValue})`
// }
