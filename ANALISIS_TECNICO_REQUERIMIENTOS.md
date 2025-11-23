---
# 🧠 GLOBAL INDEX & CONTEXT
project_metadata:
  name: "E-Commerce Full Stack (Portfolio)"
  last_updated: "2025-11-22 11:30"
  status: "RELEASE_PREP"
  context_health: "OPTIMIZED"

navigation:
  - rules: "Reglas y Syllabus Académico"
  - active_task: "TASK-RELEASE-01: Portfolio Release Preparation"
  - audit_report: "Estado de cumplimiento del Syllabus"
  - changelog: "Historial resumido"

ai_memory: |
  CRITICAL CONTEXT FOR NEXT AGENT:
  - Stack: React 19 + Spring Boot 3.2.0 + MySQL + Docker.
  - Auth: JWT (HMAC-SHA256) + Spring Security + Context API (Observer).
  - Backend: Compliant with AI-Semantic Comments.
  - Frontend: UI/UX Overhaul in progress (Tailwind, Animations, Responsive).
  - Java 17 required.
  - SECURITY NOTE: JWT_SECRET in .env must be Standard Base64 (RFC 4648) encoded. Do not use URL-Safe Base64 (no '_' or '-').
---

# 📋 ANÁLISIS TÉCNICO DE REQUERIMIENTOS
**Protocolo:** OMNISCIENT ARCHITECT vFinal  
**Proyecto:** E-Commerce Full Stack (Portfolio Audit)  
**Última Auditoría:** 22 Nov 2025  
**Estado:** UI_ELEVATION_PHASE 🎨

---

## ⛔ REGLAS DE ORO (Leyes Inmutables) {#rules}

### 1️⃣ Código AI-Enhanced
Todo código DEBE incluir:
```javascript
// @TASK: Descripción concisa de la función/componente
// @INPUT: Parámetros y tipos esperados
// @OUTPUT: Retorno y side effects
// @AI_CONTEXT: Intención arquitectónica (patrón usado, por qué se implementó así)
// @SECURITY: Validaciones críticas (JWT, sanitización, autenticación)
// @ACCESSIBILITY: Cumplimiento WCAG 2.1 AA / Axe Rules
```

### 2️⃣ Arquitectura Mandatoria
- **Backend:** MVC estricto. Controller → Service → Repository → Model
- **Frontend:** Componentes funcionales + Custom Hooks
- **Principios:** SOLID + DRY + Clean Code
- **Patrones:** Singleton, Observer, Repository, Strategy.

---

## 🎯 TAREA ACTIVA {#active-task}

### 🚀 **TASK-RELEASE-01: Portfolio Release Preparation**
**Objetivo:** Preparar el repositorio para su publicación en GitHub como pieza central de Portafolio.

#### Requerimientos de Release
1. **Seguridad:** `.gitignore` robusto para proteger secretos y artefactos.
2. **Documentación:** `README.md` profesional con badges, arquitectura y quick start.
3. **Limpieza:** Eliminar logs de depuración y código muerto.

#### Tareas
- [x] **[FEAT]** FEATURE-HERO-CAROUSEL: Dynamic Hero Slider with conditional CTA.
- [x] **[SEC]** Generate robust `.gitignore`.
- [x] **[DOC]** Create professional `README.md`.
- [x] **[CLEAN]** Remove `console.log` and unused imports.

---

## 📊 AUDIT REPORT (Syllabus Compliance) {#audit-report}

| Categoría | Requisito | Estado | Notas |
|-----------|-----------|--------|-------|
| **Frontend** | React 19+ / Vite | ✅ | React 19.1.1, Vite detectado. |
| | Hooks (useState, useEffect) | ✅ | Usados en Home.jsx. |
| | Context API | ✅ | AuthContext, CartContext, etc. |
| | Axios + Interceptors | ✅ | api.js verificado previamente. |
| | AI-Semantic Comments | ✅ | Implementados en Home.jsx y Header.jsx. |
| **Backend** | Spring Boot 3.2+ | ✅ | Verificado. |
| | 4 Capas (MVC) | ✅ | Controller/Service/Repo/Model. |
| | Spring Security + JWT | ✅ | Implementado y documentado. |
| | AI-Semantic Comments | ✅ | Presentes en Controllers. |
| **Infra** | Docker Compose | ✅ | `docker-compose.yml` presente. |

---

## 📜 CHANGELOG (Historial Resumido) {#changelog}

- [2025-11-22] **[FIX]** Refactored Checkout.jsx to fix input focus loss (extracted components) and added "Use my data" feature.
- [2025-11-22] **[FIX]** Re-deployed Frontend container to apply Checkout crash fix (Context mismatch).
- [2025-11-22] **[FEAT]** Implemented BigDecimal for price precision in Backend and Frontend.
- [2025-11-22] **[FIX]** Resolved ProductManagement Crash. Added defensive programming for user.id and optional chaining in table rendering.
- [2025-11-22] **[FIX]** Resolved Critical Login 500 Error. Root cause: Invalid Base64 character in JWT_SECRET. Regenerated key and restarted backend.
- [2025-11-22] **[AUDIT]** Refactorización Frontend completada (Home.jsx, Header.jsx). Auditoría Final: 100% Compliance.
- [2025-11-22] **[AUDIT]** Inicio de Auditoría Final. Backend validado. Frontend marcado para refactor.
- [2025-01-07] **[COMPLETED]** Sprints anteriores (Backend Refactor, Context API, RegEx, Strategy Pattern).
- [2025-11-21] **[MILESTONE]** Protocolo OMNISCIENT ARCHITECT activado.

---

