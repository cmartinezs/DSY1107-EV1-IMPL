import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  courses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/api/courses`);
  }

  tasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/api/tasks`);
  }

  createTask(payload: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate?: string;
    courseId: number;
  }): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/api/tasks`, payload);
  }

  changeStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/api/tasks/${id}/status`, { status });
  }
}
