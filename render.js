import { 
    dayChecks,
    payCheckbox,
    choresDisplay,
    payDisplay, 
} from "./dom.js"

import { updateSummary } from "./summary.js"
import { saveChildToSupabase } from "./storage.js"
import { noExtraChores } from "./dom.js"

export const resetUI = () => {
    dayChecks.forEach((dayCheck) => {
        dayCheck.checked = false
        dayCheck.disabled = false
    })

    payCheckbox.checked = false

    choresDisplay.textContent = `Chores Completed: 0`
    payDisplay.textContent = `Pay Due: $0`
}

export const renderSummary = (count, totalPay) => {
    choresDisplay.textContent = `Chores Completed: ${count}`
    payDisplay.textContent = `Pay Due: $${totalPay}`
}

export const createExtraChoreElement = (chore, selectedWeek, selectedChild) => {
  const li = document.createElement("li")
  li.classList.add("flex", "items-center", "gap-3")

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.checked = chore.completed
  checkbox.dataset.amount = String(chore.amount)
  checkbox.classList.add("checkbox", "checkbox-primary", "checkbox-lg", "extraChoreCheckbox")

  const textSpan = document.createElement("span")
  textSpan.textContent = `${chore.name} - $${chore.amount}`

  if (chore.completed) {
    textSpan.classList.add("line-through", "opacity-60")
  }

  const deleteBtn = document.createElement("button")
  deleteBtn.textContent = "❌"
  deleteBtn.classList.add("ml-6")

  checkbox.addEventListener("change", async () => {
    chore.completed = checkbox.checked

    textSpan.classList.toggle("line-through", checkbox.checked)
    textSpan.classList.toggle("opacity-60", checkbox.checked)
    
    updateSummary(selectedChild, selectedWeek)

    await saveChildToSupabase(selectedChild)
  })

  deleteBtn.addEventListener("click", () => {
    const index = selectedWeek.extraChores.indexOf(chore)

    if (index !== -1) {
      selectedWeek.extraChores.splice(index, 1)
    }

    li.remove()
    updateSummary(selectedChild, selectedWeek)
    saveChildToSupabase(selectedChild)

    if (selectedWeek.extraChores.length === 0) {
      noExtraChores.style.display = "block"
    }
  })

  li.appendChild(checkbox)
  li.appendChild(textSpan)
  li.appendChild(deleteBtn)

  return li
}