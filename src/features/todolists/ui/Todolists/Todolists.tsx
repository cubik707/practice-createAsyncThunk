import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { fetchTodolistsTC, selectTodolists } from "../../model/todolistsSlice"
import { Todolist } from "./Todolist/Todolist"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [])

  return (
    <>
      {todolists.map((tl) => {
        return (
          <Grid key={tl.id}>
            <Paper sx={{ p: "0 20px 20px 20px" }}>
              <Todolist key={tl.id} todolist={tl} />
            </Paper>
          </Grid>
        )
      })}
    </>
  )
}
