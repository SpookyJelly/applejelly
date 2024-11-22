import React, { useRef } from 'react'
// import styled from "@emotion/styled";
// import tw from "twin.macro";
import cn from 'classnames'
import Icon from '../../common/Icon'
import Button from '../../form/Button'
import { Item } from './data'
import { UseMultipleSelectionReturnValue } from 'downshift'
import Tooltip from '../../dialogs/Tooltip'
// import Overflower from "../../../components/layout/Overflower";
// import OverflowList from "../../../components/layout/OverflowList";
import { ZINDEX } from './constant'
import './commons.scss'

// interface ChipProps extends React.HTMLAttributes<HTMLElement> {
//   removeHandler: React.MouseEventHandler;
//   content: string;
//   kind: "dark" | "light";
// }

// const TOOLTIP_INNER_COLOR = "rgba(255,255,255,0.68)";

// export const Menu = styled.ul`
//   ${tw`overflow-x-hidden overflow-y-hidden border-solid border-[--ui-interaction-primary] border bg-[--gray-25] flex `}

//   border-bottom-right-radius: 2px;
//   border-bottom-left-radius: 2px;
//   border-top: none;

//   & > div:last-of-type::-webkit-scrollbar {
//     border-right: none !important;
//   }
// `;
// // max height 추가
// export const Panel = styled.div<{
//   activated?: boolean;
//   size?: "sm" | "md" | "lg";
// }>`
//   ${tw`flex flex-col grow`}
//   ${({ activated = true }) =>
//     activated
//       ? tw`bg-white overflow-y-scroll`
//       : tw`bg-transparent overflow-y-hidden`}

//   &::-webkit-scrollbar {
//     background-color: #f9f9f9;
//     border-left: 1px solid #c2c8dd;
//     border-right: 1px solid #c2c8dd;
//   }
//   &::-webkit-scrollbar-thumb {
//     background-clip: content-box;
//     border: 2px solid transparent;
//   }

//   ${({ size = "sm" }) => {
//     switch (size) {
//       case "sm":
//         return tw`[font-size: var(--font-size-sm)] [line-height: var(--line-height-default-sm)]`;
//       default:
//       case "md":
//         return tw`[font-size: var(--font-size-md)] [line-height: var(--line-height-default-md)]`;
//       case "lg":
//         return tw`[font-size: var(--font-size-lg)] [line-height: var(--line-height-default-lg)]`;
//     }
//   }}
// `;

// const Tag = styled.div<{ kind?: "dark" | "light" }>`
//   ${tw`pl-2 [border-radius: 2px] whitespace-nowrap [line-height: 1.5]`}
//   ${({ kind = "light" }) => {
//     if (kind === "light")
//       return tw`bg-[rgba(28,43,52,0.10)] text-[--ui-text-secondary]`;
//     return tw`bg-[rgba(86,88,95,1)] text-[rgba(255,255,255,0.68)]`;
//   }};

//   & span.cancel-icon {
//     padding-right: 4px;
//     cursor: pointer;
//     margin-left: 4px;
//     padding-left: 4px;
//     border-top-right-radius: 3px;
//     border-bottom-right-radius: 3px;
//   }
//   &[kind="light"] {
//     & span.cancel-icon {
//       &:hover {
//         color: white;
//         background-color: rgb(84, 97, 104);
//       }
//     }
//   }

//   &[kind="dark"] {
//     & span.cancel-icon {
//       &:hover {
//         color: white;
//         background-color: black;
//       }
//     }
//   }
// `;

// export const Chip = React.forwardRef<ChipProps, React.Ref<HTMLElement>>(
//   ({ removeHandler, content, kind, ...props }, ref: any) => {
//     return (
//       <Tag
//         kind={kind}
//         ref={ref}
//         {...props}
//         style={{ display: "flex", marginRight: 3 }}
//       >
//         <span
//           style={{
//             maxWidth: "100px",
//             textOverflow: "ellipsis",
//             overflow: "hidden",
//           }}
//         >
//           {content}
//         </span>
//         <span className="cancel-icon" onClick={removeHandler}>
//           &#10005;
//         </span>
//       </Tag>
//     );
//   },
// );

// const ItemContent = styled.li<{
//   isHighlighted: boolean;
//   isIncluded?: boolean;
//   isActivated: boolean;
// }>`
//   ${tw`flex items-center px-2 py-1 cursor-pointer `};
//   height: 30px;

//   ${({ isHighlighted, isActivated }) => {
//     if (isHighlighted && isActivated) {
//       return tw`bg-[--ui-interaction-primary] text-white`;
//     } else if (isHighlighted && !isActivated) {
//       return tw`bg-gray-200 text-gray-500`;
//     }
//     return tw`text-black`;
//   }};
//   & [data-description] {
//     ${({ isHighlighted }) =>
//       isHighlighted ? tw`text-white` : tw`text-[--gray-125]`}
//   }

//   /* & :first-child {
//     flex-grow: 1000;
//   } */
//   & span:first-of-type {
//     flex-grow: 1000;
//   }
// `;

// const Guide = styled.div`
//   ${tw`bg-[rgba(248, 249, 250, 1) ] [padding: 7px 10px 9px 10px] [border: solid 1px var(--ui-interaction-primary)]`}
//   border-top:unset;
//   & kbd {
//     ${tw`[border-radius: 4px] mx-0.5`}
//     border: 1px solid #c2c8dd;
//     &[data-kind="icon"] {
//       /* padding: 1px; */
//       padding: 0px 2px;
//     }
//     &[data-kind="text"] {
//       padding: 1px 5px;
//     }
//   }
// `;

// render functions
export const renderGuide = ({
    content,
    style,
}: {
    content?: React.ReactNode
    style?: React.CSSProperties
} = {}) => {
    const defaultContent = (
        <span>
            <span>
                Use
                <kbd data-kind="icon">
                    <Icon name="arrowUp" size="xxs" />
                </kbd>
                <kbd data-kind="icon">
                    <Icon name="arrowDown" size="xxs" />
                </kbd>
                to navigate <kbd data-kind="text">Enter</kbd> to update query
            </span>
        </span>
    )
    const displayContent = content ?? defaultContent
    return (
        <div className="__guide" style={style}>
            {displayContent}
        </div>
    )
}

export const renderClearButton = (
    props?: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
    return (
        <Button
            className="autocomplete-clear-button --override-gray"
            icon="cancelCircled"
            isDangerouslyNaked
            size="md"
            {...props}
        />
    )
}

// //NOTE: removed ToggleButton actions on Chips
// export const renderSelectedItems = (
//   isSingle: boolean,
//   selectedItems: Item[],
//   multipleSelection: UseMultipleSelectionReturnValue<Item>,
//   overflowerType: "ellipsis" | "gradient",
// ) => {
//   if (isSingle) {
//     return selectedItems.map((item, index) => (
//       <Tooltip
//         isEnabled
//         style={{ overflow: "hidden" }}
//         content={item.value}
//         key={index}
//       >
//         <div>
//           <p style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
//             {item.value}
//           </p>
//         </div>
//       </Tooltip>
//     ));
//   }

//   let child = selectedItems.map((selectedItem, index) => (
//     <Chip
//       className="selected-item-tooltip"
//       key={`selected-item-${index}`}
//       kind="light"
//       removeHandler={(e) => {
//         e.stopPropagation();
//         multipleSelection.removeSelectedItem(selectedItem);
//       }}
//       content={selectedItem.value}
//       {...multipleSelection.getSelectedItemProps({
//         selectedItem,
//         index,
//         tabIndex: undefined,
//       })}
//     />
//   ));

//   // Get the width of the first element in "child"
//   if (overflowerType === "ellipsis") {
//     return (
//       <Tooltip
//         style={{ flex: selectedItems.length > 1 ? "10" : "0" }}
//         maxWidth={"auto"}
//         isEnabled={selectedItems.length > 0}
//         content={
//           <div style={{ display: "flex", gap: "3px", width: "100%" }}>
//             {selectedItems.map((selectedItem, index) => (
//               <Chip
//                 className="selected-item-tooltip"
//                 key={`selected-item-${index}`}
//                 kind="dark"
//                 removeHandler={(e) => {
//                   e.stopPropagation();
//                   multipleSelection.removeSelectedItem(selectedItem);
//                 }}
//                 content={selectedItem.value}
//                 {...multipleSelection.getSelectedItemProps({
//                   selectedItem,
//                   index,
//                   tabIndex: undefined,
//                 })}
//               />
//             ))}
//           </div>
//         }
//       >
//         <OverflowList
//           initialShowCount={2}
//           style={{
//             // maxWidth: 2 * 140 + "px",
//             // maxWidth: 2 * 170 + "px",
//             width: "auto",
//             flex: selectedItems.length > 1 ? "10" : "0",
//           }}
//           alignItems="center"
//         >
//           {child}
//         </OverflowList>
//       </Tooltip>
//     );
//   }
//   if (overflowerType === "gradient") {
//     return (
//       <Overflower
//         tooltipContent={selectedItems.map((selectedItems, index) => (
//           <Chip
//             className="selected-item-tooltip"
//             key={`selected-item-${index}`}
//             kind="dark"
//             removeHandler={(e) => {
//               e.stopPropagation();
//               multipleSelection.removeSelectedItem(selectedItems);
//             }}
//             content={selectedItems.value}
//             {...multipleSelection.getSelectedItemProps({
//               selectedItem: selectedItems,
//               index,
//               tabIndex: undefined,
//             })}
//           />
//         ))}
//         type="gradient"
//         tooltipProps={{
//           placement: "top",
//           maxWidth: "auto",
//         }}
//         style={{
//           flex: selectedItems.length > 0 ? 8 : 0,
//           lineHeight: "normal",
//         }}
//       >
//         {selectedItems.map((selectedItem, index) => (
//           <Chip
//             className="selected-item-tooltip"
//             key={`selected-item-${index}`}
//             kind="light"
//             removeHandler={(e) => {
//               e.stopPropagation();
//               multipleSelection.removeSelectedItem(selectedItem);
//             }}
//             content={selectedItem.value}
//             {...multipleSelection.getSelectedItemProps({
//               selectedItem,
//               index,
//               tabIndex: undefined,
//             })}
//           />
//         ))}
//       </Overflower>
//     );
//   }
// };

interface DropdownProps extends React.HTMLAttributes<HTMLLIElement> {
    isHighlighted: boolean
    isIncluded?: boolean
    hasCheckIcon?: boolean
    hasDetail?: boolean // 상세 정보가 있는지 여부
    isActivated: boolean
}
export const DropdownItem = ({
    isHighlighted,
    isIncluded,
    isActivated,
    hasCheckIcon,
    hasDetail,
    ...rest
}: DropdownProps) => {
    const ROOT = '--dropdown-item'
    return (
        <div
            className={cn(ROOT, {
                '--is-highlighted': isHighlighted,
                '--is-activated': isActivated,
                '--is-included': isIncluded,
            })}
            onMouseOver={rest.onMouseOver}
            onClick={rest.onClick}
        >
            {rest.children}
            <div>
                {hasCheckIcon && (
                    <span className="iconWrapper">
                        <Icon
                            name="check"
                            size="sm"
                            color={
                                isIncluded ? 'black' : 'rgba(28, 43, 52, 0.1)'
                            }
                        />
                    </span>
                )}
                {hasDetail && (
                    <>
                        <Icon
                            color={
                                isHighlighted && isActivated ? 'white' : 'black'
                            }
                            name="angleRight"
                            hasInlineCentering
                            size="sm"
                        />
                    </>
                )}
            </div>
        </div>
    )
}
// export const DropdownItem = React.forwardRef(
//   (props: DropdownProps, ref: React.Ref<HTMLLIElement>) => {
//     return (
//       <ItemContent {...props} ref={ref}>
//         {props.children}
//         <div>
//           {props.hasCheckIcon && (
//             <span className="iconWrapper">
//               <Icon
//                 name="check"
//                 size="sm"
//                 color={props.isIncluded ? "black" : "rgba(28, 43, 52, 0.1)"}
//               />
//             </span>
//           )}
//           {props.hasDetail && (
//             <>
//               <Icon
//                 name="angleRight"
//                 hasInlineCentering
//                 size="sm"
//                 color={
//                   props.isHighlighted && props.isActivated ? "white" : "black"
//                 }
//               />
//             </>
//           )}
//         </div>
//       </ItemContent>
//     );
//   },
// );
export const AutoCompleteTooltip = ({
    validationMessage,
    items,
    isEnabled = true,
    ...rest
}: AutoCompleteTooltipProps) => {
    const content = validationMessage ? validationMessage : items
    return (
        <Tooltip
            className="autocomplete-tooltip"
            style={{ width: '100%', maxWidth: 'auto' }}
            contents={<div className="--content-wrapper">{content}</div>}
            isOpen={true}
            isEnabled={isEnabled}
        >
            <div style={{ position: 'relative', zIndex: 1000 }}>
                {validationMessage && (
                    <div className="--icon-wrapper">
                        <Icon name="attentionCircled" size="sm" color="red" />
                    </div>
                )}
            </div>
            {rest.children}
        </Tooltip>
    )
}

interface AutoCompleteTooltipProps extends React.HTMLAttributes<HTMLElement> {
    validationMessage?: string
    items: React.ReactNode[]
    isEnabled?: boolean
}

// export const AutoCompleteTooltip = React.forwardRef(
//   (
//     {
//       validationMessage,
//       items,
//       isEnabled = true,
//       ...rest
//     }: AutoCompleteTooltipProps,
//     ref: React.Ref<HTMLElement>,
//   ) => {
//     const content = Boolean(validationMessage) ? validationMessage : items;

//     const ContentWrapper = styled.div`
//       ${tw`flex [gap: 3px] text-[rgba(255,255,255,0.68)]`}
//     `;
//     const IconWrapper = styled.div`
//       ${tw`z-10 top-[-10px] absolute right-[-5px] bg-white [height: 13px] [width: 16px] [border-radius: 50px]`}
//     `;

//     return (
//       <Tooltip
//         style={{ width: "100%", maxWidth: "auto" }}
//         maxWidth="auto"
//         content={<ContentWrapper>{content}</ContentWrapper>}
//         // isOpen={Boolean(validationMessage)}
//         isOpen={true}
//         isEnabled={isEnabled}
//         ref={ref}
//       >
//         <div style={{ position: "relative", zIndex: ZINDEX.LV3 }}>
//           {validationMessage && (
//             <IconWrapper>
//               <Icon name="attentionCircled" size="sm" color="red" />
//             </IconWrapper>
//           )}
//         </div>
//         {rest.children}
//       </Tooltip>
//     );
//   },
// );

// export const InputWrapper = styled.div<{
//   isOpen: boolean;
//   isMultiline: boolean;
//   validationMessage?: string;
//   isReadOnly?: boolean;
// }>`
//   ${tw`border-solid [border-width: 1px] border-[#c2c8dd] [border-radius: 2px] flex p-0.5 relative grow `}
//   border-bottom-left-radius: ${({ isOpen }) => (isOpen ? 0 : 2)}px;
//   border-bottom-right-radius: ${({ isOpen }) => (isOpen ? 0 : 2)}px;
//   background-color: white;
//   &:hover {
//     border: 1px solid rgba(28, 43, 52, 0.98);
//   }
//   &.--readonly {
//     background: var(--gray-50);
//     &:hover {
//       border: 1px solid #c2c8dd;
//     }
//     & * {
//       cursor: not-allowed;
//     }
//   }

//   &.--focus,
//   .--focus {
//     border-color: var(--ui-interaction-primary);
//     background: var(--blue-200);
//   }

//   & textarea.--focus {
//     background: var(--blue-200);
//     width: 50;
//     padding: 0;
//     padding-top: 3;
//   }

//   &:not(.--focus) {
//     ${({ validationMessage }) =>
//       validationMessage &&
//       tw`border-[--ui-status-danger] border-solid hover:border-[--ui-status-danger-contrast]`}
//   }

//   & .autocomplete-clear-button {
//     ${tw`absolute right-0 transform [margin-right: 4px] p-0`}
//     & svg {
//       width: 16px;
//       height: 16px;
//     }
//   }

//   & .layout_overflower__overflow-inner {
//     display: flex;
//   }

//   & > .layout-container {
//     ${tw`flex overflow-hidden [width: 100%]  pl-1.5 whitespace-nowrap`}
//     flex-wrap: wrap;
//     align-items: center;
//     & input {
//       min-width: 1px;
//       flex: 2;
//     }

//     & .layout_overflow-list__handle {
//       position: absolute !important;
//       // margin: 0px;
//       right: 0;
//       /* top: 2px; */
//       & span {
//         right: 0px;
//         // top: -5px;
//         position: absolute;
//         /* position: relative; */
//       }
//       display: flex;
//       height: 24px;
//       align-items: center;
//     }

//     height: 23px; // NOTE:
//     // height: ${({ isMultiline }) => (isMultiline ? "auto" : "23px")};
//     & > input,
//     textarea {
//       height: 23px;
//       ${tw` border-none outline-transparent outline-0 `}
//       resize: none;
//     }
//     & button {
//       border: none;
//       :hover {
//         color: black;
//       }
//     }

//     & .inner-shadow {
//       ${tw`absolute [background: linear-gradient(to right, transparent, white)] z-0 top-0 right-0 [width: 50px] h-full`}
//     }
//   }
// `;

// export const LayoutContainer = styled.div<{
//   isSingle: boolean;
//   overflowerType: "ellipsis" | "gradient";
// }>`
//   // ${tw`flex overflow-hidden [width: 100%] [gap: 3px] pl-1.5 pr-4 whitespace-nowrap`}
//   ${tw`flex overflow-hidden [width: 100%] pl-1.5 whitespace-nowrap`}
//   // flex-wrap: wrap;

//   ${({ isSingle, overflowerType }) => {
//     if (isSingle || overflowerType === "gradient") {
//       return tw`flex-nowrap`;
//     }
//     return tw`flex-wrap`;
//   }}

//   align-items: center;
//   & input {
//     min-width: 1px;
//     flex: 2;
//   }

//   & input::placeholder {
//     color: var(--gray-125);
//   }

//   & .layout_overflow-list__handle {
//     position: absolute !important;
//     right: 0;
//     & span {
//       right: 0px;
//       position: absolute;
//     }
//     display: flex;
//     height: 24px;
//     align-items: center;
//   }

//   height: 23px; // NOTE:
//   & > input,
//   textarea {
//     height: 23px;
//     ${tw`border-none outline-transparent outline-0 `}
//     resize: none;
//   }
//   & button {
//     border: none;
//     :hover {
//       color: var(--gray-400);
//     }
//   }
// `;
