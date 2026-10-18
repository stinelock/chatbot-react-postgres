## Projektbeskrivelse

Backend-delen er en lille Express-API, som forbinder chatbotten med PostgreSQL-databasen i Supabase. API'en indeholder et health-check-endpoint og et endpoint, der henter chat-tråde sorteret efter oprettelsestidspunkt.

## Opsætning

### Forudsætninger

- Node.js 20 eller nyere
- En Supabase-konto med et oprettet projekt
- Databasens tabeller oprettet med [`supabase/schema.sql`](../supabase/schema.sql)
- Valgfrit: testdata oprettet med [`supabase/seed.sql`](../supabase/seed.sql)

### Installer dependencies

Kør kommandoerne fra backend-mappen:

```bash
cd backend
npm install
```

### Konfigurer enviromental variables

Backend'en kræver følgende miljøvariabler:

| Variabel | Beskrivelse |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string til Supabase |
| `PORT` | Den port, som Express-serveren skal lytte på, for eksempel `3000` |

Opret filen `backend/.env` med følgende indhold:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
PORT=3000
```

HUSK AT TILFØJE `.env` OG `node_modules` TIL `.gitignore`

#### Find `DATABASE_URL` i Supabase

1. Åbn Supabase-dashboardet, og vælg dit projekt.
2. Click **Connect** i headeren
3. Find afsnittet **Connection string**.
4. Vælg **URI** som format.
5. Vælg den relevante connection mode. Direct connection er typisk fin lokalt, mens pooler-varianten kan være relevant i deployede miljøer.
6. Kopiér connection stringen, og erstat eventuelle placeholders med din databaseadgangskode.
7. Indsæt værdien som `DATABASE_URL` i `backend/.env`.
8. Sørg for, at `.env` ikke committes til Git, fordi connection stringen indeholder databaselegitimationsoplysninger.

Hvis databasepasswordet indeholder specialtegn, skal det URL-encodes i connection stringen.

### Start serveren i udvikling

Udviklingsscriptet bruger Node.js' watch mode og indlæser automatisk værdierne fra `.env`:

```bash
npm run dev
```

Serveren starter på `http://localhost:3000`, hvis `PORT=3000` er valgt.

### Start serveren i produktion

Produktionsscriptet starter serveren uden watch mode:

```bash
npm start
```

`npm start` indlæser ikke automatisk `.env`. Sæt derfor miljøvariablerne i shellens miljø eller start serveren med Node.js' `--env-file`-flag:

```bash
node --env-file=.env server.js
```

## API endpoints documentation

Alle endpoints returnerer JSON. CORS er aktiveret, så frontend-applikationen kan kalde API'en fra en anden origin under lokal udvikling.

### `GET /`

Returnerer et simpelt svar, som kan bruges til at kontrollere, om serveren svarer.

**Eksempel på request:**

```bash
curl http://localhost:3000/
```

**Eksempel på response:**

```json
"Velkommen til!"
```

### `GET /api/threads`

Henter alle chat-tråde fra `threads`-tabellen. Resultatet indeholder kun `id`, `title` og `created_at`, og trådene sorteres med de nyeste først.

**Eksempel på request:**

```bash
curl http://localhost:3000/api/threads
```

**Eksempel på response:**

```json
[
  {
    "id": "11111111-1111-1111-1111-111111111111",
    "title": "Lær React Router",
    "created_at": "2025-01-15T10:30:00.000Z"
  },
  {
    "id": "22222222-2222-2222-2222-222222222222",
    "title": "Hjælp til PostgreSQL",
    "created_at": "2025-01-14T16:45:00.000Z"
  }
]
```

Hvis databasen ikke kan kontaktes, returnerer endpointet HTTP 500:

```json
{
  "error": "Kunne ikke hente chat data"
}
```

## Testing section

### Test med curl

Start først serveren:

```bash
npm run dev
```

Kald derefter begge endpoints fra en anden terminal:

```bash
curl -i http://localhost:3000/
curl -i http://localhost:3000/api/threads
```

### Test i browseren

Åbn følgende adresser i en browser:

- `http://localhost:3000/`
- `http://localhost:3000/api/threads`

Browseren skal vise JSON-svaret direkte. På `/api/threads` skal resultatet være en liste over tråde fra databasen.

### Forventede resultater

- Serveren starter uden fejl, når `DATABASE_URL` og `PORT` er sat.
- `GET /` svarer med HTTP 200 og teksten `"Velkommen til!"`.
- `GET /api/threads` svarer med HTTP 200 og et JSON-array.
- Hvert element i arrayet har felterne `id`, `title` og `created_at`.
- Trådene er sorteret fra nyest til ældst efter `created_at`.
- Hvis `DATABASE_URL` mangler, stopper serveren med en tydelig fejl om, at `DATABASE_URL` skal sættes.
- Hvis databaseforespørgslen fejler, svarer `/api/threads` med HTTP 500 og en JSON-fejlbesked.

## Project structure

```text
backend/
├── README.md       # Dokumentation for backend-API'en
├── db.js           # Opretter PostgreSQL-forbindelsen fra DATABASE_URL
├── package.json    # Afhængigheder og scripts til start og udvikling
└── server.js       # Opretter Express-serveren og definerer API-ruterne
```

De vigtigste filer er:

- **`server.js`**: Initialiserer Express, aktiverer CORS, læser `PORT`, definerer endpoints og starter HTTP-serveren.
- **`db.js`**: Initialiserer `postgres`-klienten med `DATABASE_URL`. Serveren stopper med en fejl, hvis variablen mangler.
- **`package.json`**: Indeholder blandt andet `express`, `cors` og `postgres` samt scripts til `npm run dev` og `npm start`.
- **`README.md`**: Indeholder denne installations-, API- og testdokumentation.

## Learning resources

- [Express-dokumentation](https://expressjs.com/)
- [Express routing](https://expressjs.com/en/guide/routing.html)
- [Postgres.js-dokumentation](https://github.com/porsager/postgres)
- [PostgreSQL-dokumentation](https://www.postgresql.org/docs/)
- [Supabase-dokumentation](https://supabase.com/docs)
- [Supabase database connection strings](https://supabase.com/docs/guides/database/connecting-to-postgres)