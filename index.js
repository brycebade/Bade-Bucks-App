import { children } from "./data.js"

const dayChecks = document.querySelectorAll(".dayCheckbox")
const choresDisplay = document.getElementById("choresCompleted")
const payDisplay = document.getElementById("payDue")
const payCheckbox = document.getElementById("paidCheckbox")
const childOption = document.getElementById("childOption")
const childName = document.getElementById("childName")
const weekOption = document.getElementById("weekOption")

children.forEach((child) => {
    const childSelection = document.createElement("option")
    childSelection.textContent = child.name
    childSelection.value = child.id
    childOption.appendChild(childSelection)
})

children.forEach((child) => {
    const weekSelection = document.createElement("option")
    weekSelection.textContent = child.weeks[0].weekStart
    weekSelection.value = child.id
    weekOption.appendChild(weekSelection)
}) 

childOption.addEventListener("change", () => {
    const selectedChild = childOption.value
    
    const foundChild = children.find((child) => {
        return child.id === Number(selectedChild)
    })
    childName.textContent = foundChild.name
})

const updatePayDisplay = (count) => {
    if (payCheckbox.checked) {
        payDisplay.textContent = `Pay Due: $0`
        return
    } else if (count === 0) {
        payDisplay.textContent = `Pay Due: $0`
    } else if (count === 1) {
        payDisplay.textContent = `Pay Due: $25`
    } else if (count === 2) {
        payDisplay.textContent = `Pay Due: $50`
    } else if (count === 3) {
        payDisplay.textContent = `Pay Due: $75`
    } else {
        payDisplay.textContent = `Pay Due: negotiable`
    }
}

const updateChoresCompleted = () => {
    let count = 0

    dayChecks.forEach((dayCheck) => {
        if (dayCheck.checked) {
            count++
        }
    
    })
    choresDisplay.textContent = `Chores Completed: ${count} / 3`
    updatePayDisplay(count)
}

dayChecks.forEach((dayCheck) => {
    dayCheck.addEventListener("change", (event) => {
        const selectedChildId = childOption.value
        const day = event.target.id
        const isChecked = event.target.checked

        updateChoresCompleted()
    })    
})

payCheckbox.addEventListener("change", updateChoresCompleted)
