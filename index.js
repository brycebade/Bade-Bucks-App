import { children as starterChildren } from "./data.js"

import { 
dayChecks,
payCheckbox,
childOption,
childName,
weekOption,
weekText,
resetButton,
extraChore,
extraPay,
choreList,
choreBtn,
noExtraChores 
} from "./dom.js"

import { updateSummary } from "./summary.js"
import { resetUI } from "./render.js"

import { 
  saveToStorage,
  loadFromStorage
 } from "./storage.js"

let children = loadFromStorage() || starterChildren

const PASSWORD = "05012021"

let selectedChild = null

const createExtraChoreElement = (chore, selectedWeek) => {
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

  checkbox.addEventListener("change", () => {
    chore.completed = checkbox.completed

    textSpan.classList.toggle("line-through")
    textSpan.classList.toggle("opacity-60")
    
    saveToStorage(children)
    updateSummary(selectedChild)
  })

  deleteBtn.addEventListener("click", () => {
    const index = selectedWeek.extraChores.indexOf(chore)

    if (index !== -1) {
      selectedWeek.extraChores.splice(index, 1)
    }

    li.remove()
    saveToStorage(children)
    updateSummary(selectedChild)

    if(selectedChild.extraChores.length === 0) {
      noExtraChores.style.display = "block"
    }
  })

  li.appendChild(checkbox)
  li.appendChild(textSpan)
  li.appendChild(deleteBtn)

  return li
}

choreBtn.addEventListener("click", () => {
  const chore = extraChore.value.trim()
  const extraPayAmount = Number(extraPay.value)

  if (chore === "" || extraPay.value === "") return

  const formattedChore = chore.charAt(0).toUpperCase() + chore.slice(1)

  const selectedWeekStart = weekOption.value
  
  if (!selectedChild || selectedWeekStart === "") return

  const selectedWeek = selectedChild.weeks.find((week) => {
    return week.weekStart === selectedWeekStart
  })

  if (!selectedWeek) return
  
  const newExtraChore = {
    name: formattedChore,
    amount: extraPayAmount,
    completed: false
  }

  if (!selectedWeek.extraChores) {
    selectedWeek.extraChores = []
  }

  selectedWeek.extraChores.push(newExtraChore)
  saveToStorage(children)

  noExtraChores.style.display = "none"

  const li = createExtraChoreElement(newExtraChore, selectedWeek)
  choreList.appendChild(li)

  extraChore.value = ""
  extraPay.value = ""
})

// POPULATE DROP DOWN LISTS

children.forEach((child) => {
    const childSelection = document.createElement("option")
    childSelection.textContent = child.name
    childSelection.value = child.id
    childOption.appendChild(childSelection)
})

// get Weekdate function

const getWeekday = (date) => {
  const weekday = date.getDay()
  const copyDate = new Date(date)
  let diff

  if (weekday === 0) {
      diff = date.getDate() - weekday - 6
  } else {
      diff = date.getDate() - weekday + 1
  }

  copyDate.setDate(diff)
  return copyDate
}

const today = new Date()
const currentWeek = getWeekday(today)

weekOption.innerHTML = `<option value="">Select Week</option>`

for (let i = -5; i <= 4; i++) {
  const weekDate = new Date(currentWeek)
  weekDate.setDate(currentWeek.getDate() + i * 7)

  const option = document.createElement("option")

  option.value = weekDate.toISOString().split("T")[0]
  option.textContent = weekDate.toDateString()

  weekOption.appendChild(option)
}

// CHANGE TEXT ON WEEK OF 

weekOption.addEventListener("change", () => {
  const selectedChildId = childOption.value
  const selectedWeekStart = weekOption.value

  if (selectedChildId === "" || selectedWeekStart === "") {
      weekText.textContent = "Week Of: "
      resetUI()
      return
  }

  localStorage.setItem("selectedChildId", selectedChildId)
  localStorage.setItem("selectedWeekStart", selectedWeekStart)

  const selectedWeekText = weekOption.options[weekOption.selectedIndex].text
  weekText.textContent = `Week Of: ${selectedWeekText}`

  selectedChild = children.find((child) => {
      return child.id === Number(selectedChildId)
  })

  if (!selectedChild) {
      return
  }

  let selectedWeek = selectedChild.weeks.find((week) => {
      return week.weekStart === selectedWeekStart
  })

  if (!selectedWeek) {
      selectedWeek = {
        weekStart: selectedWeekStart,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        isPaid: false,
        extraChores: []
      }

      selectedChild.weeks.push(selectedWeek)
      saveToStorage(children)
  }

  if (!selectedWeek.extraChores) {
    selectedWeek.extraChores = []
  }

  dayChecks.forEach((dayCheck) => {
      const day = dayCheck.id
      dayCheck.checked = selectedWeek[day]
      dayCheck.disabled = selectedWeek.isPaid
  })

  payCheckbox.checked = selectedWeek.isPaid

  choreList.innerHTML = ""

  if (!selectedWeek.extraChores || selectedWeek.extraChores.length === 0) {
    noExtraChores.style.display = "block"
  } else {
    noExtraChores.style.display = "none"
  }

  selectedWeek.extraChores.forEach((chore) => {
    const li = createExtraChoreElement(chore, selectedWeek)
    choreList.appendChild(li)
  })

  updateSummary(selectedChild)
})

// FUNCTIONS OF CHILD DROP DOWN LIST

childOption.addEventListener("change", () => {
  const selectedChildId = childOption.value

  localStorage.setItem("selectedChildId", selectedChildId)
  localStorage.removeItem("selectedWeekStart")
  
  const foundChild = children.find((child) => {
      return child.id === Number(selectedChildId)
  })

  weekOption.value = ""
  weekText.textContent = "Week Of: "

  if (!foundChild) {
      childName.textContent = ""
      resetUI()
      return
  }

  childName.textContent = foundChild.name
  resetUI()
})

dayChecks.forEach((dayCheck) => {
  dayCheck.addEventListener("change", (event) => {
    const selectedChildId = childOption.value;
    const selectedWeekStart = weekOption.value;
    const day = event.target.id;
    const isChecked = event.target.checked;

    if (selectedChildId === "" || selectedWeekStart === "") {
      return;
    }

    selectedChild = children.find((child) => {
      return child.id === Number(selectedChildId);
    });

    if (!selectedChild) {
      return;
    }

    let selectedWeek = selectedChild.weeks.find((week) => {
      return week.weekStart === selectedWeekStart;
    });

    if (!selectedWeek) {
        selectedWeek = {
            weekStart: selectedWeekStart,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            isPaid: false,
            extraChores: []
        }

        selectedChild.weeks.push(selectedWeek)
        saveToStorage(children)
    }

    if (!selectedWeek.extraChores) {
    selectedWeek.extraChores = []
  }

    selectedWeek[day] = isChecked;

    updateSummary(selectedChild)
    saveToStorage(children)
  });
});

// UPDATE PAY

payCheckbox.addEventListener("change", () => {
  const selectedChildId = childOption.value;
  const selectedWeekStart = weekOption.value;

  if (selectedChildId === "" || selectedWeekStart === "") {
    return;
  }

  selectedChild = children.find((child) => {
    return child.id === Number(selectedChildId);
  });

  if (!selectedChild) {
    return
  }

  const selectedWeek = selectedChild.weeks.find((week) => {
    return week.weekStart === selectedWeekStart;
  });

  if (!selectedWeek) {
    return;
  }

  if (payCheckbox.checked === false) {
    const userInput = prompt("Enter Password")

    if (userInput !== PASSWORD) {
      payCheckbox.checked = true
      alert("Permission Denied")
      return
    }
  }

  selectedWeek.isPaid = payCheckbox.checked;

  dayChecks.forEach((dayCheck) => {
    if (payCheckbox.checked === true) {
      dayCheck.disabled = true;
    } else {
      dayCheck.disabled = false;
    }
  });

  updateSummary(selectedChild)
  saveToStorage(children)
});

const savedChildId = localStorage.getItem("selectedChildId")
const savedWeekStart = localStorage.getItem("selectedWeekStart")

if (savedChildId) {
    childOption.value = savedChildId

    selectedChild = children.find((child) => {
        return child.id === Number(savedChildId)
    })
        
    if (selectedChild) {
        childName.textContent = selectedChild.name
    }
}

if (savedChildId && savedWeekStart) {
    weekOption.value = savedWeekStart
    weekOption.dispatchEvent(new Event("change"))
}

resetButton.addEventListener("click", () => {
    const confirmReset = confirm("Are you sure you want to reset all data?")
    if (!confirmReset) return
    
    localStorage.removeItem("children")
    localStorage.removeItem("selectedChildId")
    localStorage.removeItem("selectedWeekStart")
    location.reload()
})