import api from "./api";
import { User } from "@mf-enterprise/event-bus";

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", { email, password });
    return response.data;
  },

  async register(email: string, password: string, name: string): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/auth/register", { email, password, name });
    return response.data;
  },

  async me(token: string): Promise<User> {
    const response = await api.get<User>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.put<User>("/auth/profile", data);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.post("/auth/change-password", data);
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  }
};
