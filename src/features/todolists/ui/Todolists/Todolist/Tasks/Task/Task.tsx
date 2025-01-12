import { EditableSpan } from "common/components"
import { TaskStatus } from "common/enums"
import { useAppDispatch } from "common/hooks"
import { DomainTask } from "../../../../../api/tasksApi.types"
import { removeTaskTC, updateTaskTC } from "../../../../../model/tasksSlice"
import { DomainTodolist } from "../../../../../model/todolistsSlice"
import { getListItemSx } from "./Task.styles"
import { ChangeEvent } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const Task = ({ task, todolist }: Props) => {
  const dispatch = useAppDispatch()

  const removeTaskHandler = () => {
    dispatch(removeTaskTC({ taskId: task.id, todolistId: todolist.id }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    dispatch(updateTaskTC({ taskId: task.id, todolistId: todolist.id, domainModel: { status } }))
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(updateTaskTC({ taskId: task.id, todolistId: todolist.id, domainModel: { title } }))
  }

  const disabled = todolist.entityStatus === "loading"

  return (
    <ListItem key={task.id} sx={getListItemSx(task.status === TaskStatus.Completed)}>
      <div>
        <Checkbox
          checked={task.status === TaskStatus.Completed}
          onChange={changeTaskStatusHandler}
          disabled={disabled}
        />
        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} disabled={disabled} />
      </div>
      <IconButton onClick={removeTaskHandler} disabled={disabled}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
