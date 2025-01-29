/**
 *
 * PopoverButton
 *
 */

import React from 'react'
import ControlledPopoverButton, {
    ControlledPopoverButtonProps,
} from '../ControlledPopoverButton'
import { ExtraDOMProps } from '../../../types'
import { MarginProps, LockupProps } from '../../../helpers'
import './popover-button.scss'

function PopoverButton(props: Props) {
    const { onOpen, onClose, ...rest } = props
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <ControlledPopoverButton
            {...rest}
            isPadded={false}
            isOpen={isOpen}
            onOpen={(event) => {
                setIsOpen(true)
                onOpen && onOpen(event)
            }}
            onClose={(event) => {
                setIsOpen(false)
                onClose && onClose(event)
            }}
        />
    )
}

PopoverButton.defaultProps = {}

interface Props
    extends ControlledPopoverButtonProps,
        ExtraDOMProps,
        LockupProps,
        MarginProps {}

export default PopoverButton
