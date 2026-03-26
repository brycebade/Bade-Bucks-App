const dayChecks = document.querySelectorAll(".dayCheckbox")
const choresCompleted = document.getElementById("choresCompleted")


const updateChoresCompleted = () => {
    let count = 0

    dayChecks.forEach((dayCheck) => {
        if (dayCheck.checked) {
            count++
        }
    })

    console.log(count)
}

dayChecks.forEach((dayCheck) => {
    dayCheck.addEventListener("change", updateChoresCompleted)
    choresCompleted.textContent = updateChoresCompleted()
})
