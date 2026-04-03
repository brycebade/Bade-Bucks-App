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

const updatePayDisplay = (count, selectedChild) => {
    if (payCheckbox.checked) {
        payDisplay.textContent = `Pay Due: $0`
        return
    }

    const rate = selectedChild.perChoreRate
    payDisplay.textContent = `Pay Due: $${count * rate}`
}

const updateChoresCompleted = () => {
    const selectedChildId = childOption.value

    const selectedChild = children.find((child) => {
        return child.id === Number(selectedChildId)
       })

    let count = 0

    dayChecks.forEach((dayCheck) => {
        if (dayCheck.checked) {
            count++
        }
    })

    if (!selectedChild) {
        payDisplay.textContent = `Pay Due: `
        return
    }

    choresDisplay.textContent = `Chores Completed: ${count}`
    updatePayDisplay(count, selectedChild)
}

dayChecks.forEach((dayCheck) => {
    dayCheck.addEventListener("change", (event) => {
        const selectedChildId = childOption.value
        const day = event.target.id
        const isChecked = event.target.checked

        if (selectedChildId === "") {
            return
        }

       const selectedChild = children.find((child) => {
        return child.id === Number(selectedChildId)
       })

       if (!selectedChild) {
       }
    
        selectedChild.weeks[0][day] = isChecked
    
        updateChoresCompleted()
    })       
})

payCheckbox.addEventListener("change", updateChoresCompleted)
