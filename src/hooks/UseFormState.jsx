import { useState, useCallback } from 'react'

const UseFormState = (initialState = {}) => {
    const [state, setState] = useState(initialState)

    const updateField = useCallback((key, value) => {
        setState((prev) => ({
            ...prev,
            [key]: value,
        }))
    }, [])

    const setField = useCallback((key, value) => {
        setState((prev) => ({
            ...prev,
            [key]: value,
        }))
    }, [])

    const resetField = useCallback((key) => {
        const defaultValue = typeof initialState[key] === 'object'
            ? Array.isArray(initialState[key])
                ? []
                : {}
            : ''
        setState((prev) => ({
            ...prev,
            [key]: defaultValue,
        }))
    }, [initialState])

    const setLoadingRequest = useCallback((isLoading) => {
        setState((prev) => ({
            ...prev,
            loadingRequest: isLoading,
        }))
    }, [])

    return {
        state,
        updateField,
        setField,
        resetField,
        setLoadingRequest,
    }
}

export default UseFormState
