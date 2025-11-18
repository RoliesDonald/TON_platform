#!/bin/bash

# Script to create GitHub issues using GitHub REST API
# This will generate curl commands for each issue

GITHUB_REPO="RoliesDonald/TON_platform"
ISSUES_DIR="github-issues"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"  # Set this environment variable

echo "🚀 Creating GitHub Issues using REST API"
echo "=========================================="

if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "⚠️  GITHUB_TOKEN not set. Set it with:"
    echo "   export GITHUB_TOKEN=your_github_personal_access_token"
    echo ""
    echo "💡 Get your token from: https://github.com/settings/tokens"
    echo "   Required scopes: 'repo' (public_repo for public repos)"
    echo ""
    echo "📋 Generated curl commands (run them manually):"
    echo ""
fi

count=0
for file in "$ISSUES_DIR"/*.md; do
    if [[ ! -f "$file" ]]; then
        continue
    fi

    count=$((count + 1))

    # Extract title and body from markdown
    title=$(grep "^# " "$file" | sed 's/^# //')
    labels=$(grep "Labels:" "$file" | sed 's/Labels: //')

    # Create JSON body
    body=$(cat "$file" | jq -Rs --arg title "$title" --arg labels "$labels" '{
        "title": $title,
        "body": .,
        "labels": ($labels | split(","))
    }')

    if [[ -n "$GITHUB_TOKEN" ]]; then
        echo "Creating issue: $title"
        response=$(curl -s -X POST \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/$GITHUB_REPO/issues" \
            -d "$body")

        issue_url=$(echo "$response" | jq -r '.html_url // "Failed to create issue"')
        if [[ "$issue_url" != "Failed to create issue" ]]; then
            echo "✅ Created: $issue_url"
        else
            echo "❌ Failed: $response"
        fi
    else
        # Generate curl command for manual execution
        echo "echo \"Creating issue: $title\""
        echo "curl -X POST \\"
        echo "  -H \"Authorization: token YOUR_GITHUB_TOKEN\" \\"
        echo "  -H \"Accept: application/vnd.github.v3+json\" \\"
        echo "  \"https://api.github.com/repos/$GITHUB_REPO/issues\" \\"
        echo "  -d '$body'"
        echo ""
    fi
done

echo ""
echo "📊 Summary: $count issues processed"
echo ""
if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "🔄 To execute all commands:"
    echo "   1. export GITHUB_TOKEN=your_token_here"
    echo "   2. ./create-issues-api.sh"
    echo ""
    echo "🎯 Or run individual curl commands above manually"
else
    echo "✅ All issues created successfully!"
fi