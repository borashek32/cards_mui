import { createSlice } from "@reduxjs/toolkit"
import {
  ArgForgotPasswordType,
  ArgLoginType,
  ArgRegisterType,
  ArgSetNewPasswordType,
  authApi, NewPassReqType,
  ProfileType, TokenResponseType
} from "features/auth/auth.api"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"


const register = createAppAsyncThunk<void, ArgRegisterType>
  ("auth/sign-up", async (arg) => {
    await authApi.register(arg)
  }
)
const login = createAppAsyncThunk<{ profile: ProfileType }, ArgLoginType>
  ("auth/login", async (arg) => {
    const res = await authApi.login(arg)
    return { profile: res.data }
  }
)
const logout = createAppAsyncThunk<void>
("auth/me", async () => {
    await authApi.logout()
  }
)
const forgotPassword = createAppAsyncThunk<TokenResponseType, ArgForgotPasswordType>
  ("auth/forgot-password", async (arg) => {
    const response = await authApi.forgotPassword(arg)
    console.log("slice ", response.data)
    return response.data
  }
)
const setNewPassword = createAppAsyncThunk<void, NewPassReqType>
  (`auth/set-new-password/:token`, async (arg) => {
    await authApi.setNewPassword(arg)
  }
)


const slice = createSlice({
  name: "auth",
  initialState: {
    profile: null as ProfileType | null,
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.profile = action.payload.profile
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.profile = null
        state.isLoggedIn = false
      })
  }
})

export const authThunks = { register, login, forgotPassword, setNewPassword, logout }
export const authReducer = slice.reducer