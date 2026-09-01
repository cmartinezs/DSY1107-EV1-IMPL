import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api, Course, Task, TaskStatus } from './api';
import './styles.css';

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState<number | ''>('');

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const [courseData, taskData] = await Promise.all([api.courses(), api.tasks()]);
      setCourses(courseData);
      setTasks(taskData);
      if (courseId === '' && courseData.length > 0) setCourseId(courseData[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No fue posible cargar la API');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void reload(); }, []);

  const pendingCount = useMemo(() => tasks.filter(task => task.status !== 'DONE').length, [tasks]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || courseId === '') return;
    await api.createTask({
      title: title.trim(),
      description: '',
      status: 'TODO',
      courseId,
    });
    setTitle('');
    await reload();
  }

  async function changeStatus(task: Task, status: TaskStatus) {
    await api.changeStatus(task.id, status);
    await reload();
  }

  return (
    <main className="shell">
      <header>
        <div>
          <span className="eyebrow">DSY1107 · EV1</span>
          <h1>AulaTrack</h1>
          <p>Cliente React conectado al backend compartido.</p>
        </div>
        <div className="metric"><strong>{pendingCount}</strong><span>pendientes</span></div>
      </header>

      <section className="panel">
        <h2>Nueva tarea</h2>
        <form onSubmit={submit} className="form-row">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Preparar laboratorio JWT" />
          <select value={courseId} onChange={e => setCourseId(Number(e.target.value))}>
            {courses.map(course => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}
          </select>
          <button type="submit">Agregar</button>
        </form>
      </section>

      <section className="panel">
        <div className="section-title"><h2>Tareas</h2><button className="secondary" onClick={() => void reload()}>Recargar</button></div>
        {loading && <p>Cargando…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && tasks.length === 0 && <p>No hay tareas.</p>}
        <div className="task-list">
          {tasks.map(task => (
            <article className="task" key={task.id}>
              <div>
                <span className="course">{task.course.code}</span>
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
              </div>
              <select value={task.status} onChange={e => void changeStatus(task, e.target.value as TaskStatus)}>
                {statuses.map(status => <option key={status}>{status}</option>)}
              </select>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
