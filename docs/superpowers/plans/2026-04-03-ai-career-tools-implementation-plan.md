# AI Career Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `AI岗位推荐` on the editor page and `AI模拟面试` on the preview page using the existing AI proxy architecture and structured resume context.

**Architecture:** Introduce a shared resume-context builder in the frontend, then add two dedicated frontend AI clients and two dedicated server routes. Render both features in drawer-based UI so the current editor and preview flows remain stable. Reuse the existing AI provider router, upstream error handling, and environment-based provider configuration.

**Tech Stack:** Gatsby 2, React 17, TypeScript, Ant Design 4, Node.js HTTP server, Jest

---

## File Map

### Shared AI context

- Create: `src/services/ai/resume-context.ts`
- Create: `src/services/ai/__tests__/resume-context.test.ts`

### Job recommendation frontend

- Create: `src/services/ai/job-recommendation.ts`
- Create: `src/components/AIJobRecommendation/index.tsx`
- Create: `src/components/AIJobRecommendation/RecommendationDrawer.tsx`
- Create: `src/components/AIJobRecommendation/RecommendationCard.tsx`
- Create: `src/components/AIJobRecommendation/index.less`
- Create: `src/components/AIJobRecommendation/__tests__/AIJobRecommendation.test.tsx`
- Modify: `src/components/ResumeEditor/index.tsx`
- Modify: `src/i18n/locales/zh-CN.json`
- Modify: `src/i18n/locales/en-US.json`

### Mock interview frontend

- Create: `src/services/ai/mock-interview.ts`
- Create: `src/components/AIMockInterview/index.tsx`
- Create: `src/components/AIMockInterview/InterviewDrawer.tsx`
- Create: `src/components/AIMockInterview/InterviewQuestionCard.tsx`
- Create: `src/components/AIMockInterview/index.less`
- Create: `src/components/AIMockInterview/__tests__/AIMockInterview.test.tsx`
- Modify: `src/pages/preview.tsx`
- Modify: `src/pages/preview.less`
- Modify: `src/i18n/locales/zh-CN.json`
- Modify: `src/i18n/locales/en-US.json`

### Shared AI types

- Modify: `src/services/ai/types.ts`

### Server routes and prompt builders

- Create: `server/routes/job-recommendation.js`
- Create: `server/routes/mock-interview.js`
- Create: `server/prompts/job-recommendation.js`
- Create: `server/prompts/mock-interview.js`
- Create: `server/__tests__/job-recommendation.test.js`
- Create: `server/__tests__/mock-interview.test.js`
- Modify: `server/index.js`

### Documentation

- Modify: `README.md`
- Modify: `README.en.md`

## Task 1: Add Shared Resume Context Builder

**Files:**
- Create: `src/services/ai/resume-context.ts`
- Test: `src/services/ai/__tests__/resume-context.test.ts`

- [ ] **Step 1: Write the failing test**

Add tests covering:
- summary extraction
- work/project list normalization
- skill extraction
- language passthrough

Example cases:

```ts
expect(buildResumeAIContext(sampleResume, 'zh-CN')).toMatchObject({
  language: 'zh-CN',
  summary: expect.any(String),
  workExperience: expect.any(Array),
  projects: expect.any(Array),
  skills: expect.any(Array),
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/services/ai/__tests__/resume-context.test.ts
```

Expected:
- FAIL because `resume-context.ts` does not exist yet

- [ ] **Step 3: Write minimal implementation**

Create `buildResumeAIContext(resume, language)` that:
- reads `profile`, `aboutme`, `educationList`, `workExpList`, `projectList`, `skillList`
- strips empty values
- returns compact structured AI input

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- src/services/ai/__tests__/resume-context.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/ai/resume-context.ts src/services/ai/__tests__/resume-context.test.ts
git commit -m "feat: add shared resume AI context builder"
```

## Task 2: Add Shared Career Tool Types

**Files:**
- Modify: `src/services/ai/types.ts`

- [ ] **Step 1: Add failing type-level usage in next task tests**

Reference the following planned types from tests/components:
- `AIJobRecommendationResponse`
- `AIRecommendedRole`
- `AIMockInterviewResponse`
- `AIMockInterviewQuestion`

- [ ] **Step 2: Run tests to verify type errors**

Run:

```bash
npm test -- src/services/ai/__tests__/resume-context.test.ts
```

Expected:
- TypeScript/Jest compile error if new types are referenced before definition

- [ ] **Step 3: Add minimal types**

Add:

```ts
export type AIRecommendedRole = {
  title: string;
  score: number;
  industries: string[];
  companyTypes: string[];
  techTags: string[];
  reasons: string[];
  suggestions: string[];
};
```

and corresponding interview types.

- [ ] **Step 4: Run test suite for type validation**

Run:

```bash
npm test -- src/services/ai/__tests__/resume-context.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/ai/types.ts
git commit -m "feat: add AI career tool response types"
```

## Task 3: Add Job Recommendation Server Prompt Builder

**Files:**
- Create: `server/prompts/job-recommendation.js`
- Test: `server/__tests__/job-recommendation.test.js`

- [ ] **Step 1: Write failing prompt test**

Test should verify the prompt:
- positions model as senior recruiter / HR
- asks for role direction, industries, company types, tech tags
- explicitly forbids recommending concrete company names
- demands strict JSON output

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- server/__tests__/job-recommendation.test.js
```

Expected:
- FAIL because prompt builder does not exist

- [ ] **Step 3: Implement prompt builder**

Create `buildJobRecommendationPrompt(resumeContext, language)` with:
- Chinese and English branches
- strict JSON schema instruction
- explicit fields:
  - `summary`
  - `roles`
  - `title`
  - `score`
  - `industries`
  - `companyTypes`
  - `techTags`
  - `reasons`
  - `suggestions`

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- server/__tests__/job-recommendation.test.js
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add server/prompts/job-recommendation.js server/__tests__/job-recommendation.test.js
git commit -m "feat: add job recommendation prompt builder"
```

## Task 4: Add Mock Interview Server Prompt Builder

**Files:**
- Create: `server/prompts/mock-interview.js`
- Modify: `server/__tests__/mock-interview.test.js`

- [ ] **Step 1: Write failing prompt test**

Test should verify the prompt:
- asks for resume-based interview questions
- requires project/work-based questions
- forbids generic interview dumps
- demands strict JSON output

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- server/__tests__/mock-interview.test.js
```

Expected:
- FAIL because prompt builder does not exist

- [ ] **Step 3: Implement prompt builder**

Create `buildMockInterviewPrompt(resumeContext, language)` that:
- requests 6 questions
- requests `summary`, `questions`, `intent`, `answerGuidance`, `resumeEvidence`
- forces resume-based question generation

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- server/__tests__/mock-interview.test.js
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add server/prompts/mock-interview.js server/__tests__/mock-interview.test.js
git commit -m "feat: add mock interview prompt builder"
```

## Task 5: Add Job Recommendation Server Route

**Files:**
- Create: `server/routes/job-recommendation.js`
- Modify: `server/__tests__/job-recommendation.test.js`
- Modify: `server/index.js`

- [ ] **Step 1: Write failing route tests**

Cover:
- missing resume payload -> `AI_BAD_REQUEST`
- valid provider result -> normalized success response
- invalid model JSON -> `AI_INVALID_RESPONSE`

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- server/__tests__/job-recommendation.test.js
```

Expected:
- FAIL because route does not exist

- [ ] **Step 3: Implement route**

Route should:
- validate `resume`
- build prompt with prompt builder
- call existing provider router
- parse structured JSON
- return `{ summary, roles }`

- [ ] **Step 4: Register route in server entry**

Add `POST /api/ai/job-recommendation` in `server/index.js`

- [ ] **Step 5: Run route test**

Run:

```bash
npm test -- server/__tests__/job-recommendation.test.js
```

Expected:
- PASS

- [ ] **Step 6: Commit**

```bash
git add server/routes/job-recommendation.js server/index.js server/__tests__/job-recommendation.test.js
git commit -m "feat: add AI job recommendation route"
```

## Task 6: Add Mock Interview Server Route

**Files:**
- Create: `server/routes/mock-interview.js`
- Modify: `server/__tests__/mock-interview.test.js`
- Modify: `server/index.js`

- [ ] **Step 1: Write failing route tests**

Cover:
- missing resume payload
- success path
- invalid JSON response

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- server/__tests__/mock-interview.test.js
```

Expected:
- FAIL

- [ ] **Step 3: Implement route**

Route should:
- validate `resume`
- build prompt
- call provider router
- parse `{ summary, questions }`

- [ ] **Step 4: Register route in server entry**

Add `POST /api/ai/mock-interview` in `server/index.js`

- [ ] **Step 5: Run route test**

Run:

```bash
npm test -- server/__tests__/mock-interview.test.js
```

Expected:
- PASS

- [ ] **Step 6: Commit**

```bash
git add server/routes/mock-interview.js server/index.js server/__tests__/mock-interview.test.js
git commit -m "feat: add AI mock interview route"
```

## Task 7: Add Job Recommendation Frontend Service

**Files:**
- Create: `src/services/ai/job-recommendation.ts`
- Create: `src/services/ai/__tests__/job-recommendation.test.ts`

- [ ] **Step 1: Write failing client test**

Cover:
- builds proxy URL
- sends `resume` + `language`
- maps upstream errors

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/services/ai/__tests__/job-recommendation.test.ts
```

Expected:
- FAIL

- [ ] **Step 3: Implement service**

Add `requestJobRecommendation({ resume, language })`

Follow the existing `improveResumeField` style:
- same proxy base URL logic
- same error mapping style

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- src/services/ai/__tests__/job-recommendation.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/ai/job-recommendation.ts src/services/ai/__tests__/job-recommendation.test.ts
git commit -m "feat: add job recommendation client"
```

## Task 8: Add Mock Interview Frontend Service

**Files:**
- Create: `src/services/ai/mock-interview.ts`
- Create: `src/services/ai/__tests__/mock-interview.test.ts`

- [ ] **Step 1: Write failing client test**

Cover:
- proxy URL usage
- request body shape
- error mapping

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/services/ai/__tests__/mock-interview.test.ts
```

Expected:
- FAIL

- [ ] **Step 3: Implement service**

Add `requestMockInterview({ resume, language })`

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- src/services/ai/__tests__/mock-interview.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/ai/mock-interview.ts src/services/ai/__tests__/mock-interview.test.ts
git commit -m "feat: add mock interview client"
```

## Task 9: Build AI Job Recommendation Drawer UI

**Files:**
- Create: `src/components/AIJobRecommendation/index.tsx`
- Create: `src/components/AIJobRecommendation/RecommendationDrawer.tsx`
- Create: `src/components/AIJobRecommendation/RecommendationCard.tsx`
- Create: `src/components/AIJobRecommendation/index.less`
- Create: `src/components/AIJobRecommendation/__tests__/AIJobRecommendation.test.tsx`
- Modify: `src/components/ResumeEditor/index.tsx`
- Modify: `src/i18n/locales/zh-CN.json`
- Modify: `src/i18n/locales/en-US.json`

- [ ] **Step 1: Write failing component test**

Cover:
- button renders
- drawer opens
- loading state shows
- recommendation cards render
- error state renders

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/components/AIJobRecommendation/__tests__/AIJobRecommendation.test.tsx
```

Expected:
- FAIL

- [ ] **Step 3: Implement minimal UI**

UI should:
- render button
- open drawer
- call `buildResumeAIContext`
- call `requestJobRecommendation`
- render `summary` and role cards

- [ ] **Step 4: Wire into editor page**

Modify `src/components/ResumeEditor/index.tsx` to place the button in the tool area

- [ ] **Step 5: Add i18n text**

Add labels for:
- `AI岗位推荐`
- loading
- error
- summary labels
- score labels

- [ ] **Step 6: Run component test**

Run:

```bash
npm test -- src/components/AIJobRecommendation/__tests__/AIJobRecommendation.test.tsx
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/AIJobRecommendation src/components/ResumeEditor/index.tsx src/i18n/locales/zh-CN.json src/i18n/locales/en-US.json
git commit -m "feat: add AI job recommendation drawer"
```

## Task 10: Build AI Mock Interview Drawer UI

**Files:**
- Create: `src/components/AIMockInterview/index.tsx`
- Create: `src/components/AIMockInterview/InterviewDrawer.tsx`
- Create: `src/components/AIMockInterview/InterviewQuestionCard.tsx`
- Create: `src/components/AIMockInterview/index.less`
- Create: `src/components/AIMockInterview/__tests__/AIMockInterview.test.tsx`
- Modify: `src/pages/preview.tsx`
- Modify: `src/pages/preview.less`
- Modify: `src/i18n/locales/zh-CN.json`
- Modify: `src/i18n/locales/en-US.json`

- [ ] **Step 1: Write failing component test**

Cover:
- button renders
- drawer opens
- loading state shows
- question list renders
- error state renders

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/components/AIMockInterview/__tests__/AIMockInterview.test.tsx
```

Expected:
- FAIL

- [ ] **Step 3: Implement minimal UI**

UI should:
- render button in preview toolbar
- open drawer
- call `buildResumeAIContext`
- call `requestMockInterview`
- render summary and question cards

- [ ] **Step 4: Wire into preview page**

Modify `src/pages/preview.tsx` and `src/pages/preview.less`

- [ ] **Step 5: Add i18n text**

Add labels for:
- `AI模拟面试`
- question sections
- answer guidance
- interview intent

- [ ] **Step 6: Run component test**

Run:

```bash
npm test -- src/components/AIMockInterview/__tests__/AIMockInterview.test.tsx
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/AIMockInterview src/pages/preview.tsx src/pages/preview.less src/i18n/locales/zh-CN.json src/i18n/locales/en-US.json
git commit -m "feat: add AI mock interview drawer"
```

## Task 11: Run Focused Verification

**Files:**
- No new files

- [ ] **Step 1: Run all new AI career tool tests**

Run:

```bash
npm test -- src/services/ai/__tests__/resume-context.test.ts src/services/ai/__tests__/job-recommendation.test.ts src/services/ai/__tests__/mock-interview.test.ts src/components/AIJobRecommendation/__tests__/AIJobRecommendation.test.tsx src/components/AIMockInterview/__tests__/AIMockInterview.test.tsx server/__tests__/job-recommendation.test.js server/__tests__/mock-interview.test.js
```

Expected:
- PASS

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected:
- PASS

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected:
- PASS with existing historical Gatsby warnings only

- [ ] **Step 4: Manual smoke verification**

Check locally:
- editor page button opens recommendation drawer
- preview page button opens interview drawer
- both tools show loading and error states
- both tools render valid structured results

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: verify AI career tools flow"
```

## Task 12: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `README.en.md`

- [ ] **Step 1: Document new features**

Update feature list to mention:
- `AI岗位推荐`
- `AI模拟面试`

- [ ] **Step 2: Document AI routes and scope**

Add a short section covering:
- these tools also use the AI proxy
- they are resume-based analysis tools
- first phase does not include real-time job matching or multi-turn interviews

- [ ] **Step 3: Run docs sanity check**

Review for:
- route names
- feature names
- current architecture wording

- [ ] **Step 4: Commit**

```bash
git add README.md README.en.md
git commit -m "docs: add AI career tools usage notes"
```

## Final Output

When all tasks are complete, the project should provide:

- editor-side AI job recommendation
- preview-side AI mock interview
- shared resume context builder
- dedicated AI routes for both tools
- structured, testable JSON responses
- updated docs and i18n
