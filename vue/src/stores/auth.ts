import {
  LOGIN_MUTATION,
  type LoginMutationResult,
  type LoginMutationVariables,
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
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

interface AuthStoreState {
  user: User | null;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const state = reactive<AuthStoreState>({
    user: null,
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  });

  onMounted(() => {
    if (state.accessToken) {
      const { onResult } = useQuery<MeQueryResult>(ME_QUERY);
      onResult((result) => {
        state.user = result.data.me;
      });
    }
  });

  function setTokens(accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  }

  async function fetchUser() {
    const { result } = useQuery<MeQueryResult>(ME_QUERY);
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
      loggedIn: () => !!state.user,
    },
    actions: {
      login,
      logout,
      setUser,
    },
  };
});
