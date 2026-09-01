import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService, Course, Task, TaskStatus } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="shell">
      <header>
        <div>
          <span class="eyebrow">DSY1107 · EV1</span>
          <h1>AulaTrack</h1>
          <p>Cliente Angular conectado al backend compartido.</p>
        </div>
        <div class="metric"><strong>{{ pendingCount }}</strong><span>pendientes</span></div>
      </header>

      <section class="panel">
        <h2>Nueva tarea</h2>
        <form class="form-row" (ngSubmit)="createTask()">
          <input [(ngModel)]="title" name="title" placeholder="Ej. Preparar laboratorio JWT" />
          <select [(ngModel)]="courseId" name="courseId">
            <option *ngFor="let course of courses" [ngValue]="course.id">
              {{ course.code }} · {{ course.name }}
            </option>
          </select>
          <button type="submit">Agregar</button>
        </form>
      </section>

      <section class="panel">
        <div class="section-title">
          <h2>Tareas</h2>
          <button class="secondary" type="button" (click)="reload()">Recargar</button>
        </div>
        <p *ngIf="loading">Cargando…</p>
        <p class="error" *ngIf="error">{{ error }}</p>
        <p *ngIf="!loading && !error && tasks.length === 0">No hay tareas.</p>

        <div class="task-list">
          <article class="task" *ngFor="let task of tasks">
            <div>
              <span class="course">{{ task.course.code }}</span>
              <h3>{{ task.title }}</h3>
              <p *ngIf="task.description">{{ task.description }}</p>
            </div>
            <select [ngModel]="task.status" (ngModelChange)="changeStatus(task, $event)">
              <option *ngFor="let status of statuses" [ngValue]="status">{{ status }}</option>
            </select>
          </article>
        </div>
      </section>
    `,
})
export class AppComponent implements OnInit {
  courses: Course[] = [];
  tasks: Task[] = [];
  loading = true;
  error = '';
  title = '';
  courseId: number | null = null;
  readonly statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.reload();
  }

  get pendingCount(): number {
    return this.tasks.filter(task => task.status !== 'DONE').length;
  }

  reload(): void {
    this.loading = true;
    this.error = '';
    forkJoin({ courses: this.api.courses(), tasks: this.api.tasks() }).subscribe({
      next: ({ courses, tasks }) => {
        this.courses = courses;
        this.tasks = tasks;
        this.courseId ??= courses[0]?.id ?? null;
        this.loading = false;
      },
      error: () => {
        this.error = 'No fue posible cargar la API';
        this.loading = false;
      },
    });
  }

  createTask(): void {
    if (!this.title.trim() || this.courseId === null) return;
    this.api.createTask({
      title: this.title.trim(),
      description: '',
      status: 'TODO',
      courseId: this.courseId,
    }).subscribe(() => {
      this.title = '';
      this.reload();
    });
  }

  changeStatus(task: Task, status: TaskStatus): void {
    this.api.changeStatus(task.id, status).subscribe(() => this.reload());
  }
}
