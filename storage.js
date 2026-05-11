import { supabase } from "./supabaseClient"

export const saveToStorage = (children) => {
    localStorage.setItem("children", JSON.stringify(children))
}

export const loadFromStorage = () => {
    return JSON.parse(localStorage.getItem("children"))
}

export const saveChildToSupabase = async (child) => {
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

export const loadChildren = async () => {
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