import {
  LOGIN_MUTATION,
  type LoginMutationResponse,
} from "@/apollo/mutations/auth";
import { ME_QUERY, type MeQueryResponse } from "@/apollo/queries/auth";
import { setAccessToken, setRefreshToken } from "@/common/auth";
import type { User } from "@/models/user";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import { reactive } from "vue";

interface AuthStoreState {
  user: User | null;
}

export const useAuthStore = defineStore("auth", () => {
  const state = reactive<AuthStoreState>({ user: null });

  function setTokens(accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  }

  function getUserData() {
    const { result } = useQuery<MeQueryResponse>(ME_QUERY);
    if (result.value) {
      state.user = result.value.me;
    }
  }

  async function login(email: string, password: string) {
    const { mutate } = useMutation<LoginMutationResponse>(LOGIN_MUTATION, {
      variables: { email, password },
    });
    const response = await mutate();

    if (!response?.data) {
      throw new Error("Login failed");
    }
    const { accessToken, refreshToken } = response.data.login;
    setTokens(accessToken, refreshToken);
    getUserData();

    return {
      accessToken,
      refreshToken,
    };
  }

  function setUser(user: User) {
    state.user = user;
  }

  return {
    state,
    getters: {
      user: () => state.user,
      loggedIn: () => !!state.user,
    },
    actions: {
      login,
      setUser,
    },
  };
});
