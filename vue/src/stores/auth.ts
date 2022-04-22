import {
  LOGIN_MUTATION,
  type LoginMutationResult,
  type LoginMutationVariables,
} from "@/apollo/mutations/auth";
import { ME_QUERY, type MeQueryResult } from "@/apollo/queries/auth";
import {
  deleteAccessToken,
  deleteRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/common/auth";
import type { User } from "@/models/user";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { useRouter } from "vue-router";

interface AuthStoreState {
  user: User | null;
}

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const state = reactive<AuthStoreState>({ user: null });

  function setTokens(accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  }

  async function fetchUser() {
    const { result } = useQuery<MeQueryResult>(ME_QUERY);
    if (result.value) {
      state.user = result.value.me;
    }
  }

  async function login(data: { email: string; password: string }) {
    const { mutate } = useMutation<LoginMutationResult, LoginMutationVariables>(
      LOGIN_MUTATION,
      { variables: data }
    );
    const response = await mutate();

    if (!response?.data) {
      throw new Error("Login failed");
    }

    const { accessToken, refreshToken } = response.data.login;
    setTokens(accessToken, refreshToken);
    await fetchUser();

    return {
      accessToken,
      refreshToken,
    };
  }

  async function logout() {
    deleteAccessToken();
    deleteRefreshToken();
    state.user = null;
    await router.push("/");
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
      logout,
      setUser,
    },
  };
});
