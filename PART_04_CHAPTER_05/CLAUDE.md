# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Random Team Matching Game** - a vanilla JavaScript web application that randomly assigns participants into teams. The project is built with pure HTML, CSS, and JavaScript without any framework dependencies.

Key features:
- Two matching modes: Equal distribution (by team count) and Fixed size (by members per team)
- 4-step progress flow with visual transitions
- Card shuffle animation during matching
- Confetti celebration effect on results
- Image capture and social media sharing capabilities

## Technology Stack

- **HTML/CSS/JavaScript** - Pure vanilla implementation, no frameworks
- **External Libraries** (CDN):
  - `canvas-confetti@1.6.0` - Celebration animations (script.js:392-448)
  - `html2canvas@1.4.1` - Result image capture (script.js:451-467)

## Architecture

### File Structure
```
index.html      - Main HTML structure with 4 sections
script.js       - All application logic (564 lines)
style.css       - Complete styling with animations (623 lines)
note.md         - Development documentation (Korean)
.mcp.json       - Playwright MCP server configuration
```

### Core Flow (4 Sections)

1. **Section 1: Configuration** (index.html:39-71)
   - Mode selection: Equal distribution vs Fixed size
   - Input for team count or members per team
   - Validation before proceeding (script.js:64-139)

2. **Section 2: Name Input** (index.html:74-84)
   - Textarea for participant names (one per line)
   - Duplicate name detection (script.js:109-113)
   - Mode-specific validation (script.js:125-136)

3. **Section 3: Matching Animation** (index.html:87-94)
   - Card shuffle animation (script.js:210-255)
   - 3.5 second animation duration before transitioning to results
   - Uses CSS custom properties for random positioning (style.css:464-491)

4. **Section 4: Results** (index.html:97-120)
   - Team cards with gradient backgrounds (script.js:324-339)
   - 3-stage confetti animation (script.js:392-448)
   - Image download, clipboard copy, and Twitter sharing (script.js:469-555)

### Key JavaScript Functions

**Team Creation Logic**:
- `createEqualTeams()` (script.js:274-294) - Round-robin distribution for equal mode
- `createFixedTeams()` (script.js:297-322) - Fixed size with remainder distribution
- `shuffleArray()` (script.js:342-348) - Fisher-Yates algorithm for randomization

**Animation Controllers**:
- `createShuffleAnimation()` (script.js:211-255) - Generates 20 cards with staggered animations
- `triggerConfetti()` (script.js:392-448) - 3-stage celebration: sides → center → continuous fall

**Image Capture**:
- `captureResultImage()` (script.js:451-467) - Captures `#capture-area` with html2canvas
- `downloadImage()` (script.js:470-490) - Downloads as PNG with timestamp
- `copyImageToClipboard()` (script.js:513-536) - Uses Clipboard API (HTTPS only)
- `shareToTwitter()` (script.js:539-555) - Opens Twitter intent with preset text

### State Management

Global state variables (script.js:1-7):
```javascript
currentSection  // Current active section (1-4)
selectedMode    // 'equal' or 'fixed'
teamCount       // Number of teams (equal mode)
membersPerTeam  // Members per team (fixed mode)
members         // Array of participant names
teams           // Array of team objects with name, members, color
```

### CSS Architecture

**Custom Properties** (style.css:8-20):
- Color scheme with primary/secondary colors
- Consistent shadows and borders
- Responsive design breakpoints at 768px

**Animation Keyframes**:
- `fadeIn` (style.css:119-128) - Section transitions
- `slideDown` (style.css:331-340) - Error messages
- `cardAppear/shuffle/gather` (style.css:449-491) - Card animations
- `slideUp/fadeInScale` (style.css:516-577) - Result cards

## Common Development Tasks

### Running the Application

Open `index.html` directly in a browser - no build process required:
```bash
open index.html
```

For development with live reload, use a simple HTTP server:
```bash
python3 -m http.server 8000
# or
npx serve
```

### Testing

Manual testing checklist:
1. **Mode switching**: Toggle between equal/fixed modes
2. **Validation**: Test with invalid inputs (empty, duplicates, insufficient members)
3. **Team distribution**: Verify round-robin in equal mode, remainder handling in fixed mode
4. **Animations**: Check card shuffle timing and confetti stages
5. **Image capture**: Test download, clipboard (HTTPS), and Twitter share

### Modifying Team Colors

Team gradient colors are defined in `getTeamColor()` (script.js:324-339). The array supports up to 10 distinct gradients that cycle for larger team counts.

### Adjusting Animation Timing

Key timing values:
- Section transition: `goToSection()` uses instant transitions with CSS animations
- Card shuffle: 3500ms total (script.js:204-207)
  - Cards appear: 100ms delay (script.js:231)
  - Shuffle: 2500ms (script.js:248-254)
  - Gather: 800ms (script.js:478-480)
- Confetti stages: 0ms, 800ms, 1600ms delays (script.js:394-447)

### Adding New Validation Rules

Extend `validateSection()` (script.js:64-139):
- Section 1: Team/member count validation
- Section 2: Name input validation

Pattern:
```javascript
if (condition) {
    showError('Your error message');
    return false;
}
```

## Playwright MCP Integration

This project includes Playwright MCP server configuration (`.mcp.json`) for automated browser testing. The MCP server enables:
- Browser automation for testing the UI flow
- Screenshot capture for visual regression testing
- Form interaction testing

To use MCP tools, ensure you have the Playwright MCP package installed.

## Important Notes

1. **No Build Process**: This is a vanilla JavaScript project - edit and refresh
2. **HTTPS Required**: Clipboard API only works over HTTPS or localhost
3. **Browser Compatibility**: Modern browsers only (ES6+, CSS Grid, Flexbox)
4. **Performance**: Card animation may lag on low-end devices with 20+ cards
5. **Localization**: All UI text is in Korean (한국어)

## Project Context

This is part of a FastCampus lecture series (PART_04_CHAPTER_05) demonstrating:
- Vanilla JavaScript best practices
- CSS animation techniques
- Progressive enhancement with external libraries
- Step-by-step development methodology (see note.md for incremental prompt strategy)

The `note.md` file contains valuable insights on efficient development approach - building with the end goal in mind rather than incremental refactoring.
