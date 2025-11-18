#!/bin/bash

# Simple script to generate GitHub issue files from tasks
# This will create markdown files ready for GitHub issue creation

TASKS_FILE="specs/001-ton-platform-setup/tasks.md"
ISSUES_DIR="github-issues"
TOTAL_TASKS=0

echo "🚀 Generating GitHub Issues from TON Platform Tasks..."
echo "======================================================"

# Create issues directory
mkdir -p "$ISSUES_DIR"

# Use grep to extract tasks and process them
grep "^- \[ \]" "$TASKS_FILE" | while read -r line; do
    TOTAL_TASKS=$((TOTAL_TASKS + 1))

    # Extract task ID
    task_id=$(echo "$line" | grep -o "T[0-9]\+" | head -1)

    # Extract description (remove task ID, [P], [USX] markers)
    description=$(echo "$line" | sed "s/^- \[ \] //" | sed "s/${task_id}//" | sed 's/^\s*//' | sed 's/\[P\]//' | sed 's/\[US[0-9]\]//' | sed 's/^\s*//')

    # Skip if no task ID found
    if [[ -z "$task_id" ]]; then
        echo "⚠️  Skipping invalid task format: $line"
        continue
    fi

    # Extract user story if present
    user_story=$(echo "$line" | grep -o "\[US[0-9]\]" | head -1 || echo "")

    # Determine labels based on task content
    labels="backend,enhancement"
    if [[ "$line" =~ "frontend" ]]; then
        labels="frontend,enhancement"
    elif [[ "$line" =~ "mobile" ]] || [[ "$line" =~ "flutter" ]]; then
        labels="mobile,enhancement"
    elif [[ "$line" =~ "test" ]]; then
        labels="testing,enhancement"
    elif [[ "$line" =~ "docker" ]]; then
        labels="infrastructure,enhancement"
    fi

    # Add priority label based on user story
    if [[ "$user_story" == "[US1]" ]] || [[ "$user_story" == "[US2]" ]] || [[ "$user_story" == "[US3]" ]] || [[ "$user_story" == "[US4]" ]]; then
        labels="$labels,priority-critical"
    elif [[ "$user_story" == "[US5]" ]] || [[ "$user_story" == "[US6]" ]] || [[ "$user_story" == "[US7]" ]]; then
        labels="$labels,priority-high"
    fi

    # Extract file path if mentioned
    file_path=$(echo "$description" | grep -o "backend/[^.]*\|frontend/[^.]*\|mobile/[^.]*\|database/[^.]*\|tests/[^.]*" | head -1 || echo "TBD")

    # Create filename
    safe_description=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | head -c 80)
    issue_file="$ISSUES_DIR/${task_id}-${safe_description}.md"

    # Create issue content
    cat > "$issue_file" << EOF
# $task_id: $description

**Task ID**: $task_id
**User Story**: $user_story
**Description**: $description

**File Path**: $file_path

**Context**:
This task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

**Implementation Notes**:
- Follow the Clean Architecture pattern for backend code
- Use TypeScript for frontend development
- Implement proper error handling and logging
- Add appropriate tests when applicable

**Related Documentation**:
- [Specification Document](specs/001-ton-platform-setup/spec.md)
- [Implementation Plan](specs/001-ton-platform-setup/plan.md)
- [Task List](specs/001-ton-platform-setup/tasks.md)

**Labels**: $labels

---

*This issue was automatically generated from the TON Platform task list.*
EOF

    echo "✅ Created: $issue_file"
done

# Count total created files
CREATED_FILES=$(ls -1 "$ISSUES_DIR"/*.md 2>/dev/null | wc -l)

echo ""
echo "🎉 Issue Generation Complete!"
echo "============================"
echo "Total issue files created: $CREATED_FILES"
echo "Issue files location: $ISSUES_DIR/"
echo ""
echo "Next steps:"
echo "1. Install GitHub CLI: https://cli.github.com/manual/installation"
echo "2. Authenticate: gh auth login"
echo "3. Create all issues with: for file in $ISSUES_DIR/*.md; do gh issue create --title \"\$(grep '^# ' \"\$file\" | sed 's/^# //')\" --body \"\$(cat \"\$file\")\" --label \"\$(grep 'Labels:' \"\$file\" | sed 's/Labels: //')\"; done"
echo ""
echo "Or manually create issues from the generated markdown files."