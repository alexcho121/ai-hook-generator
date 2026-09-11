# AI Hook Generator

AI Hook Generator is a web app that creates Korean hook lines for short-form content.

The app takes a content idea and a target platform, then returns five possible opening lines. It also scores the lines and saves them in a local H2 database.

This repo is a cleaned portfolio copy of a 4-person university team project. It does not include the original Git history, local build files, local database files, or real secrets.

## What The App Solves

Short-form videos need a strong first line. Many creators know their topic, but it can be hard to turn that topic into a short sentence that fits YouTube Shorts, TikTok, Instagram Reels, or a blog post.

This app helps by turning a rough idea into several hook options. The backend also scores each result so the frontend can show recommended lines.

## Main Features

- Write a content idea in natural language
- Choose one or more platforms
- Generate five Korean hook lines
- Score each hook on the backend
- Save generated hooks in H2
- Track when a generated hook is copied
- Use fallback hooks when the OpenAI API is not available
- Connect a React frontend to a Spring Boot backend

## Project Origin

This project was first built as a university team project by four people.

The team built the overall app together:

| Area | Work |
| --- | --- |
| Frontend | React UI, input area, result view, styling, page sections |
| Backend | Spring Boot API, request and response objects, generation endpoint |
| Database and QA | H2 history storage, schema notes, backend tests |
| AI and scoring | OpenAI calls, prompt flow, scoring, fallback behavior |

This repo is my personal portfolio copy. It keeps the team project structure, but removes unsafe files and updates the setup for public use.

## My Contribution

My main work was on the backend and AI parts.

I worked on:

- Backend hook generation logic
- OpenAI API calls from the Spring Boot service
- A two-step prompt flow
- Validation around user input and AI output
- Fallback behavior when AI calls fail
- Feature extraction for generated hook text
- Scoring logic for hook quality
- Saving generated hooks to history
- Updating scores based on copy and regenerate actions
- Connecting the frontend API layer to the backend in this portfolio copy

## Request Flow

```text
User enters an idea in the React frontend
  |
  | POST /api/hooks/generate
  v
Spring Boot backend
  |
  | Step 1: ask OpenAI to parse the input into JSON
  | Step 2: ask OpenAI to generate hook lines
  | If OpenAI fails: use fallback hook lines
  v
Backend scores each hook
  |
  v
Backend saves results in H2
  |
  v
Frontend shows the generated hooks
```

When a user copies a hook:

```text
Frontend copies the text
  |
  | POST /api/history/{id}/copy
  v
Backend updates copy count and score
```

## Tech Stack

Frontend:

- React 19
- Vite 8
- JavaScript
- CSS
- ESLint

Backend:

- Java 17
- Spring Boot 4.0.6
- Spring Web
- Spring Validation
- Spring Data JPA
- H2 Database
- Lombok
- Gradle

External API:

- OpenAI Responses API

The OpenAI API key is only used by the backend. The frontend never receives it.

## AI Workflow

The backend uses two AI calls.

### Step 1: Parse The User Input

The first prompt asks the model to turn the user's text into JSON. The JSON includes fields like:

- `topic`
- `targetAudience`
- `tone`
- `category`
- `platforms`
- `hookGoal`
- `language`
- `confidence`

If this step fails, the backend creates a simple fallback object from the original request.

### Step 2: Generate Hook Lines

The second prompt asks the model to create five Korean hook lines from the parsed input.

Each hook includes:

- `text`
- `hookType`
- `emotionTrigger`
- `tone`
- `keywords`
- `curiosityLevel`
- `naturalness`
- `platformFit`

The backend checks and normalizes the response before saving it.

## Scoring

The backend calculates three types of score.

`qualityScore` is based on:

- Keyword overlap with the user input
- Curiosity level
- Question words
- Negative or urgency words
- Sentence length
- Platform fit
- Naturalness

`engagementScore` is based on:

- How many times a hook was shown
- How many times it was copied
- How many times users regenerated instead

`score` is the final score returned to the frontend.

Before there is any user interaction:

```text
score = qualityScore
```

After copy or regenerate actions:

```text
score = qualityScore * 0.8 + engagementScore * 0.2
```

## Fallback Behavior

The app can still run without an OpenAI API key.

If the key is missing, or if the OpenAI request fails, the backend returns built-in fallback hook lines. These are still saved and scored in the same way as normal results.

This makes local testing easier. Real AI output still requires an OpenAI API key.

## API Endpoints

### Generate Hooks

```http
POST /api/hooks/generate
```

Request:

```json
{
  "input": "Workout meal tips for beginners",
  "platforms": ["youtube"],
  "previousHistoryIds": [1, 2, 3]
}
```

Response:

```json
{
  "results": [
    {
      "id": 1,
      "text": "Example generated hook",
      "provider": "gpt-5.4-mini",
      "score": 82
    }
  ]
}
```

`previousHistoryIds` is optional. The frontend sends it when the user regenerates results.

### List History

```http
GET /api/history
```

Returns saved hook history.

### Save History

```http
POST /api/history
```

Creates a history row. The generate endpoint already saves generated hooks, so this is mostly useful for testing or future UI work.

### Record Copy

```http
POST /api/history/{id}/copy
```

Increments the hook's copy count and recalculates the score.

## Local Setup

### Requirements

- Node.js 18 or newer
- Java 17 or newer
- An OpenAI API key if you want real AI output

### Backend

```bash
cd back
./gradlew bootRun
```

The backend runs at:

```text
http://localhost:8080
```

For real AI output, set `OPENAI_API_KEY` in your shell or local environment before starting the backend.

Without the key, the backend still runs and returns fallback hooks.

### Frontend

```bash
cd front
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:3456
```

The frontend calls the backend at `http://localhost:8080` by default.

To change this, create `front/.env` locally:

```env
VITE_API_BASE_URL=http://localhost:8080
```


## Environment Variables

Backend:

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | empty | Server-side OpenAI API key |
| `OPENAI_MODEL` | `gpt-5.4-mini` | Model name used by the backend |
| `OPENAI_RESPONSES_URL` | `https://api.openai.com/v1/responses` | OpenAI Responses API URL |
| `PORT` | `8080` | Backend port |
| `SPRING_DATASOURCE_URL` | `jdbc:h2:file:./data/hookdb` | H2 database path |
| `SPRING_DATASOURCE_USERNAME` | `sa` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | empty | Database password |

Frontend:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |

## Project Structure

```text
ai-hook-generator/
├── api/
├── back/
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── src/test/java/
├── db/
└── front/
    ├── public/
    └── src/
```

## Limits

- The app is mainly built for Korean hook generation.
- H2 is used for local development and demos.
- There is no full history page in the frontend yet.
- Frontend error messages are still basic.
- The UI is mostly unchanged from the university project.
- A real OpenAI API key is needed for real AI output.

## Development Commands

Frontend:

```bash
cd front
npm run lint
npm run build
```

Backend:

```bash
cd back
./gradlew build
```

## Safety Notes

This copy does not include the original Git history.

It also excludes generated files, dependency folders, local database files, `.env` files, and real secrets.

Real secrets should only be set through environment variables or ignored local files.
