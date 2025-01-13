import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import { Path } from "common/router"
import { AddItemForm } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { Navigate } from "react-router-dom"
import { selectIsLoggedIn } from "../features/auth/model/authSlice"
import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { addTodolist } from "../features/todolists/model/todolistsSlice"

export const Main = () => {
  const dispatch = useAppDispatch()

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const addTodolistHandler = (title: string) => {
    dispatch(addTodolist(title))
  }

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  return (
    <Container fixed>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
