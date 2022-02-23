export interface AuthState {
    isAuthenticated: boolean;
    user: string[];
    token: string | null;
    refreshToken: string | null;
    idToken: string | null;
}
