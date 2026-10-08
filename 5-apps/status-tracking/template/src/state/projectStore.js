import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { createDefaultProject, uid } from './defaultProject.js';

const STORAGE_KEY = 'project-plan-app:data';

/* --------------------------------------------------------------------------
 * Reducer — every mutation the UI can perform on the project document.
 * Paths are explicit so the template stays easy to extend per project.
 * ------------------------------------------------------------------------ */
function reducer(state, action) {
  switch (action.type) {
    case 'REPLACE_ALL':
      return action.project;

    case 'SET_DRAFT':
      return { ...state, draft: action.value };

    case 'SET_DOC_TITLE':
      return { ...state, docTitle: action.value };

    /* ----- Title slide ----- */
    case 'TITLE_SET':
      return { ...state, title: { ...state.title, [action.key]: action.value } };

    case 'TITLE_FIELD_SET': {
      const fields = state.title.fields.map((f) =>
        f.id === action.id ? { ...f, [action.key]: action.value } : f,
      );
      return { ...state, title: { ...state.title, fields } };
    }
    case 'TITLE_FIELD_ADD': {
      const fields = [...state.title.fields, { id: uid('f'), label: 'Label', value: 'Value' }];
      return { ...state, title: { ...state.title, fields } };
    }
    case 'TITLE_FIELD_REMOVE': {
      const fields = state.title.fields.filter((f) => f.id !== action.id);
      return { ...state, title: { ...state.title, fields } };
    }
    case 'TITLE_FIELD_MOVE': {
      const fields = [...state.title.fields];
      const idx = fields.findIndex((f) => f.id === action.id);
      const target = idx + action.dir;
      if (idx < 0 || target < 0 || target >= fields.length) return state;
      [fields[idx], fields[target]] = [fields[target], fields[idx]];
      return { ...state, title: { ...state.title, fields } };
    }

    /* ----- Overview ----- */
    case 'OVERVIEW_SET':
      return { ...state, overview: { ...state.overview, [action.key]: action.value } };

    case 'GOAL_ADD':
      return {
        ...state,
        overview: {
          ...state.overview,
          goals: [
            ...state.overview.goals,
            { id: uid('g'), label: 'Goal', text: 'New goal or objective', tier: 2 },
          ],
        },
      };
    case 'GOAL_SET': {
      const goals = state.overview.goals.map((g) =>
        g.id === action.id ? { ...g, [action.key]: action.value } : g,
      );
      return { ...state, overview: { ...state.overview, goals } };
    }
    case 'GOAL_REMOVE': {
      const goals = state.overview.goals.filter((g) => g.id !== action.id);
      return { ...state, overview: { ...state.overview, goals } };
    }

    case 'SCOPE_ADD': {
      const list = action.list === 'in' ? 'inScope' : 'outOfScope';
      const scope = {
        ...state.overview.scope,
        [list]: [...state.overview.scope[list], { id: uid('s'), text: action.text }],
      };
      return { ...state, overview: { ...state.overview, scope } };
    }
    case 'SCOPE_SET': {
      const list = action.list === 'in' ? 'inScope' : 'outOfScope';
      const scope = {
        ...state.overview.scope,
        [list]: state.overview.scope[list].map((s) =>
          s.id === action.id ? { ...s, text: action.text } : s,
        ),
      };
      return { ...state, overview: { ...state.overview, scope } };
    }
    case 'SCOPE_REMOVE': {
      const list = action.list === 'in' ? 'inScope' : 'outOfScope';
      const scope = {
        ...state.overview.scope,
        [list]: state.overview.scope[list].filter((s) => s.id !== action.id),
      };
      return { ...state, overview: { ...state.overview, scope } };
    }

    case 'STAKEHOLDER_ADD': {
      const stakeholders = [
        ...state.overview.stakeholders,
        { id: uid('c'), name: action.name, role: action.role, email: action.email || '' },
      ];
      return { ...state, overview: { ...state.overview, stakeholders } };
    }
    case 'STAKEHOLDER_SET': {
      const stakeholders = state.overview.stakeholders.map((c) =>
        c.id === action.id ? { ...c, [action.key]: action.value } : c,
      );
      return { ...state, overview: { ...state.overview, stakeholders } };
    }
    case 'STAKEHOLDER_REMOVE': {
      const stakeholders = state.overview.stakeholders.filter((c) => c.id !== action.id);
      return { ...state, overview: { ...state.overview, stakeholders } };
    }

    case 'TIMELINE_ADD': {
      const timeline = sortTimeline([
        ...state.overview.timeline,
        { id: uid('t'), date: action.date, tag: action.tag, desc: action.desc },
      ]);
      return { ...state, overview: { ...state.overview, timeline } };
    }
    case 'TIMELINE_SET': {
      const timeline = sortTimeline(
        state.overview.timeline.map((t) =>
          t.id === action.id ? { ...t, [action.key]: action.value } : t,
        ),
      );
      return { ...state, overview: { ...state.overview, timeline } };
    }
    case 'TIMELINE_REMOVE': {
      const timeline = state.overview.timeline.filter((t) => t.id !== action.id);
      return { ...state, overview: { ...state.overview, timeline } };
    }

    /* ----- Weekly goal slides ----- */
    case 'WEEK_ADD': {
      const n = state.weeks.length + 1;
      const weeks = [
        ...state.weeks,
        { id: uid('w'), eyebrow: `Week ${n}`, title: `Week ${n} — Goals & Tasks`, goals: [], tasks: [] },
      ];
      return { ...state, weeks };
    }
    case 'WEEK_REMOVE': {
      if (state.weeks.length <= 1) return state;
      return { ...state, weeks: state.weeks.filter((w) => w.id !== action.weekId) };
    }
    case 'WEEK_SET': {
      const weeks = state.weeks.map((w) =>
        w.id === action.weekId ? { ...w, [action.key]: action.value } : w,
      );
      return { ...state, weeks };
    }

    case 'WGOAL_ADD': {
      const weeks = state.weeks.map((w) =>
        w.id === action.weekId
          ? {
              ...w,
              goals: [
                ...w.goals,
                {
                  id: uid('wg'),
                  title: action.title || 'New goal',
                  desc: action.desc || '',
                  status: 'not-started',
                  importance: 'med',
                  contacts: [],
                },
              ],
            }
          : w,
      );
      return { ...state, weeks };
    }
    case 'WGOAL_SET': {
      const weeks = state.weeks.map((w) =>
        w.id === action.weekId
          ? {
              ...w,
              goals: w.goals.map((g) =>
                g.id === action.goalId ? { ...g, [action.key]: action.value } : g,
              ),
            }
          : w,
      );
      return { ...state, weeks };
    }
    case 'WGOAL_REMOVE': {
      const weeks = state.weeks.map((w) =>
        w.id === action.weekId
          ? {
              ...w,
              goals: w.goals.filter((g) => g.id !== action.goalId),
              // Orphaned tasks become unlinked rather than deleted.
              tasks: w.tasks.map((t) => (t.goalId === action.goalId ? { ...t, goalId: null } : t)),
            }
          : w,
      );
      return { ...state, weeks };
    }

    case 'TASK_ADD': {
      const weeks = state.weeks.map((w) =>
        w.id === action.weekId
          ? {
              ...w,
              tasks: [
                ...w.tasks,
                { id: uid('t'), goalId: action.goalId || null, text: action.text || 'New task', done: false, ownerId: null },
              ],
            }
          : w,
      );
      return { ...state, weeks };
    }
    case 'TASK_SET': {
      const weeks = state.weeks.map((w) =>
        w.id === action.weekId
          ? {
              ...w,
              tasks: w.tasks.map((t) =>
                t.id === action.taskId ? { ...t, [action.key]: action.value } : t,
              ),
            }
          : w,
      );
      return { ...state, weeks };
    }
    case 'TASK_TOGGLE': {
      const weeks = state.weeks.map((w) =>
        w.id === action.weekId
          ? {
              ...w,
              tasks: w.tasks.map((t) =>
                t.id === action.taskId ? { ...t, done: !t.done } : t,
              ),
            }
          : w,
      );
      return { ...state, weeks };
    }
    case 'TASK_REMOVE': {
      const weeks = state.weeks.map((w) =>
        w.id === action.weekId
          ? { ...w, tasks: w.tasks.filter((t) => t.id !== action.taskId) }
          : w,
      );
      return { ...state, weeks };
    }

    default:
      return state;
  }
}

/** Timeline is always stored date-ordered (ISO yyyy-mm-dd ascending). */
function sortTimeline(items) {
  return [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

/* --------------------------------------------------------------------------
 * Context + persistence
 * ------------------------------------------------------------------------ */
const ProjectContext = createContext(null);

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted storage — fall through to template */
  }
  return createDefaultProject();
}

export function ProjectProvider({ children }) {
  const [project, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  const value = useMemo(() => ({ project, dispatch }), [project]);
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used inside <ProjectProvider>');
  return ctx;
}

/** Reset the whole document back to the blank template. */
export function resetProject(dispatch) {
  dispatch({ type: 'REPLACE_ALL', project: createDefaultProject() });
}
