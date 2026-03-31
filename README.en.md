# Resume Builder

[简体中文](./README.md) | English

An online resume editor with 5 templates, JSON-driven configuration, i18n support, and PDF export.

[Live Demo](https://beyondlong.github.io/resume-builder/) · [Default Template Preview](https://beyondlong.github.io/resume-builder/preview?template=template4)

![Editor Preview](static/images/edit-pages.png)

## Highlights

- 5 resume templates
- JSON-driven editing
- i18n support
- Autosave with `localStorage`
- Export JSON configuration
- Print to PDF in the browser

The idea is straightforward: edit resume data through a configuration-driven editor, then render it with different templates for preview, export, and printing.

## Features

- 5 templates covering classic, minimal, and business styles
- Configuration-driven forms that are easy to extend
- Chinese and English switching
- Add, edit, delete, and drag-sort list modules
- Automatic persistence with `localStorage`
- JSON export
- Browser print to PDF

## Live Demo

- Demo: [Resume Builder](https://beyondlong.github.io/resume-builder/)

## Preview

### Editor

- Module list plus form-based editing
- List modules support add, edit, delete, and drag sorting
- All changes are automatically saved to browser storage

### Preview Page

| Preview | Preview | Preview |
| --- | --- | --- |
| ![Template Preview 1](static/images/preview-pages1.png) | ![Template Preview 2](static/images/preview-pages2.png) | ![Template Preview 3](static/images/preview-pages3.png) |

- Switch between 5 templates
- Export JSON configuration
- Print PDF from the browser

## Templates

| Template ID | Name | Description |
| --- | --- | --- |
| `template1` | Classic | Two-column layout with higher information density |
| `template2` | Minimal | Lightweight layout for one-page resumes |
| `template3` | Multi-page | Stronger section separation |
| `template4` | Modern Minimal | Current default template |
| `template5` | Business | Sidebar layout with a more formal feel |

## Template Preview Routes

| Template | Style | Preview Route |
| --- | --- | --- |
| `template1` | Classic two-column | `/preview?template=template1` |
| `template2` | Minimal one-page | `/preview?template=template2` |
| `template3` | Sectioned multi-page | `/preview?template=template3` |
| `template4` | Modern minimal | `/preview?template=template4` |
| `template5` | Business sidebar | `/preview?template=template5` |

When running locally, you can open these routes directly in the browser to preview specific templates.

Preview page route example:

```text
/preview?template=template4
```

## Tech Stack

- Gatsby 2
- React 17
- TypeScript
- Ant Design 4
- Less
- react-intl
- react-dnd

## Current Architecture

The active editor chain is:

`src/pages/index.tsx -> src/contexts/ResumeConfigContext.tsx -> src/components/ResumeEditor/*`

The preview chain is:

`src/pages/preview.tsx -> src/components/Resume/*`

The project can be understood as a simple three-step flow:

1. The editor page manages a `ResumeConfig`
2. Changes are saved to browser storage
3. The preview page reads that config and renders it with a selected template

## Project Structure

```text
src/
├── components/
│   ├── Avatar/                  # Avatar component
│   ├── FormCreator/             # Config-driven form generator
│   ├── Resume/                  # Template rendering layer
│   │   ├── Template1/
│   │   ├── Template2/
│   │   ├── Template3/
│   │   ├── Template4/
│   │   ├── Template5/
│   │   ├── shared.ts            # Shared template view model helpers
│   │   ├── shared-sections.tsx  # Shared template content sections
│   │   └── shared-layouts.tsx   # Shared template layout fragments
│   ├── ResumeEditor/            # Main editor UI
│   └── types.ts                 # ResumeConfig / ThemeConfig
├── config/
│   ├── resume-fields.tsx        # Module field definitions
│   ├── resume-modules.tsx       # Module definitions
│   └── types.ts                 # Config layer types
├── contexts/
│   └── ResumeConfigContext.tsx  # Global resume config state
├── data/
│   ├── constant.ts              # Default title mapping
│   └── resume.ts                # Default resume data
├── helpers/
│   ├── resume-config.ts         # Config loading and merge logic
│   ├── resume-dates.ts          # Date normalization / formatting
│   └── storage.ts               # localStorage helpers
├── i18n/
├── layout/
└── pages/
    ├── index.tsx                # Editor page
    ├── preview.tsx              # Preview page
    └── 404.tsx                  # 404 page
```

## Pages

### Editor Page

File:
[src/pages/index.tsx](/Users/yangxinglong/zayne/resume-builder/src/pages/index.tsx)

Responsibilities:

- Load persisted resume config
- Initialize i18n
- Provide `ResumeConfigProvider`
- Render `ResumeEditor`

### Preview Page

File:
[src/pages/preview.tsx](/Users/yangxinglong/zayne/resume-builder/src/pages/preview.tsx)

Responsibilities:

- Read saved resume config
- Switch templates by `template` query param
- Preview, export JSON, and print PDF

## Data Flow

### Editing Flow

1. [index.tsx](/Users/yangxinglong/zayne/resume-builder/src/pages/index.tsx) loads the initial config
2. [ResumeConfigContext.tsx](/Users/yangxinglong/zayne/resume-builder/src/contexts/ResumeConfigContext.tsx) manages global state
3. [ResumeEditor/index.tsx](/Users/yangxinglong/zayne/resume-builder/src/components/ResumeEditor/index.tsx) switches modules
4. [ModuleForm.tsx](/Users/yangxinglong/zayne/resume-builder/src/components/ResumeEditor/ModuleForm.tsx) edits the current module
5. [FormCreator/index.tsx](/Users/yangxinglong/zayne/resume-builder/src/components/FormCreator/index.tsx) renders forms from config
6. Changes are written into `localStorage`

### Preview Flow

1. [preview.tsx](/Users/yangxinglong/zayne/resume-builder/src/pages/preview.tsx) reads the config
2. [Resume/index.tsx](/Users/yangxinglong/zayne/resume-builder/src/components/Resume/index.tsx) selects the template component
3. `TemplateX` renders the final resume page

## Local Development

### Recommended Environment

- Node.js 20
- npm 10

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

Notes:

- The start script clears `public` and development caches first
- It also recreates the project `.cache` directory automatically
- This is used to keep the current Gatsby 2 dev workflow stable

### Production Build

```bash
npm run build
```

### Other Commands

```bash
# Clean Gatsby cache
npm run clean

# Extract i18n messages
npm run extract
```

## Config-Driven Editing

The editor is configuration-driven instead of being hardcoded:

- [resume-modules.tsx](/Users/yangxinglong/zayne/resume-builder/src/config/resume-modules.tsx) defines modules shown in the left panel
- [resume-fields.tsx](/Users/yangxinglong/zayne/resume-builder/src/config/resume-fields.tsx) defines fields shown in the editor form
- [types.ts](/Users/yangxinglong/zayne/resume-builder/src/components/types.ts) defines the actual data model

To add a new module, you will typically touch:

1. `src/components/types.ts`
2. `src/config/resume-modules.tsx`
3. `src/config/resume-fields.tsx`
4. `src/data/resume.ts`
5. The target template rendering files

## ResumeConfig Shape

The core data model is `ResumeConfig`, mainly including:

- `avatar`
- `profile`
- `educationList`
- `workExpList`
- `projectList`
- `skillList`
- `awardList`
- `workList`
- `aboutme`
- `titleNameMap`

Default data lives in:

- [src/data/resume.ts](/Users/yangxinglong/zayne/resume-builder/src/data/resume.ts)
- [static/resume.json](/Users/yangxinglong/zayne/resume-builder/static/resume.json)

## Recent Cleanup and Refactoring

The repository has already gone through these updates:

- Removed the old editor chain and kept only `index.tsx + ResumeEditor + Context`
- Split the old `contant.tsx` into `src/config`
- Extracted shared resume config loading helpers
- Switched the context layer to reducer-based state updates
- Unified date normalization and formatting
- Extracted shared template view model / sections / layout fragments
- Fixed Gatsby 2 compatible dependencies, Less config, and dev startup workflow

## Known Notes

- Gatsby 2 + React 17 + legacy plugins still produce some historical warnings
- `npm run build` currently passes
- After dependency or page-structure changes, restarting `npm start` is recommended

## License

MIT
