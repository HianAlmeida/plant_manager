import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

type User = {
    username: string;
    password: string;
};

type NewUser = User & {
    first_name: string,
    last_name: string,
    email: string,
};

type UserBasicInfo = {
    id: string;
    username: string;
    email: string;
};

type UserProfileData = {
    name: string;
    email: string;
};

type AuthApiState = {
    basicUserInfo?: UserBasicInfo | null;
    userProfileData?: UserProfileData | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
};

const initialState: AuthApiState = {
    basicUserInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo") as string)
        : null,
    userProfileData: undefined,
    status: "idle",
    error: null,
};

export const login = createAsyncThunk("login", async (data: User) => {
    const response = await axiosInstance.post("/auth/login/", data);
    const resData = response.data;

    localStorage.setItem("userInfo", JSON.stringify(resData));

    return resData;
});

export const register = createAsyncThunk("register", async (data: NewUser) => {
    const response = await axiosInstance.post(
        "/auth/register/",
        data
    );
    const resData = response.data;

    // localStorage.setItem("userInfo", JSON.stringify(resData));

    return resData;
});

export const logout = createAsyncThunk("logout", async () => {
    localStorage.removeItem("userInfo");

    return true;
});

export const getUser = createAsyncThunk(
    "users/profile",
    async (userId: string) => {
        const response = await axiosInstance.get(
            `/users/${userId}`
        );
        return response.data;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<UserBasicInfo>) => {
                    state.status = "idle";
                    state.basicUserInfo = action.payload;
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Login failed";
            })

            .addCase(register.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                register.fulfilled,
                (state, action: PayloadAction<UserBasicInfo>) => {
                    state.status = "idle";
                    // state.basicUserInfo = action.payload;
                }
            )
            .addCase(register.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Registration failed";
            })

            .addCase(logout.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.status = "idle";
                state.basicUserInfo = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Logout failed";
            })

            .addCase(getUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = "idle";
                state.userProfileData = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Get user profile data failed";
            });
    },
});

export default authSlice.reducer;