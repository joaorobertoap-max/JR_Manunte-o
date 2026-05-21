export const AUTH_TOKEN_KEY = 'authToken'

export function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
}

export async function authFetch(url, options = {}) {
    const token = getToken()
    const headers = {
        ...(options.headers || {}),
        'Content-Type': 'application/json'
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    return fetch(url, {
        ...options,
        headers
    })
}
