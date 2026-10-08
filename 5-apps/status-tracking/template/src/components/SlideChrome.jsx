import EditableText from './EditableText.jsx';

/**
 * Shared slide chrome extracted from the Figma template:
 *  - slide-header  (dot + eyebrow + title) at 100/80
 *  - slide-footer  (doc title + page number) at 100/1002
 *  - draft-badge   at 1760/24 (rotated, dashed, config statusColor)
 */
export function SlideHeader({ eyebrow, title, onEyebrow, onTitle }) {
  return (
    <div className="slide-header">
      <div className="eyebrow-row">
        <span className="eyebrow-dot" />
        <EditableText className="eyebrow" value={eyebrow} onCommit={onEyebrow} />
      </div>
      <EditableText className="slide-title" as="div" value={title} onCommit={onTitle} />
    </div>
  );
}

export function SlideFooter({ docTitle, pageNum }) {
  return (
    <div className="slide-footer">
      <span>{docTitle}</span>
      <span>{pageNum}</span>
    </div>
  );
}

export function DraftBadge({ visible, status, onToggle }) {
  return (
    <div
      className={`draft-badge ${visible ? '' : 'off'}`}
      title="Click to toggle the draft badge"
      onClick={onToggle}
    >
      <span>{status}</span>
    </div>
  );
}

/** Inline SVG icons matching the template's section glyphs. */
export function TargetIcon() {
  return (
    <svg className="section-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="8" />
      <circle cx="10" cy="10" r="4.5" />
      <circle cx="10" cy="10" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ListChecksIcon() {
  return (
    <svg className="section-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2.5 5.5l1.6 1.6L7 4.2" />
      <path d="M2.5 12.5l1.6 1.6L7 11.2" />
      <path d="M9.5 5.5h8M9.5 12.5h8" />
    </svg>
  );
}
