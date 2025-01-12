import { TaskPriority, TaskStatus } from "common/enums"
import { addTask, removeTask, tasksReducer, TasksStateType, updateTask } from "../tasksSlice"
import { addTodolist, removeTodolist } from "../todolistsSlice"

let startState: TasksStateType = {}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriority.Low,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriority.Low,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriority.Low,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriority.Low,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriority.Low,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriority.Low,
      },
    ],
  }
})

test("correct task should be deleted from correct array", () => {
  const endState = tasksReducer(
    startState,
    removeTask({
      taskId: "2",
      todolistId: "todolistId2",
    }),
  )

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(2)
  expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy()
})

test("correct task should be added to correct array", () => {
  const action = addTask({
    task: {
      todoListId: "todolistId2",
      title: "juce",
      status: TaskStatus.New,
      addedDate: "",
      deadline: "",
      description: "",
      order: 0,
      priority: 0,
      startDate: "",
      id: "id exists",
    },
  })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(4)
  expect(endState["todolistId2"][0].id).toBeDefined()
  expect(endState["todolistId2"][0].title).toBe("juce")
  expect(endState["todolistId2"][0].status).toBe(TaskStatus.New)
})

test("status of specified task should be changed", () => {
  const action = updateTask({ todolistId: "todolistId2", taskId: "2", domainModel: { status: TaskStatus.New } })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId2"][1].status).toBe(TaskStatus.New)
  expect(endState["todolistId1"][1].status).toBe(TaskStatus.Completed)
})

test("title of specified task should be changed", () => {
  const action = updateTask({ todolistId: "todolistId2", taskId: "2", domainModel: { title: "coffee" } })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId2"][1].title).toBe("coffee")
  expect(endState["todolistId1"][1].title).toBe("JS")
})

test("new array should be added when new todolist is added", () => {
  const action = addTodolist({
    todolist: {
      id: "blabla",
      title: "new todolist",
      order: 0,
      addedDate: "",
    },
  })

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(startState, removeTodolist({ id: "todolistId2" }))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
