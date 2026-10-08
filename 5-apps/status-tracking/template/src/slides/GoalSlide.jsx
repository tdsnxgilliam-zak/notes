import { useState } from 'react';
import EditableText from '../components/EditableText.jsx';
import Modal, { Field } from '../components/Modal.jsx';
import { SlideHeader, SlideFooter, TargetIcon, ListChecksIcon } from '../components/SlideChrome.jsx';
import { initialsOf } from '../components/ContactCard.jsx';
import { useProject } from '../state/projectStore.js';
import {
  STATUS_OPTIONS,
  IMPORTANCE_OPTIONS,
  goalProgress,
  goalStatus,
  weekProgress,
} from '../state/defaultProject.js';

/**
 * Weekly goal slide — pixel-matched to Figma frames 2:61/2:118/2:175/2:232.
 * Left column: goal cards (click to expand, metadata + derived progress).
 * Right column: task/deliverable checkboxes, each optionally owned by a contact.
 */
export default function GoalSlide({ week, pageNum }) {
  const { project, dispatch } = useProject();
  const [goalModal, setGoalModal] = useState(false);
  const [form, setForm] = useState({ title: '', desc: '' });

  const pct = weekProgress(week);

  const addGoal = () => {
    if (form.title.trim()) {
      dispatch({ type: 'WGOAL_ADD', weekId: week.id, title: form.title.trim(), desc: form.desc.trim() });
    }
    setForm({ title: '', desc: '' });
    setGoalModal(false);
  };

  return (
    <>
      <SlideHeader
        eyebrow={week.eyebrow}
        title={week.title}
        onEyebrow={(v) => dispatch({ type: 'WEEK_SET', weekId: week.id, key: 'eyebrow', value: v })}
        onTitle={(v) => dispatch({ type: 'WEEK_SET', weekId: week.id, key: 'title', value: v })}
      />

      <div className="week-grid">
        {/* ---- Weekly Goals column ---- */}
        <div className="section-box">
          <div className="section-head">
            <TargetIcon />
            <span className="section-title">Weekly Goals</span>
            <span className="spacer" />
            {pct !== null && <span className="week-progress">{Math.round(pct * 100)}% complete</span>}
          </div>

          {week.goals.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <div className="plus">+</div>
              <div className="empty-title">Add main weekly objectives and goals here</div>
              <div className="empty-sub">Only a title and short description are required.</div>
            </div>
          ) : (
            <div className="task-list">
              {week.goals.map((g) => (
                <GoalCard key={g.id} week={week} goal={g} />
              ))}
            </div>
          )}
          <button className="add-btn" style={{ marginTop: 16 }} onClick={() => setGoalModal(true)}>
            + Add goal
          </button>
        </div>

        {/* ---- Key Tasks & Deliverables column ---- */}
        <div className="section-box">
          <div className="section-head">
            <ListChecksIcon />
            <span className="section-title">Key Tasks &amp; Deliverables</span>
          </div>
          <TaskList week={week} />
        </div>
      </div>

      <SlideFooter docTitle={project.docTitle} pageNum={pageNum} />

      {goalModal && (
        <Modal title="Add weekly goal" onSubmit={addGoal} onClose={() => setGoalModal(false)} disableSubmit={!form.title.trim()}>
          <Field label="Title (required)">
            <input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Goal title" />
          </Field>
          <Field label="Short description (required)">
            <textarea rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="One or two sentences" />
          </Field>
        </Modal>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ Goal card
 * Click to expand: description, status, importance, contacts, and the
 * progress derived from linked tasks/deliverables.
 * ------------------------------------------------------------------------- */
function GoalCard({ week, goal }) {
  const { project, dispatch } = useProject();
  const [expanded, setExpanded] = useState(false);

  const set = (key, value) => dispatch({ type: 'WGOAL_SET', weekId: week.id, goalId: goal.id, key, value });
  const progress = goalProgress(goal.id, week.tasks);
  const status = goalStatus(goal, week.tasks);
  const contacts = project.overview.stakeholders;
  const linkedContacts = contacts.filter((c) => goal.contacts.includes(c.id));

  const cycle = (options, current) => options[(options.indexOf(current) + 1) % options.length];

  return (
    <div className={`wgoal-card ${expanded ? 'expanded' : ''}`} onClick={() => !expanded && setExpanded(true)}>
      <div className="wgoal-head">
        <EditableText
          className={`wgoal-title imp-${goal.importance}`}
          value={goal.title}
          placeholder="Goal title"
          onCommit={(v) => set('title', v)}
        />
        {expanded && (
          <>
            <button className="icon-btn danger" title="Remove goal" onClick={() => dispatch({ type: 'WGOAL_REMOVE', weekId: week.id, goalId: goal.id })}>
              ×
            </button>
            <button className="icon-btn" title="Collapse" onClick={() => setExpanded(false)}>
              −
            </button>
          </>
        )}
      </div>

      <div className="wgoal-meta">
        <span
          className={`chip status-${status}`}
          title={progress === null ? 'Click to change status' : 'Derived from linked tasks'}
          onClick={(e) => {
            e.stopPropagation();
            if (progress === null) set('status', cycle(STATUS_OPTIONS, goal.status || 'not-started'));
          }}
        >
          {status.replace('-', ' ')}
        </span>
        <span
          className={`chip imp-${goal.importance}`}
          title="Click to change importance"
          onClick={(e) => {
            e.stopPropagation();
            set('importance', cycle(IMPORTANCE_OPTIONS, goal.importance));
          }}
        >
          {goal.importance}
        </span>
        {linkedContacts.map((c) => (
          <span className="chip" key={c.id} title={c.role}>
            {initialsOf(c.name)} · {c.name}
          </span>
        ))}
      </div>

      {progress !== null && (
        <div onClick={(e) => e.stopPropagation()}>
          <div className="progress-track">
            <div className={`progress-fill ${progress === 1 ? 'done' : ''}`} style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <div className="progress-label">
            {week.tasks.filter((t) => t.goalId === goal.id && t.done).length}/
            {week.tasks.filter((t) => t.goalId === goal.id).length} tasks · {Math.round(progress * 100)}%
          </div>
        </div>
      )}

      {expanded && (
        <div className="wgoal-detail" onClick={(e) => e.stopPropagation()}>
          <EditableText
            as="div"
            multiline
            className="wgoal-desc"
            value={goal.desc}
            placeholder="Short description"
            onCommit={(v) => set('desc', v)}
          />
          <div className="modal-field" style={{ marginBottom: 0 }}>
            <label>Contacts</label>
            <select
              value=""
              onChange={(e) => {
                if (!e.target.value) return;
                const next = goal.contacts.includes(e.target.value)
                  ? goal.contacts.filter((id) => id !== e.target.value)
                  : [...goal.contacts, e.target.value];
                set('contacts', next);
              }}
            >
              <option value="">Toggle a stakeholder…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {goal.contacts.includes(c.id) ? '✓ ' : ''}
                  {c.name} — {c.role}
                </option>
              ))}
            </select>
            {contacts.length === 0 && (
              <div className="empty-sub" style={{ marginTop: 6 }}>
                Add stakeholders on the overview slide first.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Task list
 * Checkboxes linked to goals. Owner is optional and rendered as a contact tag.
 * ------------------------------------------------------------------------- */
function TaskList({ week }) {
  const { project, dispatch } = useProject();
  const [taskModal, setTaskModal] = useState(false);
  const [ownerPickerFor, setOwnerPickerFor] = useState(null);
  const [form, setForm] = useState({ text: '', goalId: '' });
  const contacts = project.overview.stakeholders;

  const addTask = () => {
    if (form.text.trim()) {
      dispatch({ type: 'TASK_ADD', weekId: week.id, text: form.text.trim(), goalId: form.goalId || null });
    }
    setForm({ text: '', goalId: '' });
    setTaskModal(false);
  };

  const ownerOf = (id) => contacts.find((c) => c.id === id);

  return (
    <>
      {week.tasks.length === 0 ? (
        <div className="empty-state" style={{ minHeight: 200 }}>
          <div className="empty-title">No tasks yet</div>
          <div className="empty-sub">Tasks and deliverables are checkboxes that roll up to goal progress.</div>
        </div>
      ) : (
        <div className="task-list">
          {week.tasks.map((t, i) => {
            const owner = ownerOf(t.ownerId);
            const goal = week.goals.find((g) => g.id === t.goalId);
            return (
              <div className={`task-row ${t.done ? 'done' : ''}`} key={t.id}>
                <button
                  className={`task-num ${t.done ? 'done' : ''}`}
                  title={t.done ? 'Mark incomplete' : 'Mark complete'}
                  onClick={() => dispatch({ type: 'TASK_TOGGLE', weekId: week.id, taskId: t.id })}
                >
                  {t.done ? '✓' : i + 1}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <EditableText
                    className="task-text"
                    value={t.text}
                    placeholder="Task"
                    onCommit={(v) => dispatch({ type: 'TASK_SET', weekId: week.id, taskId: t.id, key: 'text', value: v })}
                  />
                  {goal && (
                    <div className="contact-role" title="Linked goal">
                      → {goal.title}
                    </div>
                  )}
                </div>
                <span
                  className={`owner-tag ${owner ? '' : 'unassigned'}`}
                  title={owner ? `${owner.name} — ${owner.role}` : 'Assign an owner (optional)'}
                  onClick={() => setOwnerPickerFor(t.id)}
                >
                  {owner ? `@${owner.name}` : '@ owner'}
                </span>
                <button
                  className="icon-btn danger"
                  title="Remove task"
                  onClick={() => dispatch({ type: 'TASK_REMOVE', weekId: week.id, taskId: t.id })}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
      <button className="add-btn" style={{ marginTop: 16 }} onClick={() => setTaskModal(true)}>
        + Add task
      </button>

      {taskModal && (
        <Modal title="Add task / deliverable" onSubmit={addTask} onClose={() => setTaskModal(false)} disableSubmit={!form.text.trim()}>
          <Field label="Task">
            <input autoFocus value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="What needs to be done" />
          </Field>
          <Field label="Related goal (optional)">
            <select value={form.goalId} onChange={(e) => setForm({ ...form, goalId: e.target.value })}>
              <option value="">None</option>
              {week.goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </Field>
        </Modal>
      )}

      {ownerPickerFor && (
        <Modal
          title="Assign owner"
          submitLabel="Done"
          onSubmit={() => setOwnerPickerFor(null)}
          onClose={() => setOwnerPickerFor(null)}
        >
          <Field label="Owner (optional)">
            <select
              autoFocus
              value={week.tasks.find((t) => t.id === ownerPickerFor)?.ownerId || ''}
              onChange={(e) =>
                dispatch({ type: 'TASK_SET', weekId: week.id, taskId: ownerPickerFor, key: 'ownerId', value: e.target.value || null })
              }
            >
              <option value="">Unassigned</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.role}
                </option>
              ))}
            </select>
            {contacts.length === 0 && (
              <div className="empty-sub" style={{ marginTop: 6 }}>
                Add stakeholders on the overview slide first.
              </div>
            )}
          </Field>
        </Modal>
      )}
    </>
  );
}
