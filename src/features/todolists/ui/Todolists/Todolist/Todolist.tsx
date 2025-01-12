import { AddItemForm } from "common/components"
import { useAppDispatch } from "common/hooks"
import { addTaskTC } from "../../../model/tasksSlice"
import { DomainTodolist } from "../../../model/todolistsSlice"

import { FilterTasksButtons } from "./FilterTasksButtons/FilterTasksButtons"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"

type Props = {
  todolist: DomainTodolist
}

export const Todolist = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const addTaskCallback = (title: string) => {
    dispatch(addTaskTC({ title, todolistId: todolist.id }))
  }

  return (
    <>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} />
      <FilterTasksButtons todolist={todolist} />
    </>
  )
}
