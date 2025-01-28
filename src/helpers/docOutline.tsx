import React from 'react'
import styled from '@emotion/styled'
import { Global } from "@emotion/react";
import { globalStyle } from "@daimre/styles";
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Stories,
  Controls
} from '@storybook/addon-docs'
import Flex from '../components/layout/Flex'
import FlexItem from '../components/layout/FlexItem'
import Icon from '../components/common/Icon'
import { isFullEmpty, isNotFullEmpty } from '@daimre/shared'
import tw from 'twin.macro'
import { WRAPPER_MINWIDTH } from '../components/time/DateRangePicker/constants';

const projectPath = process.env.PROJECT_CWD
const githubBaseUrl = 'https://github.com/daimresearch/xms-fe/blob/main'

const Wrapper = styled.div`
  .title-wrapper {
    .title-area {
      .subtitle {
        color: rgba(0, 0, 0, 0.3);
      }
    }

    ul {
      list-style: none;
      padding: 0;
    }

    .list-wrapper {
      ${tw`flex justify-end`}
    }

    ul.list {
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      padding-left: 15px;

      li {
        text-align: left;
        margin: 0;
        padding: 0;
        font-size: 13px;
        display: flex;
        align-items: center;

        .icon {
          position: relative;
          top: -2px;
        }

        &.buttons {
          margin-bottom: 10px;

          a {
            color: gray;
            padding-inline: 6px;
            padding-block: 2px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            font-size: 10px;
            margin-right: 5px;

            &:hover {
              border-color: rgba(0, 0, 0, 0.3);
              color: rgba(0, 0, 0, 0.8);
            }
          }
        }

        &.unchecked {
          opacity: 0.5;
        }

      }
    }
  }
`

function DocRender({
  group,
  codePath,
  figma,
  hasSizes,
  hasLevels,
  hasMargins,
}: DocRenderProps) {

  React.useEffect(() => {
    setTimeout(() => {
      const marginGroup = document.querySelector('[title="Hide margin items"] button')
      const paddingGroup = document.querySelector('[title="Hide padding items"] button')
      const lockupsGroup = document.querySelector('[title="Hide lockups items"] button')
      const extraDomGroup = document.querySelector('[title="Hide extraDom items"] button')
      const customColorGroup = document.querySelector('[title="Hide customColor items"] button')
      const textGroup = document.querySelector('[title="Hide text items"] button')
      document.querySelectorAll('.rejt-tree').forEach((item) => {
        if (item.querySelector('.rejt-not-collapsed')) {
          item.querySelector('.rejt-name').click()
        }
      })

      if (marginGroup) {
        marginGroup.click()
      }
      if (paddingGroup) {
        paddingGroup.click()
      }
      if (lockupsGroup) {
        lockupsGroup.click()
      }
      if (extraDomGroup) {
        extraDomGroup.click()
      }
      if (customColorGroup) {
        customColorGroup.click()
      }
      if (textGroup) {
        textGroup.click()
      }
    }, 1)
  }, [])


  const renderButtons = () => {
    if (isFullEmpty(figma) && isFullEmpty(codePath)) return []

    return (
      <li className='buttons'>
        {isNotFullEmpty(codePath) && <a href={`${githubBaseUrl}/${codePath}`} target='_blank'>github</a>}
        {isNotFullEmpty(codePath) && <a href={`vscode://file${projectPath}/${codePath}`} target='_blank'>vscode</a>}
        {isNotFullEmpty(figma) && <a href={figma} target='_blank'>figma</a>}
      </li>
    )
  }

  const renderCheckItem = (title = '', isChecked = false) => {
    const classes = isChecked ? 'checked': 'unchecked'
    return (
      <li className={classes}>
        <Icon
          name={isChecked ? 'check': 'cancel'}
          size='sm'
          color={isChecked ? 'green': 'red'}
          marginRight='xs'
        />
        {`${isChecked ? 'Has': "Doesn't has"} ${title}`}
      </li>
    )
  }

  return (
    <>
      <Wrapper>
        <div className="title-wrapper">
          <Flex>
            <FlexItem grow>
              <div className="title-area">
                {isNotFullEmpty(group) && <div className='subtitle'>{group}</div>}
                <Title />
              </div>
            </FlexItem>
            <FlexItem>
              <div className="list-wrapper">
                <ul className='list'>
                  {renderButtons()}
                  <li>
                    <ul className='checklist'>
                      {renderCheckItem('sizes', hasSizes)}
                      {renderCheckItem('levels', hasLevels)}
                      {renderCheckItem('margins', hasMargins)}
                    </ul>
                  </li>
                </ul>
              </div>
            </FlexItem>
          </Flex>
        </div>
      </Wrapper>
      <Subtitle />
      <Description />
      <Primary />
      <Controls />
      <Stories />
    </>
  )
}

DocRender.defaultProps = {
  hasSizes: false,
  hasLevels: false,
  hasMargins: false,
}


interface DocRenderProps {
  group: string
  codePath?: string
  figma?: string
  hasSizes?: boolean
  hasLevels?: boolean
  hasMargins?: boolean
}

export default function docOutline(props: DocRenderProps): DocOutline {
  return {
    docs: {
      page: () => {
        return <DocRender {...props} />
      }
    },
    hasPreview: true
  }
}

interface DocOutline {
  docs: {
    page: () => JSX.Element
  }
  hasPreview?: boolean
}
