#!/bin/bash

# Read the JSON input from stdin
input=$(cat)

# Extract information from JSON
current_dir=$(echo "$input" | jq -r '.workspace.current_dir')
model_name=$(echo "$input" | jq -r '.model.display_name')
output_style=$(echo "$input" | jq -r '.output_style.name')

# Color codes
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
GRAY='\033[0;37m'
RESET='\033[0m'

# Get git branch and status
cd "$current_dir" 2>/dev/null || cd /Users/stefancho/works/vibe-coding/shoes-online-shop3/frontend
git_branch=$(git branch --show-current 2>/dev/null || echo "no-git")
git_status=""
if [ "$git_branch" != "no-git" ]; then
    if git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
        git_status="clean"
    else
        git_status="dirty"
    fi
fi

# Format the output with colors
if [ "$git_branch" != "no-git" ]; then
    if [ "$git_status" = "clean" ]; then
        status_color=$GREEN
    else
        status_color=$RED
    fi
    printf "${CYAN}%s${GRAY} | ${YELLOW}%s${GRAY},${status_color}%s${GRAY} | ${BLUE}%s${GRAY} | ${MAGENTA}%s${RESET}" "$current_dir" "$git_branch" "$git_status" "$model_name" "$output_style"
else
    printf "${CYAN}%s${GRAY} | ${RED}no-git${GRAY} | ${BLUE}%s${GRAY} | ${MAGENTA}%s${RESET}" "$current_dir" "$model_name" "$output_style"
fi

