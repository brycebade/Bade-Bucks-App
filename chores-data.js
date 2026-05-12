export const chores = [
  {
    id: "chore-1",
    name: "Laundry Room & Stairs",
    completed: false,
    tasks: [
      {
        id: "task-1",
        text: "Scrape dog hair off stairs",
        completed: false
      },
      {
        id: "task-2",
        text: "Clean off top of dryer",
        completed: false,
        subtasks: [
          {
            id: "subtask-1",
            text: "Throw away trash & dryer lint",
            completed: false
          },
          {
            id: "subtask-2",
            text: "Wipe down top of dryer",
            completed: false
          },
          {
            id: "subtask-3",
            text: "Clean out dryer lint trap",
            completed: false
          }
        ]
      },
      {
        id: "task-3",
        text: "Wipe down walls",
        completed: false,
        subtasks: [
          {
            id: "subtask-4",
            text: "Make sure to clean where dogs lay against",
            completed: false
          },
          {
            id: "subtask-5",
            text: "Use magic eraser if possible",
            completed: false
          }
        ]
      },
      {
        id: "task-4",
        text: "Clean floors",
        completed: false,
        subtasks: [
            {
                id: "subtask-6",
                text: "Pick up any trash, clothes, odds & ends",
                completed: false
            },
            {
                id: "subtask-7",
                text: "Sweep and mop - DO NOT USE VACUUM",
                completed: false
            }
        ]
      }
    ]
  },
  {
    id: "chore-2",
    text: "Kitchen",
    completed: false,
    tasks: [
        {
            id: "task-1",
            text: "Dishes",
            completed: false
        },
        {
            id: "task-2",
            text: "Countertops",
            completed: false,
            subtasks: [
                {
                    id: "subtask-8",
                    text: "Move all items",
                    completed: false,
                    subsubtasks: [
                        {
                            id: "subsubtask-1",
                            text: "Throw away trash",
                            completed: false
                        },
                        {
                            id: "subsubtask-2",
                            text: "Put away if not supposed to be on counter",
                            completed: false
                        },
                    ]
                },
                {
                    id: "subtask-9",
                    text: "Wipe down counters",
                    completed: false
                }
            ]
        }
    ]
  }
]