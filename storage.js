export const saveToStorage = (children) => {
    localStorage.setItem("children", JSON.stringify(children))
}

export const loadFromStorage = () => {
    return JSON.parse(localStorage.getItem("children"))
}