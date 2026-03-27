export interface AppUser {
  id: string;
  username: string;
  displayName: string;
  role: "admin" | "operator";
  passwordHash: string;
}

const STORAGE_KEY = "inspreop_users_v1";
const SESSION_KEY = "inspreop_session_v1";

function hashPassword(pw: string): string {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) {
    h = ((h << 5) + h) ^ pw.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

function getDefaultUsers(): AppUser[] {
  return [
    {
      id: "admin",
      username: "admin",
      displayName: "Administrador",
      role: "admin",
      passwordHash: hashPassword("admin1234"),
    },
  ];
}

export function getUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultUsers();
    return JSON.parse(raw) as AppUser[];
  } catch {
    return getDefaultUsers();
  }
}

export function saveUsers(users: AppUser[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function login(username: string, password: string): AppUser | null {
  const users = getUsers();
  const hash = hashPassword(password);
  const user = users.find((u) => u.username === username && u.passwordHash === hash);
  if (!user) return null;
  localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): AppUser | null {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    const users = getUsers();
    return users.find((u) => u.id === id) ?? null;
  } catch {
    return null;
  }
}

export function createUser(
  username: string,
  displayName: string,
  password: string,
  role: "admin" | "operator" = "operator"
): AppUser {
  const users = getUsers();
  const id = `user_${Date.now()}`;
  const newUser: AppUser = {
    id,
    username,
    displayName,
    role,
    passwordHash: hashPassword(password),
  };
  saveUsers([...users, newUser]);
  return newUser;
}

export function deleteUser(id: string): void {
  if (id === "admin") return;
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
}

export { hashPassword };
