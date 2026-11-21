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
    ROOT: "/admin",
    DIPLOMAS: "/admin",
    CREATE_DIPLOMA: "/admin/diplomas/new",
    DIPLOMA_DETAILS: (id: string) => `/admin/diplomas/${id}`,
    EDIT_DIPLOMA: (id: string) => `/admin/diplomas/${id}/edit`,
    EXAMS: "/admin/exams",
    AUDIT_LOG: "/admin/audit-log",
    PROFILE: "/admin/profile",
    CHANGE_PASSWORD: "/admin/change-password",
  },
} as const;
