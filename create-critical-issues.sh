#!/bin/bash

# Create the 5 most critical MVP GitHub issues for TON Platform
# Execute these commands one by one to create the issues

GITHUB_REPO="RoliesDonald/TON_platform"

echo "🚀 Creating 5 Critical MVP GitHub Issues"
echo "======================================="
echo ""
echo "📋 Copy and execute these commands one by one:"
echo ""

# T001 - Backend Project Structure
echo "# T001: Create backend project structure following Clean Architecture"
cat << 'EOF'
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_REPO/issues \
  -d '{
    "title": "T001: Create backend project structure following Clean Architecture",
    "body": "**Task ID**: T001\n**User Story**: \n**Description**: Create backend project structure following Clean Architecture\n\n**File Path**: \n\n**Context**:\nThis task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.\n\n**Implementation Notes**:\n- Follow the Clean Architecture pattern for backend code\n- Use TypeScript for frontend development\n- Implement proper error handling and logging\n- Add appropriate tests when applicable\n\n**Related Documentation**:\n- [Specification Document](specs/001-ton-platform-setup/spec.md)\n- [Implementation Plan](specs/001-ton-platform-setup/plan.md)\n- [Task List](specs/001-ton-platform-setup/tasks.md)",
    "labels": ["backend", "enhancement", "priority-critical"]
  }'
EOF
echo ""
echo ""

# T002 - Initialize Golang Module
echo "# T002: Initialize Golang module with required dependencies"
cat << 'EOF'
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_REPO/issues \
  -d '{
    "title": "T002: Initialize Golang module with required dependencies (Gin, GORM, JWT, etc.)",
    "body": "**Task ID**: T002\n**User Story**: \n**Description**: Initialize Golang module with required dependencies (Gin, GORM, JWT, etc.)\n\n**File Path**: backend/go.mod\n\n**Context**:\nThis task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.\n\n**Implementation Notes**:\n- Follow the Clean Architecture pattern for backend code\n- Use TypeScript for frontend development\n- Implement proper error handling and logging\n- Add appropriate tests when applicable\n\n**Related Documentation**:\n- [Specification Document](specs/001-ton-platform-setup/spec.md)\n- [Implementation Plan](specs/001-ton-platform-setup/plan.md)\n- [Task List](specs/001-ton-platform-setup/tasks.md)",
    "labels": ["backend", "enhancement", "priority-critical"]
  }'
EOF
echo ""
echo ""

# T008 - Setup PostgreSQL Database
echo "# T008: Setup PostgreSQL database with initial schema and migrations"
cat << 'EOF'
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_REPO/issues \
  -d '{
    "title": "T008: Setup PostgreSQL database with initial schema and migrations",
    "body": "**Task ID**: T008\n**User Story**: \n**Description**: Setup PostgreSQL database with initial schema and migrations\n\n**File Path**: backend/migrations/\n\n**Context**:\nThis task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.\n\n**Implementation Notes**:\n- Follow the Clean Architecture pattern for backend code\n- Use TypeScript for frontend development\n- Implement proper error handling and logging\n- Add appropriate tests when applicable\n\n**Related Documentation**:\n- [Specification Document](specs/001-ton-platform-setup/spec.md)\n- [Implementation Plan](specs/001-ton-platform-setup/plan.md)\n- [Task List](specs/001-ton-platform-setup/tasks.md)",
    "labels": ["backend", "enhancement", "priority-critical"]
  }'
EOF
echo ""
echo ""

# T009 - JWT Authentication Framework
echo "# T009: Implement JWT authentication framework with bcrypt password hashing"
cat << 'EOF'
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_REPO/issues \
  -d '{
    "title": "T009: Implement JWT authentication framework with bcrypt password hashing",
    "body": "**Task ID**: T009\n**User Story**: \n**Description**: Implement JWT authentication framework with bcrypt password hashing\n\n**File Path**: backend/internal/middleware/auth.go\n\n**Context**:\nThis task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.\n\n**Implementation Notes**:\n- Follow the Clean Architecture pattern for backend code\n- Use TypeScript for frontend development\n- Implement proper error handling and logging\n- Add appropriate tests when applicable\n\n**Related Documentation**:\n- [Specification Document](specs/001-ton-platform-setup/spec.md)\n- [Implementation Plan](specs/001-ton-platform-setup/plan.md)\n- [Task List](specs/001-ton-platform-setup/tasks.md)",
    "labels": ["backend", "enhancement", "priority-critical"]
  }'
EOF
echo ""
echo ""

# T010 - RBAC Middleware
echo "# T010: Create role-based access control (RBAC) middleware for 6 user roles"
cat << 'EOF'
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_REPO/issues \
  -d '{
    "title": "T010: Create role-based access control (RBAC) middleware for 6 user roles",
    "body": "**Task ID**: T010\n**User Story**: \n**Description**: Create role-based access control (RBAC) middleware for 6 user roles\n\n**File Path**: backend/internal/middleware/rbac.go\n\n**Context**:\nThis task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.\n\n**Implementation Notes**:\n- Follow the Clean Architecture pattern for backend code\n- Use TypeScript for frontend development\n- Implement proper error handling and logging\n- Add appropriate tests when applicable\n\n**Related Documentation**:\n- [Specification Document](specs/001-ton-platform-setup/spec.md)\n- [Implementation Plan](specs/001-ton-platform-setup/plan.md)\n- [Task List](specs/001-ton-platform-setup/tasks.md)",
    "labels": ["backend", "enhancement", "priority-critical"]
  }'
EOF

echo ""
echo "📝 Instructions:"
echo "1. Get your GitHub Personal Access Token from: https://github.com/settings/tokens"
echo "2. Replace YOUR_GITHUB_TOKEN in the commands above"
echo "3. Execute each command one by one"
echo ""
echo "💡 Alternative: Go to https://github.com/RoliesDonald/TON_platform/issues/new and manually create the 5 issues using the content from: github-issues/T001-*.md, T002-*.md, T008-*.md, T009-*.md, T010-*.md"