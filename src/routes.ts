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
    CREATE_EXAM: "/admin/exams/new",
    EXAM_DETAILS: (id: string) => `/admin/exams/${id}`,
    EDIT_EXAM: (id: string) => `/admin/exams/${id}/edit`,
    QUESTIONS: (examId: string) => `/admin/exams/${examId}/questions`,
    QUESTION_DETAILS: (examId: string, questionId: string) =>
      `/admin/exams/${examId}/questions/${questionId}`,
    CREATE_QUESTION: (examId: string) =>
      `/admin/exams/${examId}/questions/new`,
    EDIT_QUESTION: (examId: string, questionId: string) =>
      `/admin/exams/${examId}/questions/${questionId}/edit`,
    AUDIT_LOG: "/admin/audit-log",
    PROFILE: "/admin/profile",
    CHANGE_PASSWORD: "/admin/change-password",
  },
} as const;
