import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

interface SpacerProps {
  height: number
}

export const Spacer = styled.div<SpacerProps>`
  ${({ height }) =>
    height &&
    css`
      margin-bottom: ${height}px;
      border-bottom: 1px solid var(--ui-border);
    `}
`
