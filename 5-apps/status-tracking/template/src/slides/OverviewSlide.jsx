import { useState } from 'react';
import EditableText from '../components/EditableText.jsx';
import Modal, { Field } from '../components/Modal.jsx';
import ContactCard from '../components/ContactCard.jsx';
import { SlideHeader, SlideFooter, DraftBadge } from '../components/SlideChrome.jsx';
import { useProject } from '../state/projectStore.js';

/**
 * Project Overview — pixel-matched to Figma frame 2:32.
 * Four content cards in a 2x2 grid that grow vertically with their content:
 *   2:40 goal card | 2:44 scope card
 *   2:49 stakeholders | 2:53 timeline
 */
export default function OverviewSlide({ pageNum }) {
  const { project, dispatch } = useProject();
  const { overview } = project;

  return (
    <>
      <SlideHeader
        eyebrow={overview.eyebrow}
        title={overview.title}
        onEyebrow={(v) => dispatch({ type: 'OVERVIEW_SET', key: 'eyebrow', value: v })}
        onTitle={(v) => dispatch({ type: 'OVERVIEW_SET', key: 'title', value: v })}
      />
      <DraftBadge
        visible={project.draft}
        status="DRAFT"
        onToggle={() => dispatch({ type: 'SET_DRAFT', value: !project.draft })}
      />

      <div className="overview-grid">
        <GoalCard />
        <ScopeCard />
        <StakeholdersCard />
        <TimelineCard />
      </div>

      <SlideFooter docTitle={project.docTitle} pageNum={pageNum} />
    </>
  );
}

/* ---------------------------------------------------------------- Goal card
 * Goal & objective items with tiers of importance that change the
 * visual/typographic weight (1 = heaviest, 3 = lightest).
 * ------------------------------------------------------------------------- */
function GoalCard() {
  const { project, dispatch } = useProject();
  const { goals } = project.overview;

  return (
    <div className="content-card">
      <div className="card-title-row">
        <span className="card-accent-bar" />
        <span className="card-title large">Goal &amp; Objectives</span>
      </div>
      <div className="card-body">
        {goals.map((g) => (
          <div className="goal-item field-row" key={g.id}>
            <div className="field-controls">
              <span className="tier-picker" title="Importance tier (typographic weight)">
                {[1, 2, 3].map((t) => (
                  <button
                    key={t}
                    className={`tier-btn ${g.tier === t ? `on-${t}` : ''}`}
                    onClick={() => dispatch({ type: 'GOAL_SET', id: g.id, key: 'tier', value: t })}
                  >
                    {t}
                  </button>
                ))}
              </span>
              <button
                className="icon-btn danger"
                title="Remove"
                onClick={() => dispatch({ type: 'GOAL_REMOVE', id: g.id })}
              >
                ×
              </button>
            </div>
            <EditableText
              as="div"
              className="goal-label"
              value={g.label}
              placeholder="Label"
              onCommit={(v) => dispatch({ type: 'GOAL_SET', id: g.id, key: 'label', value: v })}
            />
            <EditableText
              as="div"
              multiline
              className={`goal-text tier-${g.tier}`}
              value={g.text}
              placeholder="Describe the goal"
              onCommit={(v) => dispatch({ type: 'GOAL_SET', id: g.id, key: 'text', value: v })}
            />
          </div>
        ))}
        <button className="add-btn" onClick={() => dispatch({ type: 'GOAL_ADD' })}>
          + Add goal / objective
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Scope card
 * In-scope / out-of-scope item lists. Items are added with a modal that
 * picks the list type, then edited inline and removed individually.
 * ------------------------------------------------------------------------- */
function ScopeCard() {
  const { project, dispatch } = useProject();
  const { scope } = project.overview;
  const [modalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState('in');
  const [text, setText] = useState('');

  const add = () => {
    if (text.trim()) dispatch({ type: 'SCOPE_ADD', list, text: text.trim() });
    setText('');
    setModalOpen(false);
  };

  const renderGroup = (which, label, items) => (
    <div className={`scope-group ${which}`}>
      <div className="scope-group-label">{label}</div>
      {items.map((item) => (
        <div className="scope-item" key={item.id}>
          <span className="scope-bullet" />
          <EditableText
            value={item.text}
            onCommit={(v) => dispatch({ type: 'SCOPE_SET', list: which, id: item.id, text: v })}
          />
          <button
            className="icon-btn danger"
            title="Remove item"
            onClick={() => dispatch({ type: 'SCOPE_REMOVE', list: which, id: item.id })}
          >
            ×
          </button>
        </div>
      ))}
      {items.length === 0 && <div className="empty-sub">No items yet.</div>}
    </div>
  );

  return (
    <div className="content-card">
      <div className="card-title-row">
        <span className="card-title">In Scope / Out of Scope</span>
      </div>
      <div className="card-body">
        {renderGroup('in', 'In scope', scope.inScope)}
        {renderGroup('out', 'Out of scope', scope.outOfScope)}
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          + Add item
        </button>
      </div>

      {modalOpen && (
        <Modal title="Add scope item" onSubmit={add} onClose={() => setModalOpen(false)} disableSubmit={!text.trim()}>
          <Field label="Type">
            <div className="radio-row">
              <div className={`radio-pill ${list === 'in' ? 'selected' : ''}`} onClick={() => setList('in')}>
                In scope
              </div>
              <div className={`radio-pill ${list === 'out' ? 'selected' : ''}`} onClick={() => setList('out')}>
                Out of scope
              </div>
            </div>
          </Field>
          <Field label="Item">
            <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. System education" />
          </Field>
        </Modal>
      )}
    </div>
  );
}

/* --------------------------------------------------------- Stakeholders card
 * Contact cards with name, role, and email. Stakeholders double as the
 * project-wide owner/contact pool for tasks and weekly goals.
 * ------------------------------------------------------------------------- */
function StakeholdersCard() {
  const { project, dispatch } = useProject();
  const { stakeholders } = project.overview;
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', email: '' });

  const add = () => {
    if (form.name.trim()) dispatch({ type: 'STAKEHOLDER_ADD', ...form, name: form.name.trim() });
    setForm({ name: '', role: '', email: '' });
    setModalOpen(false);
  };

  return (
    <div className="content-card">
      <div className="card-title-row">
        <span className="card-title">Key Stakeholders</span>
      </div>
      <div className="card-body">
        {stakeholders.length === 0 ? (
          <div className="empty-state">
            <div className="plus">+</div>
            <div className="empty-title">Need to define</div>
            <div className="empty-sub">Add names, roles, and owners once the stakeholder list is confirmed.</div>
          </div>
        ) : (
          <div className="contact-grid">
            {stakeholders.map((c) => (
              <ContactCard
                key={c.id}
                contact={c}
                onChange={(key, v) => dispatch({ type: 'STAKEHOLDER_SET', id: c.id, key, value: v })}
                onRemove={() => dispatch({ type: 'STAKEHOLDER_REMOVE', id: c.id })}
              />
            ))}
          </div>
        )}
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          + Add stakeholder
        </button>
      </div>

      {modalOpen && (
        <Modal title="Add stakeholder" onSubmit={add} onClose={() => setModalOpen(false)} disableSubmit={!form.name.trim()}>
          <Field label="Name">
            <input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </Field>
          <Field label="Role">
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Sponsor, TPM, Tech Lead" />
          </Field>
          <Field label="Email (optional)">
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" />
          </Field>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Timeline card
 * Milestones are always rendered date-ordered. Each milestone is
 * DATE + ONE-WORD TITLE (tag) + SHORT DESC, matching the template rows.
 * ------------------------------------------------------------------------- */
function TimelineCard() {
  const { project, dispatch } = useProject();
  const { timeline } = project.overview;
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ date: '', tag: '', desc: '' });

  const add = () => {
    if (form.date && form.tag.trim()) {
      dispatch({ type: 'TIMELINE_ADD', date: form.date, tag: form.tag.trim(), desc: form.desc.trim() });
    }
    setForm({ date: '', tag: '', desc: '' });
    setModalOpen(false);
  };

  const fmtDate = (iso) => {
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="content-card">
      <div className="card-title-row">
        <span className="card-title">Timeline Summary</span>
      </div>
      <div className="card-body">
        {timeline.length === 0 ? (
          <div className="empty-state">
            <div className="plus">+</div>
            <div className="empty-title">No milestones yet</div>
            <div className="empty-sub">Add date-based milestones — they stay sorted automatically.</div>
          </div>
        ) : (
          <div className="timeline-list">
            {timeline.map((t) => (
              <div className="timeline-row" key={t.id}>
                <div className="timeline-date-col">
                  <EditableText
                    as="div"
                    className="timeline-date"
                    value={fmtDate(t.date)}
                    placeholder="Date"
                    onCommit={(v) => dispatch({ type: 'TIMELINE_SET', id: t.id, key: 'date', value: toISODate(v, t.date) })}
                  />
                  <EditableText
                    className="timeline-tag"
                    value={t.tag}
                    placeholder="TAG"
                    onCommit={(v) => dispatch({ type: 'TIMELINE_SET', id: t.id, key: 'tag', value: v.replace(/\s+/g, '') })}
                  />
                </div>
                <div className="timeline-track">
                  <div className="timeline-rail">
                    <span className="timeline-node" />
                    <span className="timeline-line" />
                  </div>
                  <EditableText
                    as="div"
                    className="timeline-desc"
                    value={t.desc}
                    placeholder="Short description"
                    onCommit={(v) => dispatch({ type: 'TIMELINE_SET', id: t.id, key: 'desc', value: v })}
                  />
                </div>
                <div className="row-controls">
                  <button
                    className="icon-btn danger"
                    title="Remove milestone"
                    onClick={() => dispatch({ type: 'TIMELINE_REMOVE', id: t.id })}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          + Add milestone
        </button>
      </div>

      {modalOpen && (
        <Modal title="Add milestone" onSubmit={add} onClose={() => setModalOpen(false)} disableSubmit={!form.date || !form.tag.trim()}>
          <Field label="Date">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="One-word title">
            <input
              autoFocus
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value.replace(/\s+/g, '') })}
              placeholder="e.g. Blackout"
              maxLength={16}
            />
          </Field>
          <Field label="Short description">
            <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="e.g. China deployment blackout" />
          </Field>
        </Modal>
      )}
    </div>
  );
}

/** Best-effort parse of an edited date back to ISO; falls back to previous. */
function toISODate(text, fallback) {
  const d = new Date(text);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toISOString().slice(0, 10);
}
