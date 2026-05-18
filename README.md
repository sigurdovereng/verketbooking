# Værket bookingsystem / Verketbooking

Digitalt bookingsystem utviklet som bachelorprosjekt i IT og informasjonssystemer ved Universitetet i Sørøst-Norge. Systemet er utviklet for Værket Industribar og gir ansatte en samlet oversikt over spill, reservasjoner, gjenstående spilletid og kø.

Prosjektet er ikke et generelt open source-produkt eller en kommersiell distribusjonspakke. Det er utviklet for en konkret oppdragsgiver og må forstås i lys av bachelorprosjektets rammer og avtalen mellom partene.

## Innhold

- [Bakgrunn og formål](#bakgrunn-og-formål)
- [Hovedfunksjoner](#hovedfunksjoner)
- [Teknologistack](#teknologistack)
- [Systemarkitektur](#systemarkitektur)
- [Prosjektstruktur](#prosjektstruktur)
- [Installasjon og lokal kjøring](#installasjon-og-lokal-kjøring)
- [Miljøvariabler](#miljøvariabler)
- [API-oversikt](#api-oversikt)
- [Testing](#testing)
- [Deployment](#deployment)
- [Personvern og databehandling](#personvern-og-databehandling)
- [Juridisk merknad og bruksvilkår](#juridisk-merknad-og-bruksvilkår)
- [Kjente begrensninger og videre arbeid](#kjente-begrensninger-og-videre-arbeid)
- [Bidrag](#bidrag)

## Bakgrunn og formål

Værket Industribar hadde et praktisk behov for bedre oversikt over spillreservasjoner i baren. Ansatte måtte kunne svare raskt på hvilke spill som var ledige, hvor lenge kunder hadde igjen av spilletiden, og når nye kunder kunne få plass.

Systemet ble derfor utviklet for bartender/admin som hovedbruker. Kunder bruker ikke systemet direkte til å booke spill. De får informasjon indirekte via en offentlig displayvisning i lokalet og via SMS-varsling. Direkte kundebooking ble vurdert, men valgt bort fordi Værket håndterer forhåndsbookinger via e-post.

## Hovedfunksjoner

- Innlogging for admin/bartender.
- Oversikt over spill og om spill er ledig eller opptatt.
- Opprettelse og sletting av spill.
- Opprettelse av reservasjoner med navn, telefonnummer, spill, starttid og varighet.
- Validering som hindrer overlappende reservasjoner på samme spill.
- Oversikt over aktive og kommende reservasjoner.
- Visning av gjenstående spilletid for aktive reservasjoner.
- Dagsoversikt for reservasjoner.
- Offentlig displayvisning for aktive spill og kø.
- Displayvisningen krever ikke innlogging.
- SMS-varsling via Twilio før reservasjon starter og når spilletid nærmer seg slutt.
- Planlagte bakgrunnsjobber for statusoppdatering, SMS-varsling og opprydding av telefonnummer.

## Teknologistack

| Område | Teknologi |
| --- | --- |
| Frontend | React 18 med Create React App |
| Routing | React Router |
| Backend | Java 21 og Spring Boot 3 |
| API | REST |
| Sikkerhet | Spring Security med HTTP Basic Auth |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| SMS | Twilio |
| Deployment | Render |
| Container | Dockerfile for backend |

## Systemarkitektur

Systemet består av en React-frontend og en Spring Boot-backend som kommuniserer via REST API. Backend lagrer data i PostgreSQL og bruker Twilio for SMS-varsling.

```text
Admin/bartender
    |
    | React admin-grensesnitt
    v
Frontend (Create React App)
    |
    | REST API med Basic Auth
    v
Backend (Spring Boot)
    |
    | Spring Data JPA / Hibernate
    v
PostgreSQL

Offentlig skjerm
    |
    | Åpent GET-kall mot /api/display/queue
    v
Displayvisning i frontend

Backend
    |
    | Planlagte jobber
    v
Statusoppdatering, SMS-varsling og GDPR-opprydding
```

### Frontend-ruter

| Rute | Beskrivelse |
| --- | --- |
| `/` | Viser innlogging hvis admin ikke er autentisert, ellers dashboard. |
| `/display` | Viser offentlig køvisning for skjerm i baren. |

### Viktige frontend-komponenter

- `LoginPage`
- `Dashboard`
- `GameCard`
- `AddGameModal`
- `AddReservationModal`
- `GameDetailModal`
- `TodayOverview`
- `QueueDisplay`
- `Toast` / `useToast`

### Backend-lag

Controllere:

- `GameController`
- `ReservationController`
- `DisplayController`
- `SmsTestController`
- `TestCleanupController`

Services:

- `GameService`
- `ReservationService`
- `DisplayService`
- `ReservationNotificationService`
- `SmsService`
- `GdprCleanupService`
- `AdminUserService`

Entiteter/modeller:

- `Game`
- `Reservation`
- `AdminUser`

Database-tabeller:

- `games`
- `reservation`
- `admin_user`

## Prosjektstruktur

```text
.
├── Dockerfile
├── pom.xml
├── mvnw / mvnw.cmd
├── src/
│   ├── main/
│   │   ├── java/com/stats/verketbooking/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── VerketbookingApplication.java
│   │   └── resources/application.properties
│   └── test/
│       └── java/com/stats/verketbooking/
└── Frontend/
    ├── package.json
    ├── public/
    └── src/
        ├── app/
        ├── assets/
        ├── components/
        ├── config/
        ├── hooks/
        ├── pages/
        └── styles/
```

## Installasjon og lokal kjøring

### Forutsetninger

- Java 21
- Node.js og npm
- PostgreSQL
- Twilio-konto hvis SMS skal testes

### 1. Klon repoet

```bash
git clone <repo-url>
cd verketbooking
```

### 2. Konfigurer PostgreSQL

Opprett en lokal PostgreSQL-database og en bruker med tilgang til databasen. Legg deretter inn databaseverdiene som miljøvariabler.

Eksempel på lokal JDBC-URL:

```text
jdbc:postgresql://localhost:5432/<database-navn>
```

### 3. Start backend

Sett nødvendige miljøvariabler først. Se [Miljøvariabler](#miljøvariabler).

```bash
./mvnw spring-boot:run
```

Backend kjører som standard på port `8080`, eller på verdien fra `PORT` hvis den er satt.

### 4. Start frontend

```bash
cd Frontend
npm install
npm start
```

Frontend starter normalt på `http://localhost:3000`.

For lokal utvikling bør frontend peke mot lokal backend:

```bash
REACT_APP_API_BASE=http://localhost:8080/api npm start
```

## Miljøvariabler

Ikke legg API-nøkler, passord, database-URL-er eller andre hemmelige verdier i Git.

### Backend

| Variabel | Beskrivelse | Eksempelverdi |
| --- | --- | --- |
| `PORT` | Port for backend. | `8080` |
| `SPRING_DATASOURCE_URL` | JDBC-URL til PostgreSQL. | `jdbc:postgresql://localhost:5432/<database>` |
| `SPRING_DATASOURCE_USERNAME` | Databasebruker. | `<db-bruker>` |
| `SPRING_DATASOURCE_PASSWORD` | Databasepassord. | `<db-passord>` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate-strategi for skjema. | `update` |
| `ADMIN_USERNAME` | Brukernavn for adminbruker som opprettes ved første oppstart. | `<admin-bruker>` |
| `ADMIN_PASSWORD` | Passord for adminbruker som opprettes ved første oppstart. | `<admin-passord>` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID. | `<twilio-account-sid>` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token. | `<twilio-auth-token>` |
| `TWILIO_FROM_NUMBER` | Avsendernummer i Twilio. | `<twilio-telefonnummer>` |

### Frontend

| Variabel | Beskrivelse | Eksempelverdi |
| --- | --- | --- |
| `REACT_APP_API_BASE` | Base-URL til backend-API. | `http://localhost:8080/api` |

Hvis `REACT_APP_API_BASE` ikke er satt, bruker frontend lokal backend på localhost og en Render-URL ellers.

## API-oversikt

Alle admin-endepunkter krever HTTP Basic Auth. Display-endepunktet er åpent slik at en offentlig skjerm kan vise køstatus uten innlogging.

### Spill

| Metode | Endepunkt | Auth | Beskrivelse |
| --- | --- | --- | --- |
| `GET` | `/api/games` | Ja | Henter alle spill. |
| `POST` | `/api/games` | Ja | Oppretter nytt spill. |
| `DELETE` | `/api/games/{id}` | Ja | Sletter spill. |

Eksempel på `POST /api/games`:

```json
{
  "name": "Shuffleboard 1"
}
```

### Reservasjoner

| Metode | Endepunkt | Auth | Beskrivelse |
| --- | --- | --- | --- |
| `GET` | `/api/reservations` | Ja | Henter alle reservasjoner. |
| `POST` | `/api/reservations` | Ja | Oppretter reservasjon. Returnerer konflikt hvis tidspunkt overlapper for samme spill. |
| `DELETE` | `/api/reservations/{id}` | Ja | Sletter reservasjon. |

Eksempel på `POST /api/reservations`:

```json
{
  "name": "Ola Nordmann",
  "phoneNumber": "+4700000000",
  "gameId": 1,
  "startedAt": "2026-05-18T18:00:00.000Z",
  "endsAt": "2026-05-18T19:00:00.000Z"
}
```

Ved overlappende reservasjon på samme spill returnerer backend `409 Conflict`.

### Display

| Metode | Endepunkt | Auth | Beskrivelse |
| --- | --- | --- | --- |
| `GET` | `/api/display/queue` | Nei | Henter aktive spill og ventende kø for offentlig display. |

Eksempel på responsstruktur:

```json
{
  "activeGames": [],
  "waitingQueue": []
}
```

### Test- og driftsendepunkter

| Metode | Endepunkt | Auth | Beskrivelse |
| --- | --- | --- | --- |
| `GET` | `/test-sms?to=<telefonnummer>` | Ja | Sender test-SMS via Twilio. |
| `GET` | `/test-cleanup` | Ja | Trigger opprydding av telefonnummer manuelt. |

## Testing

### Backend

Backend-tester kjøres med Maven:

```bash
./mvnw test
```

Det finnes en enhetstest for displaylogikk (`DisplayServiceTest`) og en Spring Boot context-test. Full backend-test krever gyldig testdatabase og nødvendige miljøvariabler for Spring-konfigurasjonen.

### Frontend

Frontend bruker Create React App sitt testoppsett:

```bash
cd Frontend
npm test
```

Det finnes per nå ikke egne automatiserte frontend-tester for prosjektspesifikke komponenter.

### Build-sjekk

Frontend kan bygges med:

```bash
cd Frontend
npm run build
```

Backend kan pakkes med:

```bash
./mvnw clean package
```

## Deployment

Prosjektet er tilrettelagt for deployment på Render.

Backend kan kjøres som Java 21-applikasjon. Repoet inneholder også en `Dockerfile` som bygger backend med Maven-wrapperen og starter den genererte JAR-filen:

```bash
java -jar target/*.jar
```

Ved deployment må miljøvariablene settes i Render eller tilsvarende driftsmiljø. Dette gjelder spesielt database, adminbruker og Twilio-konfigurasjon.

Frontend bygges som en statisk React-applikasjon:

```bash
cd Frontend
npm run build
```

Endelig betalt Render-deployment og Twilio-oppsett håndteres med Værket etter rapportperioden.

## Personvern og databehandling

Systemet behandler personopplysninger knyttet til reservasjoner:

- navn
- telefonnummer
- valgt spill
- starttid og sluttid for reservasjon
- SMS-status for varslinger

Telefonnummer brukes for å sende SMS-varsler via Twilio og kan midlertidig beholdes etter en reservasjon dersom Værket trenger å kontakte kunden ved skade eller hærverk knyttet til spillutstyr. Systemet har en planlagt oppryddingsjobb (`GdprCleanupService`) som sletter telefonnummer fra ferdige, avlyste eller ikke-møtte reservasjoner. Den planlagte slettingen er satt til mandager kl. `05:00` i tidssonen `Europe/Oslo`, slik at Værket har en begrenset periode til nødvendig oppfølging før telefonnummer fjernes.

Dette skal ikke leses som en garanti for full GDPR-etterlevelse. Personvernhåndteringen er delvis implementert og bør gjennomgås før full produksjonssetting, særlig med tanke på dataminimering, sletting, logging, tilgangsstyring, databehandleravtale for Twilio og rutiner hos oppdragsgiver.

## Juridisk merknad og bruksvilkår

Repoet har ingen dedikert `LICENSE`-fil som åpner for fri bruk. Prosjektet skal derfor ikke regnes som fritt gjenbrukbart, distribuerbart eller kommersialiserbart.

Systemet er utviklet som bachelorprosjekt for Værket Industribar. Bruk utover prosjektets formål og oppdragsgivers avtalte bruk må avklares med relevante rettighetshavere og avtalepartene. README-en er kun en teknisk og praktisk oversikt, og erstatter ikke prosjektkontrakt, avtalevilkår eller juridisk vurdering.

Kode, design, dokumentasjon og eventuelle tredjepartstjenester må brukes i tråd med gjeldende avtaler, tjenestevilkår og rettigheter. Twilio, Render, PostgreSQL, Spring, React og andre tredjepartsverktøy har egne lisenser og vilkår.

## Kjente begrensninger og videre arbeid

- Full backend-test krever gyldig testdatabase og korrekt miljøkonfigurasjon.
- Frontend mangler automatiserte tester for prosjektspesifikke brukerflyter.
- Det finnes ikke UI for å redigere reservasjoner.
- Det finnes ikke egen funksjon for glemt passord.
- Det finnes ikke flere brukerroller i første versjon.
- Kalenderfunksjon ble vurdert, men ikke prioritert i bachelorprosjektet.
- Endelig betalt Render-deployment og Twilio-oppsett håndteres med Værket etter rapportperioden.
- Spillnavn kan endres lokalt i frontendvisningen, men koden har ikke et backend-endepunkt for permanent redigering av spillnavn.

## Bidrag

Prosjektet er ikke satt opp som et åpent prosjekt for eksterne bidrag. Endringer bør gjøres av prosjektgruppen eller etter avtale med oppdragsgiver og relevante rettighetshavere.
