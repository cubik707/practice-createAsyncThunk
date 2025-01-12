import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { selectThemeMode } from "../../../../app/appSlice"
import { loginTC, selectIsLoggedIn } from "../../model/authSlice"
import s from "./Login.module.css"

type Inputs = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { email: "", password: "", rememberMe: false } })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(loginTC(data))
    reset()
  }

  if (isLoggedIn) {
    return <Navigate to={"/"} />
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href={"https://social-network.samuraijs.com/"}
                target={"_blank"}
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Incorrect email address",
                  },
                })}
              />
              {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 3,
                    message: "Password must be at least 3 characters long",
                  },
                })}
              />
              {errors.password && <span className={s.errorMessage}>{errors.password.message}</span>}

              <FormControlLabel
                label={"Remember me"}
                control={
                  <Controller
                    name={"rememberMe"}
                    control={control}
                    render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                  />
                }
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  )
}
