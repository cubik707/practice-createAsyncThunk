import { ResultCode } from "common/enums"
import { handleServerAppError, handleServerNetworkError } from "common/utils"
import { setAppStatus } from "../../../app/appSlice"
import { clearTasks } from "../../todolists/model/tasksSlice"
import { clearTodolists } from "../../todolists/model/todolistsSlice"
import { authApi } from "../api/authAPI"
import { LoginArgs } from "../api/authAPI.types"
import { createSliceWithThunks } from "common/utils/createSliceWithThunks"

export const authSlice = createSliceWithThunks({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  reducers: (create) => {
    const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null }>()
    return {
      logout: createAThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.logout()
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }))
              dispatch(clearTasks())
              dispatch(clearTodolists())
              localStorage.removeItem("sn-token")
              return { isLoggedIn: false }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          },
        },
      ),
      login: createAThunk(
        async (data: LoginArgs, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.login(data)
            if (res.data.resultCode === ResultCode.Success) {
              localStorage.setItem("sn-token", res.data.data.token)
              return { isLoggedIn: true }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          },
        },
      ),
      initializeApp: createAThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.me()
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }))
              return { isLoggedIn: true }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          },
          settled: (state) => {
            state.isInitialized = true
          },
        },
      ),
    }
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
    selectIsInitialized: (state) => state.isInitialized,
  },
})


export const { initializeApp, logout, login } = authSlice.actions
export const { selectIsLoggedIn, selectIsInitialized } = authSlice.selectors
export const authReducer = authSlice.reducer
