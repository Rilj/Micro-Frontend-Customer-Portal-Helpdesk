import React, { useState, useEffect } from "react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Avatar, AvatarImage, AvatarFallback } from "@mf-enterprise/ui-components";
import { authApi } from "../services/auth";
import { eventBus, User } from "@mf-enterprise/event-bus";

export const ProfileSettings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      authApi.me(token).then(setUser).catch(() => {});
    }

    const unsubscribe = eventBus.on("auth", () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        authApi.me(token).then(setUser).catch(() => {});
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const updated = await authApi.updateProfile({ name, email });
      setUser(updated);
      setSuccess("Profile updated successfully");
      eventBus.emit("auth", { user: updated });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setError("Both password fields are required");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setSuccess("Password changed successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    eventBus.emit("auth", { user: null });
    window.dispatchEvent(new CustomEvent("auth:logout"));
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <Button onClick={handleProfileUpdate} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button onClick={handlePasswordChange} disabled={isLoading}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button variant="destructive" onClick={handleLogout}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
