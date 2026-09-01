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
    if (loading || !title.trim() || courseId === '') return;
    setLoading(true);
    setError('');
    try {
      await api.createTask({
        title: title.trim(),
        description: '',
        status: 'TODO',
        courseId,
      });
      setTitle('');
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No fue posible crear la tarea');
      setLoading(false);
    }
  }

  async function changeStatus(task: Task, status: TaskStatus) {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await api.changeStatus(task.id, status);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No fue posible actualizar la tarea');
      setLoading(false);
    }
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

      {loading && (
        <div className="loading-banner" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <div><strong>Cargando información</strong><span>Consultando asignaturas y tareas…</span></div>
        </div>
      )}

      <section className="panel">
        <h2>Nueva tarea</h2>
        <form onSubmit={submit} className="form-row">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Preparar laboratorio JWT" disabled={loading} />
          <select value={courseId} onChange={e => setCourseId(Number(e.target.value))} disabled={loading}>
            {courses.map(course => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}
          </select>
          <button type="submit" disabled={loading}>Agregar</button>
        </form>
      </section>

      <section className="panel">
        <div className="section-title"><h2>Tareas</h2><button className="secondary" onClick={() => void reload()} disabled={loading}>{loading ? 'Cargando…' : 'Recargar'}</button></div>
        {error && <p className="error">{error}</p>}
        {!loading && !error && tasks.length === 0 && <p>No hay tareas.</p>}

        {loading && tasks.length === 0 && (
          <div className="skeleton-list" aria-hidden="true">
            {[1, 2, 3].map(item => <div className="skeleton-task" key={item}><span /><strong /><i /></div>)}
          </div>
        )}

        <div className={`task-list${loading && tasks.length > 0 ? ' is-refreshing' : ''}`}>
          {tasks.map(task => (
            <article className="task" key={task.id}>
              <div>
                <span className="course">{task.course.code}</span>
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
              </div>
              <select value={task.status} onChange={e => void changeStatus(task, e.target.value as TaskStatus)} disabled={loading}>
                {statuses.map(status => <option key={status}>{status}</option>)}
              </select>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
