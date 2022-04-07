export default interface AuthState {
    isAuthenticated: boolean;
    user?: object;
    token?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
}
