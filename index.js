import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://nbvvzaausrqrqhtuptqi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idnZ6YWF1c3JxcnFodHVwdHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNjI4OTQsImV4cCI6MjA5MTczODg5NH0.oLkIV4-vyx3cc8xZWljW-r7iwnNsdmfTauwLjg4Sqk4'

const supabase = createClient(supabaseUrl, supabaseKey)

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
rewardsList
} from "./dom.js"

import { rewards } from "./rewards-data.js"

import { updateSummary } from "./summary.js"
import { resetUI } from "./render.js"

let children = []

const PASSWORD = "05012021"

let selectedChild = null

const loadChildren = async () => {
  const { data, error } = await supabase
  .from('children')
  .select('*')

  if (error) {
    console.log("ERROR loading children:", error)
    return []
  }

  return data.map((row) => ({
      id: row.id,
      name: row.name,
      payRates: row.data.payRates,
      weeks: row.data.weeks
    }))
  }

const init = async () => {
  children = await loadChildren()
  populateChildDropdown()
}

const saveChildToSupabase = async (child) => {
  const { error } = await supabase
  .from('children')
  .update({
    data: {
      payRates: child.payRates,
      weeks: child.weeks
    }
  })
  .eq('id', child.id)

  if (error) {
    console.log("SAVE ERROR:", error)
    return
  } 
}

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

  checkbox.addEventListener("change", async () => {
    chore.completed = checkbox.checked

    textSpan.classList.toggle("line-through", checkbox.checked)
    textSpan.classList.toggle("opacity-60", checkbox.checked)
    
    updateSummary(selectedChild)

    await saveChildToSupabase(selectedChild)
  })

  deleteBtn.addEventListener("click", () => {
    const index = selectedWeek.extraChores.indexOf(chore)

    if (index !== -1) {
      selectedWeek.extraChores.splice(index, 1)
    }

    li.remove()
    updateSummary(selectedChild)
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

  saveChildToSupabase(selectedChild)

  noExtraChores.style.display = "none"

  const li = createExtraChoreElement(newExtraChore, selectedWeek)
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

rewards.forEach((reward) => {
  const rewardCard = document.createElement("div")

  console.log(rewardCard)
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
      return child.id === selectedChildId
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
      saveChildToSupabase(selectedChild)
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
      return child.id === selectedChildId
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
      return child.id === selectedChildId
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
        saveChildToSupabase(selectedChild)
    }

    if (!selectedWeek.extraChores) {
    selectedWeek.extraChores = []
  }

    selectedWeek[day] = isChecked;

    updateSummary(selectedChild)
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

  selectedChild = children.find((child) => {
    return child.id === selectedChildId
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
  saveChildToSupabase(selectedChild)
});

const savedChildId = localStorage.getItem("selectedChildId")
const savedWeekStart = localStorage.getItem("selectedWeekStart")

if (savedChildId) {
    childOption.value = savedChildId

    selectedChild = children.find((child) => {
        return child.id === savedChildId
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
    
    localStorage.removeItem("selectedChildId")
    localStorage.removeItem("selectedWeekStart")
    location.reload()
})

init()