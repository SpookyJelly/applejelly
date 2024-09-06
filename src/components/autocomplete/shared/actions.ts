import * as R from 'ramda'
import { PanelState, PanelAction, PanelGroup, PanelActionTypes } from './types'

export function fakePanelReducer(
    state: PanelState,
    action: PanelAction
): PanelState {
    const stepPanelTo = (state: PanelState, panelGroup: PanelGroup) =>
        R.assoc('activatedPanel', panelGroup, state)

    if (action.type === PanelActionTypes.CLEAR) {
        return {
            type: { index: -1, selectedItem: {} },
            subType: { index: -1, selectedItem: {} },
            activatedPanel: 'type',
        }
    }

    if (action.type === PanelActionTypes.STEP.TYPE) {
        return stepPanelTo(state, 'type')
    }
    if (action.type === PanelActionTypes.STEP.SUBTYPE) {
        return stepPanelTo(state, 'subType')
    }

    if (action.type === PanelActionTypes.STEP.VALUE) {
        return stepPanelTo(state, 'value')
    }

    if (action.type === PanelActionTypes.UPDATE.TYPE) {
        return {
            ...state,
            type: { ...state.type, ...action.payload },
            subType: { index: -1, selectedItem: {} }, // Delete this if needed
        }
    }
    if (action.type === PanelActionTypes.UPDATE.SUBTYPE) {
        return {
            ...state,
            subType: { ...state.subType, ...action.payload },
        }
    }
    return state
}
