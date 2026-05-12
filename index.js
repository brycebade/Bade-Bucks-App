import { 
  saveChildToSupabase,
  loadChildren
 } from "./storage.js"

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
noExtraChores,
} from "./dom.js"

import { updateSummary } from "./summary.js"

import { 
  resetUI,
  createExtraChoreElement
 } from "./render.js"

 import { 
  getSelectedChild,
  getSelectedWeek,
  createWeek,
  ensureExtraChores
 } from "./utils.js"

let children = []

const PASSWORD = "05012021"

let selectedChild = null

const init = async () => {
  children = await loadChildren()
  populateChildDropdown()

  const savedChildId = localStorage.getItem("selectedChildId")
  const savedWeekStart = localStorage.getItem("selectedWeekStart")

  if (savedChildId) {
    childOption.value = savedChildId

    selectedChild = getSelectedChild(children, savedChildId)

    if (selectedChild) {
      childName.textContent = selectedChild.name
    }
  }

  if (savedChildId && savedWeekStart) {
    weekOption.value = savedWeekStart
    weekOption.dispatchEvent(new Event("change"))
  }
}

choreBtn.addEventListener("click", () => {
  const chore = extraChore.value.trim()
  const extraPayAmount = Number(extraPay.value)

  if (chore === "" || extraPay.value === "") return

  const formattedChore = chore.charAt(0).toUpperCase() + chore.slice(1)

  const selectedWeekStart = weekOption.value
  
  if (!selectedChild || selectedWeekStart === "") return

  const selectedWeek = getSelectedWeek(selectedChild, selectedWeekStart)

  if (!selectedWeek) return
  
  const newExtraChore = {
    name: formattedChore,
    amount: extraPayAmount,
    completed: false
  }

  ensureExtraChores(selectedWeek)

  selectedWeek.extraChores.push(newExtraChore)

  saveChildToSupabase(selectedChild)

  noExtraChores.style.display = "none"

  const li = createExtraChoreElement(newExtraChore, selectedWeek, selectedChild)
  choreList.appendChild(li)

  extraChore.value = ""
  extraPay.value = ""
})

const populateChildDropdown = () => {
  childOption.innerHTML = `<option value="">Select Child</option>`

  children.forEach((child) => {
    const option = document.createElement("option")
    option.value = child.id
    option.textContent = child.name
    childOption.appendChild(option)
  })
}

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

  selectedChild = getSelectedChild(children, selectedChildId)

  if (!selectedChild) {
      return
  }

  let selectedWeek = getSelectedWeek(selectedChild, selectedWeekStart)

  if (!selectedWeek) {
    selectedWeek = createWeek(selectedWeekStart)

    selectedChild.weeks.push(selectedWeek)
    saveChildToSupabase(selectedChild)
  }

  ensureExtraChores(selectedWeek)

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
    const li = createExtraChoreElement(chore, selectedWeek, selectedChild)
    choreList.appendChild(li)
  })

  updateSummary(selectedChild, selectedWeek)
})

// FUNCTIONS OF CHILD DROP DOWN LIST

childOption.addEventListener("change", () => {
  const selectedChildId = childOption.value

  localStorage.setItem("selectedChildId", selectedChildId)
  localStorage.removeItem("selectedWeekStart")
  
  const foundChild = getSelectedChild(children, selectedChildId)

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

    selectedChild = getSelectedChild(children, selectedChildId)

    if (!selectedChild) {
      return;
    }

    let selectedWeek = getSelectedWeek(selectedChild, selectedWeekStart)

    if (!selectedWeek) {
      selectedWeek = createWeek(selectedWeekStart)

      selectedChild.weeks.push(selectedWeek)
      saveChildToSupabase(selectedChild)
    }

    ensureExtraChores(selectedWeek)

    selectedWeek[day] = isChecked;

    updateSummary(selectedChild, selectedWeek)
    saveChildToSupabase(selectedChild)
  });
});

// UPDATE PAY

payCheckbox.addEventListener("change", () => {
  const selectedChildId = childOption.value;
  const selectedWeekStart = weekOption.value;

  if (selectedChildId === "" || selectedWeekStart === "") {
    return;
  }

  selectedChild = getSelectedChild(children, selectedChildId)

  if (!selectedChild) {
    return
  }

  const selectedWeek = getSelectedWeek(selectedChild, selectedWeekStart)

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

  updateSummary(selectedChild, selectedWeek)
  saveChildToSupabase(selectedChild)
});

resetButton.addEventListener("click", () => {
    const confirmReset = confirm("Are you sure you want to reset all data?")
    if (!confirmReset) return
    
    localStorage.removeItem("selectedChildId")
    localStorage.removeItem("selectedWeekStart")
    location.reload()
})

init()