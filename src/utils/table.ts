import * as R from 'ramda'
import classNames from 'classnames'

type Obj = {[key: string]: any}
interface Column {
  id: any
  columnDef: {
    accessorKey: any
    header: any
    meta: Obj
    size: number | string
    minSize: number | string
  }
}

export function isCssValidUnit(value: any) {
  if (typeof value == "string" && value !== "0px") {
    return Boolean(value.match(/^(?:\d*\.)?\d+(px|em|rem|ch)$/))
  }
  return false
}

export function getMinMax(min: string, max: string) {
  if (max && max.indexOf("minmax") !== -1 ) return max;
  if (min.indexOf("minmax") !== -1) return min;

  const minValue = isCssValidUnit(min) ? `calc(${min} + 2 * var(--table-cell-padding-x))` : min
  const maxValue = max ? isCssValidUnit(max) ? `calc(${max} + 2 * var(--table-cell-padding-x))` : max : "auto";
  return `minmax(${minValue}, ${maxValue})`
}

export function sanitizeString(input: any) {
  return `_${String(input).replace(/[^\w\d-]/g, "_")}`;
}


export function getColumnId(column: Column) {
  if (column.id) {
    return String(column.id);
  } else if (typeof column.columnDef.accessorKey === 'string') {
    return column.columnDef.accessorKey;
  } else if (typeof column.columnDef.header === 'string') {
    return column.columnDef.header;
  }
  return '';
}

export function getColumnMeta(column: Column) {
  if (column?.columnDef?.meta) {
    return column.columnDef.meta
  }
  return {};
}

export function getColumnDef(column: Column) {
  if (column?.columnDef) {
    return column.columnDef
  }
  return {};
}


export function arrayToObject(
  array: any[],
  functor: (arg0: any) => any
) {
  return array.reduce((acc: { [x: string]: any; }, item: any) => {
    const key = functor(item);
    acc[key] = item;
    return acc;
  }, {});
}

export function flattenColumns(columns: any[]): Obj[] {
  return columns.reduce((flattened: any[], column: { columns: any; }) => {
    const _column = {...column}

    if ("columns" in column) {
      const omittedColumn = R.omit(['columns'], column)
      flattened.push(omittedColumn)
      return flattened.concat(flattenColumns(column.columns));
    }

    flattened.push(column);
    return flattened;
  }, []);
}

const swap = (arr: any[], index1: number, index2: number) => {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]]
  return arr
}
export function swapElementsInArray(
  array: any[],
  elem1: any,
  elem2: any,
  positionAfterElem2 = false
) {
  const elem1Idx = array.indexOf(elem1)
  const elem2Idx = array.indexOf(elem2)

  if (elem2Idx === -1 || elem1Idx === -1) return array
  if ((elem1Idx > elem2Idx) && positionAfterElem2) {
    array.splice(elem1Idx, 1)
    array.push(elem1)
    return array
  }

  return swap(array, elem1Idx, elem2Idx)
}


export function createCssVarStickyColumnId(columnId: any) {
  if (columnId) {
    return `var(--table-sticky-column-id-${sanitizeString(columnId)})`;
  }
  return undefined;
}

export function combineWithCondition(
  value: Obj,
  modifier: (val?: any) => any
) {
  const result = typeof modifier === 'function' ? modifier(value) : modifier;
  if (typeof value !== 'boolean' && value !== undefined) {
    return {
      ...result,
      ...(typeof value === 'object' ? value : {})
    };
  }
  return result;
}


export function createTableCellProperties(
  colSpan: number,
  rowSpan?: number
): Obj {
  const cellProperties = {
    style: {}
  } as Obj

  if (colSpan !== 1) {
    cellProperties.colSpan = colSpan;
    cellProperties.style["--colspan"] = colSpan;
  }

  if (rowSpan !== 1) {
    cellProperties.rowSpan = rowSpan;
    cellProperties.style["--rowspan"] = rowSpan;
  }

  return cellProperties;
}


export function callbackOrDefault(
  callback: (value?: any) => any | string | number,
  args: any[],
  defaultValue: any
) {
  if (callback !== undefined) {
    if (typeof callback === 'function') {
      return callback(...args)
    }
    return callback;
  }
  return defaultValue;
}

export const createStyleProp = (index: number, hasStyle: boolean): any => (props: Obj): Obj => ({
  ...props,
  key: String(index),
  ...(hasStyle ? { style: { '--rowindex': index, ...props.style } } : {})
});


// columnKeys가 undefined될 경우에 모든 컬럼이 디폴트 값으로 됨
export function getWidthsAndMinWidths(
  columns: any,
  columnKeys: string[] | undefined,
  defaultMinWidth:number | string = 0
) {
  const widths: {[key: string]: string | number} = {};
  const minWidths: {[key: string]: string | number} = {};

  columns.forEach((column: Column) => {
    const key = getColumnId(column); // Assuming y is a function defined elsewhere

    if (!(columnKeys && columnKeys.includes(key))) {
      widths[key] = column.columnDef.size || "auto";
      minWidths[key] = column.columnDef.minSize || defaultMinWidth;
    }
  });

  return [widths, minWidths];
};


export function isValidWidthCssValue(value: number | string): boolean {
  if (value === undefined || value === null) return false
  return typeof value === "number" || (value?.match(/^(calc\()?\d+px\)?$/) !== null);
};

export function processColumnsWidths(
  keys: string[],
  widths: { [key: string]: string | number },
  minWidths: { [key: string]: number | undefined },
  excludedKeys: string[]
): string {

  const formatStyleValue = (value: string | number): string => {
    if (typeof value === "number") {
      return `${value}fr`;
    }
    return value.replace(/^(calc\()?(\d+)px(\))?$/, "$1$2fr$3");
  };

  const convertToMinmax = (
    minValue: number | string = 0,
    value: string | number
  ): string => {
    if (["min-content", "auto"].includes(value as string) || String(value).startsWith("fit-content")) {
      return value as string;
    }
    const formattedMinValue = typeof minValue === "number" ? `${Math.max(0, minValue)}px` : minValue;
    const formattedValue = typeof value === "number" ? `${Math.max(0, value)}px` : value;

    return getMinMax(formattedMinValue, formattedValue);
  };

  const isValid = keys
    .filter((key: string) => !excludedKeys.includes(key))
    .every((key: string) => isValidWidthCssValue(widths[key]));

  return keys
    .map((key: string) => {
      const width = isValid && !excludedKeys.includes(key)
        ? formatStyleValue(widths[key]) : widths[key];

      const minmax = convertToMinmax(minWidths[key], width);
      return minmax
    })
    .join(" ")
    .replace(/calc\((\d+\w*)\)/g, "$1");
};

export function isInvalidColumnWidth(value: string | number): boolean {
  return !value ||
    (typeof value !== "number") &&
    (value !== "min-content") &&
    !value.startsWith("fit-content") &&
    !isValidWidthCssValue(value);
};



export function determineAction({
  leftIsAuto,
  rightIsAuto,
  leftIsFloating,
  rightIsFloating
}) {
  if (leftIsAuto && rightIsAuto) {
    return leftIsFloating && rightIsFloating ? "redistribute" : leftIsFloating ? "modify-right" : "modify-left";
  } else if (leftIsAuto || rightIsAuto) {
    return (leftIsAuto || leftIsFloating) && (rightIsAuto || rightIsFloating) ? "redistribute" : (leftIsAuto || leftIsFloating) ? "modify-right" : "modify-left";
  } else {
    return "redistribute";
  }
};

export function processColumnResizing(context) {
  const {
    keyColumns,
    allColumns,
    allColumnsById,
    resizeStateRef,
    resizableColumns,
    props: {
      isScrollable
    }
  } = context

  const { columnWidthsState, initialValue } = resizeStateRef.current;
  const columnWidths = columnWidthsState || initialValue;
  const resizeBehavior = resizableColumns.resizeBehavior;

  const resizableKeys = keyColumns.filter(key => {
    const column = allColumnsById[key];
    return column && column.columnDef.enableResizing && column.getCanResize();
  });


  if (resizableKeys.length < 2) return {};

  const getFloatingKeys = (keys, widths) => {
    const results = [];
    const countMatchingElements = Object.keys(widths).reduce((count, width) => {
      return (keys.includes(width) && isInvalidColumnWidth(widths[width])) ? count + 1 : count;
    }, 0);

    if (countMatchingElements > 1) {
      let matchingCount = 0;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const isMatching = isInvalidColumnWidth(widths[key]);

        if (matchingCount && countMatchingElements - matchingCount - (isMatching ? 1 : 0)) {
          results.push(key);
        }

        if (isMatching) matchingCount++;
      }
    }

    return results;
  };

  const floatingKeys = getFloatingKeys(keyColumns, columnWidths);
  let result = {};
  let hasLeftAuto = false;

  for (let i = 0; i < resizableKeys.length - 1; i++) {
    const leftKey = resizableKeys[i];
    const rightKey = resizableKeys[i + 1];
    const leftWidth = columnWidths[leftKey];
    const rightWidth = columnWidths[rightKey];
    const isLeftAuto = isInvalidColumnWidth(leftWidth);
    const isRightAuto = isInvalidColumnWidth(rightWidth);

    if (isLeftAuto) hasLeftAuto = true;

    const isLeftFloating = floatingKeys.includes(leftKey);
    const isRightFloating = floatingKeys.includes(rightKey);

    const action = resizeBehavior === "auto" || (resizeBehavior !== "modify-left" && !isScrollable)
      ? determineAction({ leftIsAuto: isLeftAuto, rightIsAuto: isRightAuto, leftIsFloating: isLeftFloating, rightIsFloating: isRightFloating, hasLeftAuto })
      : "modify-left";

    if (action === "modify-left" || action === "redistribute") {
      const nextKey = keyColumns[keyColumns.indexOf(leftKey) + 1];
      result[nextKey] = { ...result[nextKey], left: leftKey };
    }

    if (action === "modify-right" || action === "redistribute") {
      result[rightKey] = { ...result[rightKey], right: rightKey };
    }
  }

  return result;
};

export function getDiffValue(original, updated) {
  return Object.keys(updated).reduce((differences, key) => {
    if (updated[key] !== original[key]) {
      differences[key] = updated[key];
    }
    return differences;
  }, {});
};

const sizes = {
  xxs: 14,
  xs: 22,
  sm: 24,
  md: 33,
  lg: 43,
  xl: 55,
  xxl: 79
};

export function getSizeNumber(size: keyof typeof sizes) {
  if (typeof size === 'number') {
    return size;
  }
  if (typeof size === 'string' && size !== '1fr') {
    return sizes[size] || sizes.md;
  }
  return sizes.md;
};

export function sortAndJoin(elements) {
  return elements ? [...elements].sort().join(", ") : "";
};

export function processColumnsProperties(config, values) {
  const { isScrollable, allColumns, keyColumns } = config;
  if (!isScrollable) return {};

  let stickyColumnOffsets = {};
  let accumulatedWidths = [];

  const getAccWidths = (accWidths, pCounter) => {
    if (accWidths.length === 0) return 0

    const counter = accWidths.reduce((acc, width) => {
      if(R.test(/calc/ig, width)) {
        acc = acc - 1
      }
      return acc
    }, pCounter)


    return `calc(${2 * counter} * var(--table-cell-padding-x) + ${accWidths.join(" + ")})`.replace(/calc\((\d+\w*)\)/g, "$1")

  }

  for (let keyColumn of keyColumns) {
    const columnIndex = allColumns.findIndex(column => keyColumn === getColumnId(column));
    const column = allColumns[columnIndex];

    if (!column || !column.columnDef.meta.isSticky) continue;

    const columnWidth = values[keyColumn];
    let paddingCount = 0;

    accumulatedWidths.forEach(width => {
      if (typeof width === 'number' || isValidWidthCssValue(width)) {
        paddingCount += 1;
      }
    });

    const stickyColumnIdKey = `--table-sticky-column-id-${sanitizeString(keyColumn)}` as const
    stickyColumnOffsets[stickyColumnIdKey] = getAccWidths(accumulatedWidths, paddingCount)

    if (isInvalidColumnWidth(columnWidth)) continue;

    const formattedWidth = typeof columnWidth === 'number' ? `${columnWidth}px` : columnWidth;
    accumulatedWidths.push(formattedWidth);
  }

  return stickyColumnOffsets;
};

export function applyColumnStyles(context, values, stylesTarget) {
  if (context && values) {
    const { keyColumns, columnsMinWidths, resizeStateRef, state } = context;
    const nonResizableColumns = resizeStateRef.current.nonResizableColumns;

    const columnStyles = {
      ...{ "--columns-widths": processColumnsWidths(keyColumns, values, columnsMinWidths, nonResizableColumns) },
      ...processColumnsProperties(context, values)
    };

    if (!stylesTarget) return columnStyles;

    Object.keys(columnStyles).forEach(key => {
      stylesTarget.setProperty(key, columnStyles[key]);
    });
  }
};

export function countNonFullWidthRows(rows = []) {
  return rows.reduce((count, row) => {
    const isFullWidthRow = row.cells.every(cell => cell.column.isFullWidth);
    return isFullWidthRow ? count : count + 1;
  }, 0);
};

export function getFirstTruthyValue(first, second, third) {
  return first || second || (third && third !== "inherit" ? third : undefined);
};
