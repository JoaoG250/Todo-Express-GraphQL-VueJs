import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  type LoginMutationResult,
  type LoginMutationVariables,
  type RegisterMutationResult,
  type RegisterMutationVariables,
} from "@/apollo/mutations/auth";
import { ME_QUERY, type MeQueryResult } from "@/apollo/queries/auth";
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/common/auth";
import type { User } from "@/models/user";
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import { computed, reactive } from "vue";

interface AuthStoreState {
  user: User | null;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export const useAuthStore = defineStore("auth", () => {
  const state = reactive<AuthStoreState>({
    user: null,
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  });
  const loggedIn = computed(() => !!state.accessToken);
  const { onResult: onFetchResult } = useQuery<MeQueryResult>(ME_QUERY, null, {
    enabled: loggedIn.value,
    fetchPolicy: "network-only",
  });

  onFetchResult((result) => {
    state.user = result.data.me;
  });

  function setTokens(accessToken: string, refreshToken: string) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  }

  function clearTokens() {
    state.accessToken = undefined;
    state.refreshToken = undefined;
    deleteAccessToken();
    deleteRefreshToken();
  }

  async function fetchUser() {
    const { result } = useQuery<MeQueryResult>(ME_QUERY, null, {
      fetchPolicy: "network-only",
    });
    const user = useResult(result, null, (data) => data.me);
    state.user = user.value;
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

  async function register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const { mutate } = useMutation<
      RegisterMutationResult,
      RegisterMutationVariables
    >(REGISTER_MUTATION, { variables: data });
    const response = await mutate();

    if (!response?.data) {
      throw new Error("Register failed");
    }

    return response.data.register;
  }

  async function logout() {
    clearTokens();
    state.user = null;
  }

  function setUser(user: User) {
    state.user = user;
  }

  return {
    state,
    getters: {
      loggedIn: () => loggedIn.value,
    },
    actions: {
      login,
      register,
      logout,
      setUser,
    },
  };
});
