#!/usr/bin/env bash
# Create a daily note in the week folder used by this vault.

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: new-daily-note.sh [YYYY-MM-DD] [--dry-run]

Create a daily note using today's local date, or the supplied date. The note
is placed in the folder for that week's Monday. Existing notes are never
overwritten.
EOF
}

target_date=''
dry_run=false

for argument in "$@"; do
  case "$argument" in
    --dry-run)
      dry_run=true
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --*)
      printf 'Unknown option: %s\n' "$argument" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [[ -n "$target_date" ]]; then
        printf 'Specify at most one date.\n' >&2
        usage >&2
        exit 2
      fi
      target_date="$argument"
      ;;
  esac
done

if [[ -z "$target_date" ]]; then
  target_date=$(date +%F)
else
  supplied_date="$target_date"
  if ! target_date=$(date -d "$supplied_date" +%F 2>/dev/null); then
    printf 'Invalid date: %s\n' "$supplied_date" >&2
    exit 2
  fi
fi

day_of_week=$(date -d "$target_date" +%u)
monday=$(date -d "$target_date -$((day_of_week - 1)) days" +%F)
week_folder=$(date -d "$monday" +%m-%d-%Y)
note_name=$(date -d "$target_date" +%m-%d-%Y)

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
vault_root=$(cd -- "$script_dir/.." && pwd)
note_dir="$vault_root/1-write/daily/$week_folder"
note_path="$note_dir/$note_name.md"

if [[ -e "$note_path" ]]; then
  printf 'Daily note already exists: %s\n' "$note_path" >&2
  exit 1
fi

if [[ "$dry_run" == true ]]; then
  printf 'Would create: %s\n' "$note_path"
  exit 0
fi

mkdir -p -- "$note_dir"
{
  printf '%s\n' '---' 'tags:' '  - daily' "date: $target_date" '---' ''
  cat <<'EOF'
# Daily Note

## Meets


## TODO


## Notes

EOF
} > "$note_path"

printf 'Created: %s\n' "$note_path"
