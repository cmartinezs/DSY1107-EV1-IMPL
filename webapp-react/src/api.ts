export type Course = {
  id: number;
  code: string;
  name: string;
  active: boolean;
};

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  course: Course;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  courses: () => request<Course[]>('/api/courses'),
  tasks: () => request<Task[]>('/api/tasks'),
  createTask: (payload: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate?: string;
    courseId: number;
  }) => request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  changeStatus: (id: number, status: TaskStatus) => request<Task>(`/api/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};
