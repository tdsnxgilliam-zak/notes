import EditableText from '../components/EditableText.jsx';
import { useProject } from '../state/projectStore.js';

/**
 * Title slide — pixel-matched to Figma frame 2:10 (1920x1080).
 * All names/fields are editable; meta fields can be reordered and removed.
 */
export default function TitleSlide() {
  const { project, dispatch } = useProject();
  const { title } = project;

  const set = (key, value) => dispatch({ type: 'TITLE_SET', key, value });

  return (
    <>
      {/* Top bar: brand mark + classification (120/120, 1680 wide) */}
      <div className="title-topbar">
        <div className="title-brand">
          <span className="title-brand-bar" />
          <EditableText
            className="title-brand-text"
            value={title.eyebrow}
            onCommit={(v) => set('eyebrow', v)}
          />
        </div>
        <EditableText
          className="title-classification"
          value={title.classification}
          onCommit={(v) => set('classification', v)}
        />
      </div>

      {/* Hero: main title + subtitle + accent rule (120/422) */}
      <div className="title-hero">
        <EditableText
          as="div"
          className="title-main"
          value={title.mainTitle}
          placeholder="Project Title"
          onCommit={(v) => set('mainTitle', v)}
        />
        <EditableText
          as="div"
          className="title-sub"
          value={title.subtitle}
          placeholder="Subtitle"
          onCommit={(v) => set('subtitle', v)}
        />
        <div className="title-rule" />
      </div>

      {/* Meta fields: editable, removable, reorderable (120/937) */}
      <div className="title-meta">
        {title.fields.map((f, i) => (
          <div className="title-meta-field field-row" key={f.id}>
            <div className="field-controls">
              <button
                className="icon-btn"
                title="Move left"
                disabled={i === 0}
                onClick={() => dispatch({ type: 'TITLE_FIELD_MOVE', id: f.id, dir: -1 })}
              >
                ‹
              </button>
              <button
                className="icon-btn"
                title="Move right"
                disabled={i === title.fields.length - 1}
                onClick={() => dispatch({ type: 'TITLE_FIELD_MOVE', id: f.id, dir: 1 })}
              >
                ›
              </button>
              <button
                className="icon-btn danger"
                title="Remove field"
                onClick={() => dispatch({ type: 'TITLE_FIELD_REMOVE', id: f.id })}
              >
                ×
              </button>
            </div>
            <EditableText
              as="div"
              className="title-meta-label"
              value={f.label}
              placeholder="Label"
              onCommit={(v) => dispatch({ type: 'TITLE_FIELD_SET', id: f.id, key: 'label', value: v })}
            />
            <EditableText
              as="div"
              className="title-meta-value"
              value={f.value}
              placeholder="Value"
              onCommit={(v) => dispatch({ type: 'TITLE_FIELD_SET', id: f.id, key: 'value', value: v })}
            />
          </div>
        ))}
        <div className="title-meta-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            className="add-btn"
            style={{ width: 'auto', padding: '6px 14px' }}
            onClick={() => dispatch({ type: 'TITLE_FIELD_ADD' })}
          >
            + Field
          </button>
        </div>
      </div>
    </>
  );
}
