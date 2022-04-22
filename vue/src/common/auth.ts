import decodeJWT, { type JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";

const accessTokenKey = "auth.token";
const refreshTokenKey = "auth.refreshToken";

export function getAccessToken() {
  return Cookies.get(accessTokenKey);
}

export function getRefreshToken() {
  return Cookies.get(refreshTokenKey);
}

export function setAccessToken(token: string) {
  Cookies.set(accessTokenKey, token, { expires: 1 });
}

export function setRefreshToken(token: string) {
  const claims: JwtPayload = decodeJWT(token);
  const maxAge = 60 * 24 * 60 * 1;
  let expDate: Date | undefined;
  if (claims.exp) {
    expDate = new Date(claims.exp * 1000);
  }
  Cookies.set(refreshTokenKey, token, { expires: expDate || maxAge });
}

export function deleteAccessToken() {
  Cookies.remove(accessTokenKey);
}

export function deleteRefreshToken() {
  Cookies.remove(refreshTokenKey);
}
