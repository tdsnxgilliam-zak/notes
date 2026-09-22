/**
 * Default template data for a new project.
 * Everything here is directly modifiable in the app; this is only the
 * starting point a copied project begins from.
 */

export const STATUS_OPTIONS = ['not-started', 'in-progress', 'blocked', 'done'];
export const IMPORTANCE_OPTIONS = ['high', 'med', 'low'];
export const GOAL_TIERS = [1, 2, 3]; // typographic weight tiers for goal/objective items

let uidCounter = 0;
export function uid(prefix = 'id') {
  uidCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${uidCounter}`;
}

export function createDefaultProject() {
  return {
    docTitle: 'Project Plan — Template',
    draft: true, // DRAFT badge (config.json defaults.status / statusColor)

    title: {
      eyebrow: 'Project Roadmap',
      classification: '[INTERNAL USE ONLY]',
      mainTitle: 'Project Title',
      subtitle: 'One-line description of what this project delivers.',
      // Fields are reorderable and removable on the title slide.
      fields: [
        { id: uid('f'), label: 'Prepared For', value: '[Client / Stakeholder Name]' },
        { id: uid('f'), label: 'Project Lead', value: '[Author / Team Name]' },
        { id: uid('f'), label: 'Date', value: new Date().toLocaleDateString('en-US') },
      ],
    },

    overview: {
      eyebrow: 'Overview',
      title: 'Project Overview',
      // Goal & objective items with importance tiers (1 = heaviest type).
      goals: [
        {
          id: uid('g'),
          label: 'Goal',
          text: 'Describe the primary goal of the project.',
          tier: 1,
        },
        {
          id: uid('g'),
          label: 'Success criteria',
          text: 'What does "done" look like for the business?',
          tier: 2,
        },
      ],
      scope: {
        inScope: [{ id: uid('s'), text: 'Add an in-scope item' }],
        outOfScope: [{ id: uid('s'), text: 'Add an out-of-scope item' }],
      },
      // Contact cards — also used project-wide as the owner/contact pool.
      stakeholders: [],
      // Auto date-ordered: { date: ISO, tag: ONE-WORD TITLE, desc: SHORT DESC }
      timeline: [],
    },

    // Weekly goal slides. Status % is derived from linked tasks.
    weeks: [
      {
        id: uid('w'),
        eyebrow: 'Week 1',
        title: 'Week 1 — Goals & Tasks',
        goals: [],
        tasks: [],
      },
    ],
  };
}

/* ---------- Derived status helpers ---------- */

/** Completion fraction (0..1) of tasks linked to a goal. null when no tasks. */
export function goalProgress(goalId, tasks) {
  const linked = tasks.filter((t) => t.goalId === goalId);
  if (linked.length === 0) return null;
  return linked.filter((t) => t.done).length / linked.length;
}

/** Effective goal status: derived from tasks when linked tasks exist. */
export function goalStatus(goal, tasks) {
  const p = goalProgress(goal.id, tasks);
  if (p === null) return goal.status || 'not-started';
  if (p === 1) return 'done';
  if (p > 0) return 'in-progress';
  return 'not-started';
}

/** Weekly rollup: percentage derived from all tasks/deliverables. */
export function weekProgress(week) {
  if (week.tasks.length === 0) return null;
  return week.tasks.filter((t) => t.done).length / week.tasks.length;
}
