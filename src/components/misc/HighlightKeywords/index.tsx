/** * *
HighlightKeywords
* */ import React from 'react'
import cn from 'classnames'
import './highlight-keywords.scss'
import Highlighter from 'react-highlight-words'

const BLOCK = 'AJ-misc_highlight-keywords'

const parseStringToArray = (str: string) => {
    if (typeof str !== 'string') return []

    return (str.match(/"(?:\\"|[^"])+"|[^\s]+/gi) || []).map((element) =>
        element
            .replace(/(\\\\)/g, '\\')
            .replace(/(\\")/g, '"')
            .replace(/^"(.*)"$/g, '$1')
    )
}

function HighlightKeywords({
    searchWords = '',
    textToHighlight,
    className,
    highlightClassName,
    isCaseSensitive,
    ...rest
}: Props) {
    const parsedSearchWords = parseStringToArray(searchWords)

    return (
        <span className={cn(BLOCK, className)}>
            <Highlighter
                highlightClassName={cn(
                    BLOCK + '__highlighted',
                    highlightClassName
                )}
                textToHighlight={textToHighlight}
                autoEscape={true}
                searchWords={parsedSearchWords}
                caseSensitive={isCaseSensitive}
                {...rest}
            />
        </span>
    )
}

interface Props {
    textToHighlight: string
    className?: string
    highlightClassName?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    highlightTag?: React.ComponentType<any>
    isCaseSensitive?: boolean
    searchWords?: string
}
export default HighlightKeywords
export type { Props as HighlightKeywordsProps }
