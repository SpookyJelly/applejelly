import React from 'react'
import * as R from 'ramda'
import {
    PanelState,
    PanelActionTypes,
    PanelGroup,
    PanelAction,
} from '../shared/types'

export const moveToTypePanel = (dispatch: React.Dispatch<PanelAction>) => {
    dispatch({ type: PanelActionTypes.STEP.TYPE })
    dispatch({
        type: PanelActionTypes.UPDATE.TYPE,
        payload: { selectedItem: {} },
    })
}

export const moveToSubTypePanel = (dispatch: React.Dispatch<PanelAction>) => {
    dispatch({ type: PanelActionTypes.STEP.SUBTYPE })
    dispatch({
        type: PanelActionTypes.UPDATE.SUBTYPE,
        payload: { selectedItem: {} },
    })
}

export const inputKeyDownHandler = (
    e: React.KeyboardEvent,
    fpState: PanelState,
    typePanelRef: any,
    subTypePanelRef: any,
    dispatch: React.Dispatch<PanelAction>,
    // NOTE: source의 타입을 categoryProps랑 source 타입이랑 맞춰야한다
    source: any[]
    // source: {
    //   type: string;
    //   count: number;
    //   subType: {
    //     value: string;
    //     count: number;
    //   }[];
    //   item: Item[];
    // }[],
) => {
    // subtype에서의 비지니스 로직 변경으로 수정
    // if (
    //   fpState.activatedPanel === "subType" &&
    //   !e.code.includes("Arrow") &&
    //   !e.code.includes("Enter")
    // ) {
    //   dispatch({
    //     type: PanelActionTypes.UPDATE.SUBTYPE,
    //     payload: {
    //       index: -1,
    //       selectedItem: {},
    //     },
    //   });
    //   dispatch({ type: PanelActionTypes.STEP.VALUE });
    // }

    const activatedPanel = fpState.activatedPanel
    const updates =
        activatedPanel === 'type'
            ? PanelActionTypes.UPDATE.TYPE
            : PanelActionTypes.UPDATE.SUBTYPE

    let currentIdx =
        fpState[activatedPanel as Exclude<PanelGroup, 'value'>].index
    const target = activatedPanel === 'type' ? typePanelRef : subTypePanelRef
    const maxLen = R.cond([
        [R.equals('type'), R.always(source.length)],
        [R.T, (_) => R.max(1, source[fpState.type.index].subType.length)],
    ])(activatedPanel)

    if (e.code === 'ArrowUp') {
        if (currentIdx < 0) currentIdx = 0
        const idx = (currentIdx - 1 + maxLen) % maxLen
        dispatch({ type: updates, payload: { index: idx } })
        target.current?.children[idx].scrollIntoView({ block: 'nearest' })
    }
    if (e.code === 'ArrowDown') {
        const idx = (currentIdx + 1) % maxLen
        dispatch({ type: updates, payload: { index: idx } })
        target.current?.children[idx].scrollIntoView({ block: 'nearest' })
    }
    if (e.code === 'ArrowRight' || e.code === 'Enter') {
        //added
        if (activatedPanel === 'type') {
            if (fpState.type.index < 0) return
            if (source[fpState.type.index].subType.length === 0) {
                dispatch({ type: PanelActionTypes.STEP.VALUE })
            } else {
                dispatch({ type: PanelActionTypes.STEP.SUBTYPE })
            }
            dispatch({
                type: PanelActionTypes.UPDATE.TYPE,
                payload: {
                    ...fpState.type,
                    selectedItem: source[fpState.type.index],
                },
            })
        }
        if (activatedPanel === 'subType') {
            if (fpState.subType.index < 0) return
            dispatch({ type: PanelActionTypes.STEP.VALUE })
            dispatch({
                type: PanelActionTypes.UPDATE.SUBTYPE,
                payload: {
                    ...fpState.subType,
                    selectedItem:
                        source[fpState.type.index].subType[
                            fpState.subType.index
                        ],
                },
            })
        }
    }
    if (e.code === 'ArrowLeft') {
        if (activatedPanel === 'subType') {
            moveToTypePanel(dispatch)
        }
    }
}
