import React, { useRef } from 'react'
import cn from 'classnames'
import Icon from '../../common/Icon'
import Button from '../../form/Button'
import Tooltip from '../../dialogs/Tooltip'
import './commons.scss'

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

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
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
                            fill={
                                isIncluded ? 'rgba(28, 43, 52, 0.1)' : 'white'
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
