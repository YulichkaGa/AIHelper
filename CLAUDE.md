# CLAUDE.md

Build an AI Relationship Coach app for helping me manage my relationship with Korin in a healthy, calm, and self-respecting way.

## Goal
The app helps me:
- calm down before reacting
- understand triggers
- set clear boundaries
- rewrite emotional messages
- track agreements
- choose the next mature action

Important:
The app must NOT encourage manipulation, revenge, threats, control, stalking, or pressure.
It should support calm communication, self-respect, and healthy boundaries.

## Stack
Frontend:
- React
- Vite
- TypeScript
- TailwindCSS
- React Router
- Axios

Backend:
- Node.js
- Express
- TypeScript
- MongoDB
- JWT Auth

AI:
- OpenAI API or Claude API

## Core Screens

1. Dashboard
   Show:
- current mood
- last conflict
- active boundary
- next recommended action
- AI advice

2. Trigger Check-In
   Fields:
- what happened
- what I felt
- what I wanted to send
- intensity 1-10

3. Message Rewriter
   User pastes emotional message.
   AI rewrites it into:
- calm version
- direct version
- soft version
- boundary version

4. Boundary Builder
   Create boundary:
- topic
- what hurts me
- what I need
- what I will do if it continues

5. Agreement Tracker
   Track agreements:
- title
- date
- what was agreed
- was it respected
- notes

6. Decision Assistant
   AI suggests:
- send message
- wait
- call
- write journal
- take space
- end conversation calmly

## AI Style
Answer in Hebrew.
Tone:
- short
- wise
- calm
- direct
- emotionally mature
- no drama
- no insults

Example:
“אל תשלחי עכשיו מתוך כאב. קודם תירגעי, ואז תשלחי גבול קצר וברור.”

## Database Models

User:
- id
- name
- email
- passwordHash

Trigger:
- id
- userId
- eventText
- emotion
- intensity
- draftMessage
- aiAdvice
- createdAt

Boundary:
- id
- userId
- topic
- hurt
- need
- consequence
- finalText
- createdAt

Agreement:
- id
- userId
- title
- date
- agreedText
- respected
- notes

## API Routes

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

Triggers:
- GET /api/triggers
- POST /api/triggers
- DELETE /api/triggers/:id

Boundaries:
- GET /api/boundaries
- POST /api/boundaries
- PUT /api/boundaries/:id
- DELETE /api/boundaries/:id

Agreements:
- GET /api/agreements
- POST /api/agreements
- PUT /api/agreements/:id
- DELETE /api/agreements/:id

AI:
- POST /api/ai/rewrite-message
- POST /api/ai/analyze-trigger
- POST /api/ai/next-action
- POST /api/ai/create-boundary

## Folder Structure

relationship-ai-coach/
├── client/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── types/
│       └── App.tsx
├── server/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── models/
│       ├── middleware/
│       ├── services/
│       └── index.ts
└── CLAUDE.md

## Development Order

Step 1:
Create backend server.

Step 2:
Create auth system with JWT.

Step 3:
Create MongoDB models.

Step 4:
Create trigger, boundary, and agreement APIs.

Step 5:
Create AI routes.

Step 6:
Create React frontend.

Step 7:
Create pages:
- LoginPage
- RegisterPage
- DashboardPage
- TriggerCheckInPage
- MessageRewriterPage
- BoundaryBuilderPage
- AgreementTrackerPage

Step 8:
Connect frontend to backend.

Step 9:
Add beautiful clean UI.

Step 10:
Test full flow.

## First Task
Create the full backend first.

Write full files.
Explain exactly where each file goes.
Do not skip setup commands.