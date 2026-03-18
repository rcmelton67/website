import json
import os
import sys


def main() -> int:
    sandbox_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    publisher_dir = os.path.join(sandbox_dir, "tools", "tribute-publisher")
    sys.path.insert(0, publisher_dir)

    try:
        from tribute_publisher import parse_safe_markdown  # type: ignore
    except Exception as e:
        print(f"[error] Could not import tribute_publisher.parse_safe_markdown: {e}")
        print(f"[hint] Expected tribute publisher dir at: {publisher_dir}")
        return 2

    data_path = os.path.join(sandbox_dir, "memorials", "pet-tributes", "data.json")
    tributes_root = os.path.join(sandbox_dir, "memorials", "pet-tributes")

    with open(data_path, "r", encoding="utf-8") as f:
        entries = json.load(f)

    by_slug = {str(e.get("slug", "")).strip(): e for e in entries if e.get("slug")}

    fixed = []
    missing_full_message = []

    for slug, entry in by_slug.items():
        index_path = os.path.join(tributes_root, slug, "index.html")
        if not os.path.exists(index_path):
            continue

        with open(index_path, "r", encoding="utf-8") as f:
            html = f.read()

        if "{{TRIBUTE_MESSAGE}}" not in html:
            continue

        full_message_md = (entry.get("full_message") or "").strip()
        if not full_message_md:
            missing_full_message.append(slug)
            continue

        rendered_html = parse_safe_markdown(full_message_md)
        updated = html.replace("{{TRIBUTE_MESSAGE}}", rendered_html)

        with open(index_path, "w", encoding="utf-8") as f:
            f.write(updated)

        fixed.append(slug)

    print("[done] replaced_token_in_pages:", len(fixed))
    if fixed:
        print("  - " + "\n  - ".join(fixed))

    if missing_full_message:
        print("[warn] pages_with_token_but_missing_full_message_in_data.json:", len(missing_full_message))
        print("  - " + "\n  - ".join(missing_full_message))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

