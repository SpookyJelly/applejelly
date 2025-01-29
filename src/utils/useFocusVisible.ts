//@ts-nocheck
type Elem = HTMLElement | Document
type AllDocument = Document | DocumentFragment

const visiableTarget = 'focus-visible-target'
const visiableAncestor = 'focus-visible-ancestor'

function focusVisble(node: AllDocument) {
    let isFocus = true
    let needReset = false
    let timeoutId: ReturnType<typeof setTimeout>

    const elemTypes: any = {
        text: true,
        search: true,
        url: true,
        tel: true,
        email: true,
        password: true,
        number: true,
        date: true,
        month: true,
        week: true,
        time: true,
        datetime: true,
        'datetime-local': true,
    }

    const isFocusable = (elem: Elem) =>
        !!(
            elem &&
            elem !== document &&
            elem.nodeName !== 'HTML' &&
            elem.nodeName !== 'BODY' &&
            'classList' in elem &&
            'contains' in elem.classList
        )

    const findAncestor = (elem: HTMLElement) =>
        elem.classList.contains(visiableTarget)
            ? elem.closest(`.${visiableAncestor}`)
            : null

    const addFocusVisible = (elem: HTMLElement) => {
        if (!elem.classList.contains('focus-visible')) {
            elem.classList.add('focus-visible')
            elem.setAttribute('data-focus-visible-added', '')
            const ancestor = findAncestor(elem)
            if (ancestor) {
                ancestor.classList.add('focus-visible')
                ancestor.setAttribute('data-focus-visible-added', '')
            }
        }
    }

    const disableFocusVisible = () => {
        isFocus = false
    }

    const setupEventListeners = () => {
        document.addEventListener('mousemove', removeEventListeners)
        document.addEventListener('mousedown', removeEventListeners)
        document.addEventListener('mouseup', removeEventListeners)
        document.addEventListener('pointermove', removeEventListeners)
        document.addEventListener('pointerdown', removeEventListeners)
        document.addEventListener('pointerup', removeEventListeners)
        document.addEventListener('touchmove', removeEventListeners)
        document.addEventListener('touchstart', removeEventListeners)
        document.addEventListener('touchend', removeEventListeners)
    }

    const removeEventListeners = (event: any) => {
        if (
            !event.target.nodeName ||
            event.target.nodeName.toLowerCase() !== 'html'
        ) {
            isFocus = false
            document.removeEventListener('mousemove', removeEventListeners)
            document.removeEventListener('mousedown', removeEventListeners)
            document.removeEventListener('mouseup', removeEventListeners)
            document.removeEventListener('pointermove', removeEventListeners)
            document.removeEventListener('pointerdown', removeEventListeners)
            document.removeEventListener('pointerup', removeEventListeners)
            document.removeEventListener('touchmove', removeEventListeners)
            document.removeEventListener('touchstart', removeEventListeners)
            document.removeEventListener('touchend', removeEventListeners)
        }
    }

    document.addEventListener(
        'keydown',
        (event) => {
            if (!event.metaKey && !event.altKey && !event.ctrlKey) {
                if (isFocusable(node.activeElement)) {
                    addFocusVisible(node.activeElement)
                }
                isFocus = true
            }
        },
        true
    )

    document.addEventListener('mousedown', disableFocusVisible, true)
    document.addEventListener('pointerdown', disableFocusVisible, true)
    document.addEventListener('touchstart', disableFocusVisible, true)

    document.addEventListener(
        'visibilitychange',
        () => {
            if (document.visibilityState === 'hidden') {
                if (needReset) {
                    isFocus = true
                }
                setupEventListeners()
            }
        },
        true
    )

    setupEventListeners()

    node.addEventListener(
        'focus',
        (event) => {
            if (isFocusable(event.target as any)) {
                if (!isFocus) {
                    const el: any = event.target
                    const elType = el.type
                    const elTagName = el.tagName
                    if (
                        (elTagName === 'INPUT' &&
                            elemTypes[elType] &&
                            !el.readOnly) ||
                        (elTagName === 'TEXTAREA' && !el.readOnly) ||
                        el.isContentEditable
                    ) {
                        addFocusVisible(event.target as any)
                    }
                }
            }
        },
        true
    )

    node.addEventListener(
        'blur',
        (event: any) => {
            if (isFocusable(event.target)) {
                const elem = event.target
                if (
                    elem.classList.contains('focus-visible') ||
                    elem.hasAttribute('data-focus-visible-added')
                ) {
                    needReset = true
                    clearTimeout(timeoutId)
                    timeoutId = setTimeout(() => {
                        needReset = false
                        window.clearTimeout(timeoutId)
                    }, 100)

                    if (elem.hasAttribute('data-focus-visible-added')) {
                        elem.classList.remove('focus-visible')
                        elem.removeAttribute('data-focus-visible-added')
                        const ancestor = findAncestor(elem)
                        if (ancestor) {
                            ancestor.classList.remove('focus-visible')
                            ancestor.removeAttribute('data-focus-visible-added')
                        }
                    }
                }
            }
        },
        true
    )

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && node.host) {
        node.host.setAttribute('data-js-focus-visible', '')
    } else if (node.nodeType === Node.DOCUMENT_NODE) {
        document.documentElement.classList.add('js-focus-visible')
    }
}

export const useFocusVisible = () => {
    return focusVisble(document)
}
