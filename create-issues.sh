#!/bin/bash

# Script to create GitHub issues from TON Platform tasks
# This script uses the GitHub CLI (gh) to create issues from the tasks.md file

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} GitHub CLI (gh) is not installed."
    echo "Please install it first: https://cli.github.com/manual/installation"
    exit 1
fi

# Check if user is authenticated with GitHub CLI
if ! gh auth status &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[TON PLATFORM]${NC} $1"
}

TASKS_FILE="specs/001-ton-platform-setup/tasks.md"
ISSUES_DIR="github-issues"

# Create issues directory
mkdir -p "$ISSUES_DIR"

print_header "Creating GitHub Issues from TON Platform Tasks"
print_status "Found $(grep -c '^\- \[ \]' "$TASKS_FILE") tasks to process"

# Extract tasks and create issues
while IFS= read -r line; do
    # Skip empty lines and non-task lines
    [[ "$line" =~ ^- \[ \] ]] || continue

    # Extract task ID, description
    task_line=$(echo "$line" | sed 's/^- \[ \] //')
    task_id=$(echo "$task_line" | grep -o 'T[0-9]\+' | head -1)
    description=$(echo "$task_line" | sed "s/${task_id}//" | sed 's/^\s*//' | sed 's/\[P\]//' | sed 's/\[US[0-9]\]//')

    if [[ -z "$task_id" ]]; then
        print_warning "Skipping invalid task format: $line"
        continue
    fi

    # Extract user story if present
    user_story=$(echo "$task_line" | grep -o '\[US[0-9]\]' | head -1 || echo "")

    # Determine labels based on task content
    labels="backend,enhancement"
    if [[ "$task_line" =~ "frontend" ]]; then
        labels="frontend,enhancement"
    elif [[ "$task_line" =~ "mobile" ]] || [[ "$task_line" =~ "flutter" ]]; then
        labels="mobile,enhancement"
    elif [[ "$task_line" =~ "test" ]]; then
        labels="testing,enhancement"
    elif [[ "$task_line" =~ "docker" ]]; then
        labels="infrastructure,enhancement"
    fi

    # Add priority label based on user story
    if [[ "$user_story" == "[US1]" ]] || [[ "$user_story" == "[US2]" ]] || [[ "$user_story" == "[US3]" ]] || [[ "$user_story" == "[US4]" ]]; then
        labels="$labels,priority-critical"
    elif [[ "$user_story" == "[US5]" ]] || [[ "$user_story" == "[US6]" ]] || [[ "$user_story" == "[US7]" ]]; then
        labels="$labels,priority-high"
    fi

    # Create issue title and body
    title="$task_id: $description"
    body="**Task ID**: $task_id
**User Story**: $user_story
**Description**: $description

**File Path**: $(echo "$description" | grep -o 'backend/[^.]*\|frontend/[^.]*\|mobile/[^.]*' | head -1 || echo "TBD")

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
"

    # Save issue to file
    issue_file="$ISSUES_DIR/${task_id}-$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//').md"

    cat > "$issue_file" << EOF
# $title

$body

**Labels**: $labels

---

*This issue was automatically generated from the TON Platform task list.*
EOF

    print_status "Created issue file: $issue_file"

    # Ask if user wants to create the GitHub issue now
    echo -e "${YELLOW}Create GitHub issue for $task_id? (y/N/q to quit):${NC}"
    read -r response

    case "$response" in
        [Yy]*)
            print_status "Creating GitHub issue: $title"
            gh issue create --title "$title" --body "$body" --label "$labels"
            echo "✅ Issue created successfully"
            ;;
        [Qq]*)
            print_status "Quitting..."
            break
            ;;
        *)
            print_warning "Skipped: $task_id"
            ;;
    esac

done < "$TASKS_FILE"

print_header "Issue Creation Complete"
print_status "Issue files saved to: $ISSUES_DIR/"
print_status "You can manually create issues from these files or run the script again."

echo ""
print_header "To create all issues at once (without prompts):"
echo "  for file in $ISSUES_DIR/*.md; do"
echo "    title=\$(grep '^# ' \"\$file\" | sed 's/^# //')"
echo "    body=\$(sed '/^# /,\$!d' \"\$file\" | sed '1d')"
echo "    labels=\$(grep 'Labels:' \"\$file\" | sed 's/Labels: //')"
echo "    gh issue create --title \"\$title\" --body \"\$body\" --label \"\$labels\""
echo "  done"