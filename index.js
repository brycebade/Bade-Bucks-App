const dayChecks = document.querySelectorAll(".dayCheckbox")
const choresDisplay = document.getElementById("choresCompleted")
const payDisplay = document.getElementById("payDue")

const updatePayDisplay = (count) => {
    if (count === 0) {
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
    dayCheck.addEventListener("change", updateChoresCompleted)
})
