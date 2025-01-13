import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"
import { ResultCode } from "common/enums"
import { handleServerAppError, handleServerNetworkError } from "common/utils"
import { RequestStatus, setAppStatus } from "../../../app/appSlice"
import { todolistsApi } from "../api/todolistsApi"
import { Todolist } from "../api/todolistsApi.types"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValuesType
  entityStatus: RequestStatus
}

const createSliceWithThunks = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })

export const todolistsSlice = createSliceWithThunks({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null }>()
    return {
      changeTodolistFilter: create.reducer<{ id: string; filter: FilterValuesType }>((state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        if (index !== -1) {
          state[index].filter = action.payload.filter
        }
      }),
      changeTodolistEntityStatus: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        if (index !== -1) {
          state[index].entityStatus = action.payload.entityStatus
        }
      }),
      clearTodolists: create.reducer(() => {
        return []
      }),
      fetchTodolists: createAThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await todolistsApi.getTodolists()
            dispatch(setAppStatus({ status: "succeeded" }))
            return { todolists: res.data }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (_, action) => {
            return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
          },
        },
      ),
      removeTodolist: createAThunk(
        async (id: string, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            dispatch(changeTodolistEntityStatus({ id, entityStatus: "loading" }))
            const res = await todolistsApi.deleteTodolist(id)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }))
              return { id }
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
            const index = state.findIndex((tl) => tl.id === action.payload.id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          },
        },
      ),
      updateTodolistTitle: createAThunk(
        async (arg: { id: string; title: string }, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await todolistsApi.updateTodolist(arg)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }))
              return arg
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
            const index = state.findIndex((tl) => tl.id === action.payload.id)
            if (index !== -1) {
              state[index].title = action.payload.title
            }
          },
        },
      ),
      addTodolist: createAThunk(
        async (title: string, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await todolistsApi.createTodolist(title)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }))
              return { todolist: res.data.data.item }
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
            state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
          },
        },
      ),
    }
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const {
  removeTodolist,
  addTodolist,
  changeTodolistEntityStatus,
  changeTodolistFilter,
  updateTodolistTitle,
  clearTodolists,
  fetchTodolists,
} = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer
