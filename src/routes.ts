export const ROUTES = {
  HOME: "/",
  DIPLOMAS: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forget-password",
    RESET_PASSWORD: "/reset-password",
  },
  EXAMS: {
    ROOT: "/exams",
    BY_DIPLOMA: (diplomaId: string) => `/exams?diplomaId=${diplomaId}`,
    DETAILS: (id: string) => `/exams/${id}`,
  },
  QUESTIONS: "/questions",
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  ADMIN: {
    ROOT: "/dashboard",
    DIPLOMAS: "/dashboard",
    DIPLOMA_DETAILS: (id: string) => `/dashboard/diplomas/${id}`,
    EXAMS: "/exams",
    AUDIT_LOG: "/dashboard/audit-log",
    PROFILE: "/profile",
    CHANGE_PASSWORD: "/change-password",
  },
} as const;
