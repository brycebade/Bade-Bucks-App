import { 
    dayChecks,
    payCheckbox,
    choresDisplay,
    payDisplay, 
} from "./dom.js"

export const resetUI = () => {
    dayChecks.forEach((dayCheck) => {
        dayCheck.checked = false
        dayCheck.disabled = false
    })

    payCheckbox.checked = false

    choresDisplay.textContent = `Chores Completed: 0`
    payDisplay.textContent = `Pay Due: $0`
}