import { children } from "./data.js"

const dayChecks = document.querySelectorAll(".dayCheckbox")
const choresDisplay = document.getElementById("choresCompleted")
const payDisplay = document.getElementById("payDue")
const payCheckbox = document.getElementById("paidCheckbox")
const childOption = document.getElementById("childOption")
const childName = document.getElementById("childName")
const weekOption = document.getElementById("weekOption")
const weekText = document.getElementById("week")

// POPULATE DROP DOWN LISTS

children.forEach((child) => {
    const childSelection = document.createElement("option")
    childSelection.textContent = child.name
    childSelection.value = child.id
    childOption.appendChild(childSelection)
})

// CHANGE TEXT ON WEEK OF 

weekOption.addEventListener("change", () => {
    const selectedWeek = weekOption.value
    weekText.textContent = `Week Of: ${selectedWeek}`
})

// FUNCTIONS OF CHILD DROP DOWN LIST

childOption.addEventListener("change", () => {
    const selectedChild = childOption.value
    
    const foundChild = children.find((child) => {
        return child.id === Number(selectedChild)
    })

    weekOption.innerHTML = `<option value="">Select Week</option>`

    if (!foundChild) {
        childName.textContent = ""
        return
    }

    foundChild.weeks.forEach((week) => {
        const weekSelection = document.createElement("option")
        weekSelection.textContent = week.weekStart
        weekSelection.value = week.weekStart
        weekOption.appendChild(weekSelection)
    }) 

    weekText.textContent = "Week Of: "
 
    childName.textContent = foundChild.name

    dayChecks.forEach((dayCheck) => {
        dayCheck.checked = false
    })
    
    payCheckbox.checked = false

    choresDisplay.textContent = `Chores Completed: 0`
    payDisplay.textContent = `Pay Due: $0`
})

// PAY DUE DISPLAY

const updatePayDisplay = (count, selectedChild) => {
    if (payCheckbox.checked) {
        payDisplay.textContent = `Pay Due: $0`
        return
    }

    const pay = selectedChild.payRates[count]
    payDisplay.textContent = `Pay Due: $${pay}`
}

// COUNT CHORES & CHECKED BOXES

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
        return
       }
    
        selectedChild.weeks[0][day] = isChecked
    
        updateChoresCompleted()
    })       
})

// UPDATE PAY

payCheckbox.addEventListener("change", updateChoresCompleted)
