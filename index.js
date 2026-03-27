const dayChecks = document.querySelectorAll(".dayCheckbox")
const choresDisplay = document.getElementById("choresCompleted")
const payDisplay = document.getElementById("payDue")



const updatePayDisplay = () => {
    if (count === 1) {
        payDisplay.textContent = `Pay Due: $25`
    } else if (count === 2) {
        payDisplay.textContent = `Pay Due: $50`
    } else if (count === 3) {
        payDisplay.textContent = `Pay Due: $75`
    } else {
        payDisplay.textContent = `Pay Due: `
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
    updatePayDisplay()   
}

dayChecks.forEach((dayCheck) => {
    dayCheck.addEventListener("change", updateChoresCompleted)
})
