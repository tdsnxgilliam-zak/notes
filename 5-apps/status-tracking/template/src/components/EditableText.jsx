import { useEffect, useRef, useState } from 'react';

/**
 * Inline editable text. Click to edit in place; Enter or blur commits,
 * Escape cancels. Renders placeholder styling when empty.
 *
 * Props:
 *  - value, onCommit(text)
 *  - multiline: use a textarea
 *  - placeholder: faint text shown when value is empty
 *  - className: typography comes from the caller so the design is preserved
 *  - as: tag to render in read mode (default span)
 */
export default function EditableText({
  value,
  onCommit,
  multiline = false,
  placeholder = 'Click to edit',
  className = '',
  as: Tag = 'span',
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onCommit(draft);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    const InputTag = multiline ? 'textarea' : 'input';
    return (
      <InputTag
        ref={inputRef}
        className={`edit-input ${className}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (!multiline || e.ctrlKey)) commit();
          if (e.key === 'Escape') cancel();
        }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  const empty = !value || !String(value).trim();
  return (
    <Tag
      className={`editable ${empty ? 'placeholder' : ''} ${className}`}
      title="Click to edit"
      onClick={(e) => {
        e.stopPropagation();
        setDraft(value);
        setEditing(true);
      }}
    >
      {empty ? placeholder : value}
    </Tag>
  );
}
