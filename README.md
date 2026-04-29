# CapitalBridge Frontend

Production-style e-funding frontend built with:

- React
- Tailwind CSS
- Zustand
- Axios
- React Router

## Features

- JWT authentication with localStorage persistence
- Axios interceptor with bearer token support
- Protected routes by role
- Public marketing pages:
  - Home
  - About
  - Testimonials
  - FAQ
- Investor flow:
  - Browse projects
  - Project detail
  - Investment request
  - Investor dashboard
  - Razorpay payment trigger
- Customer flow:
  - Create project
  - Customer dashboard
  - Project analytics
  - Investment request approval and rejection
  - Investor report view
- Admin flow:
  - Admin dashboard
  - Manage projects
  - Reports management
  - User block controls
- Reusable UI:
  - Cards
  - Tables
  - Modals
  - Status badges
  - Toasts
  - Loading states
  - Empty states

## Project Structure

```text
src/
  components/
  hooks/
  layouts/
  pages/
  services/
  store/
  utils/
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Set your backend values in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_RAZORPAY_KEY=your_razorpay_key
```

4. Start development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Important Backend Alignment Notes

This frontend is production-structured, but because your Spring Boot API contracts were not present in this workspace, a few response shapes are inferred.

Please verify these endpoints and field names:

### Auth

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`

Expected login/register response should include:

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "INVESTOR"
  }
}
```

### Projects

- `GET /projects`
- `GET /projects/:id`
- `POST /api/projects`

Recommended project fields:

```json
{
  "id": 1,
  "title": "Project title",
  "description": "Project description",
  "goalAmount": 1000000,
  "currentFunding": 250000,
  "equityOffered": 12,
  "totalEquityOffered": 12,
  "equitySold": 4,
  "deadline": "2026-06-30",
  "status": "ACTIVE",
  "likes": 12,
  "shares": 3,
  "commentsCount": 7,
  "investorCount": 9,
  "creatorName": "Founder Name",
  "investors": []
}
```

### Investment Requests

- `POST /api/investment-request`
- `GET /api/investment-request/investor`
- `GET /api/investment-request/customer`
- `PATCH /api/investment-request/:id/status`

Recommended request shape:

```json
{
  "id": 10,
  "projectId": 1,
  "projectTitle": "Project title",
  "investorName": "Investor Name",
  "amount": 50000,
  "equityPercentage": 2.5,
  "status": "PENDING"
}
```

### Payments

- `POST /api/payments/create-order`
- `POST /api/payments/verify`

Recommended order response:

```json
{
  "id": "order_xxx",
  "amount": 50000,
  "currency": "INR"
}
```

### Chat

- `GET /api/chat/:projectId`
- `POST /api/chat/:projectId`

Recommended message shape:

```json
{
  "id": 1,
  "senderName": "Founder",
  "message": "Hello",
  "createdAt": "2026-04-18T10:00:00Z"
}
```

### Reports

- `POST /api/reports`
- `GET /admin/reports`
- `PATCH /admin/reports/:id`

### Admin

- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/users/:id/block`
- `DELETE /admin/projects/:id`

## Main Files

- `src/router.jsx`
- `src/services/api.js`
- `src/store/authStore.js`
- `src/store/projectStore.js`
- `src/store/investmentStore.js`
- `src/store/adminStore.js`

## Completed Verification

- Dependencies installed
- Production build passed with `npm run build`

## Suggested Next Step

If you want, I can do the next alignment pass for your exact backend by mapping your real Spring Boot DTOs and endpoints one by one into this frontend.
