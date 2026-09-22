import EditableText from './EditableText.jsx';

export function initialsOf(name) {
  return String(name || '?')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

/**
 * Contact card — avatar with initials + editable name/role.
 * Ownership everywhere in the app is rendered as a contact card/tag.
 */
export default function ContactCard({ contact, onChange, onRemove, compact = false }) {
  return (
    <div className="contact-card" style={compact ? { padding: '8px 12px' } : undefined}>
      <div className="avatar">{initialsOf(contact.name)}</div>
      <div className="contact-info">
        <EditableText
          className="contact-name"
          value={contact.name}
          placeholder="Name"
          onCommit={(v) => onChange('name', v)}
        />
        <div>
          <EditableText
            className="contact-role"
            value={contact.role}
            placeholder="Role"
            onCommit={(v) => onChange('role', v)}
          />
        </div>
      </div>
      {onRemove && (
        <button className="icon-btn danger" title="Remove contact" onClick={onRemove}>
          ×
        </button>
      )}
    </div>
  );
}
