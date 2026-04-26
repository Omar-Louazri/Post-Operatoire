# Application de Suivi Post-Operatoire et de Reeducation

Monorepo full-stack pour le suivi post-operatoire avec:

- `frontend/`: Next.js 16.2 + App Router + TypeScript + shadcn/ui
- `backend/`: cinq microservices Django 6.0 exposes en REST
- `docker-compose.yml`: stack complete avec un frontend, cinq APIs et PostgreSQL

Note de version: Django `15` n'existe pas au 25 avril 2026. Le projet est donc scaffold sur Django `6.0.x`, qui est la version stable actuelle, avec Next.js `16.2.x`.

## Microservices

- `recovery-plan-service`: bibliotheque de parcours post-op types
- `questionnaire-service`: questionnaires de suivi et soumissions
- `exercise-guidance-service`: exercices guides et criteres de validation
- `complication-alert-service`: evaluation des signaux d'alerte
- `care-coordination-service`: coordination interprofessionnelle

## Demarrage rapide

```bash
docker-compose up --build
```

Applications exposees:

- Frontend: `http://localhost:${FRONTEND_PORT:-3000}`
- Recovery plan API: `http://localhost:8001/api/`
- Questionnaire API: `http://localhost:8002/api/`
- Exercise guidance API: `http://localhost:8003/api/`
- Complication alert API: `http://localhost:8004/api/`
- Care coordination API: `http://localhost:8005/api/`

## Structure

```text
.
├── frontend/
├── backend/
│   ├── recovery-plan-service/
│   ├── questionnaire-service/
│   ├── exercise-guidance-service/
│   ├── complication-alert-service/
│   ├── care-coordination-service/
│   ├── docker/
│   ├── requirements.txt
│   └── scripts/
└── docker-compose.yml
```

## Developpement local

Backend local avec l'environnement cree dans ce repo:

```bash
.venv/bin/python backend/recovery-plan-service/manage.py runserver 0.0.0.0:8001
```

Frontend local:

```bash
cd frontend
npm run dev
```

Le frontend consomme par defaut les URLs locales `localhost:8001` a `localhost:8005` hors Docker, et les noms de services Docker dans `docker-compose.yml`.
