# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-19

### Changed

- **Calendar Grid Resolution**: Adjusted the calendar body hourly tile generation logic to represent full 1-hour slots (60 minutes) instead of 50-minute slots. This prevents layout issues and ensures tutoring events scheduled in the last 10 minutes of an hour are correctly captured and rendered in their corresponding grid cell.
- **Default Lesson Duration**: Configured the event creation dialog to default the end time to exactly 50 minutes (standard lesson length) after the clicked cell's start time, improving user efficiency when scheduling new classes.

## [1.0.0] - 2026-07-19

### Added

#### 📅 Interactive Tutoring Calendar

- **Weekly Schedule Layout**: Fully responsive weekly calendar view localized to Ukrainian (`uk_UA`) with weeks starting on Monday.
- **Weekly Swiping Gesture**: Implemented seamless Touch gestures for horizontal swiping to navigate weeks using three side-by-side week containers and CSS translates.
- **Current Hour Indicator**: Real-time current-hour marker line layout that shifts dynamically based on local time.
- **Lesson Management**: Intuitive modal interfaces for creating, updating, and deleting tutoring events.
- **Recurrence Support**: Full support for recurring event sequences, including options to edit or delete individual occurrences or split/delete the remaining series.
- **Occurrence-Based Payment Tracking**: Individual event instances store localized payment state (`isPaid` and `paidAmount`), reflected directly on the calendar view.

#### 👥 Participant Management

- **Structured Overview**: Unified dashboard separating active and archived participants, with distinct tabs for **Students** and **Groups**.
- **Participant Directory**: Live list filter permitting searches by participant name.
- **Creation & Editing Modals**: Interactive forms to add and edit students/groups, configuring their name, type, and hourly billing rates.
- **Lifecycle Actions**: Full control to archive, restore (unarchive), or permanently delete participants.
- **Signal-Driven Reactive UI**: Utilizes Angular Signals for instantaneous state updates when modifying participant records.

#### 💰 Payments & Revenue Dashboard

- **Monthly Revenue Navigation**: Calendar controls to paginate and filter payment histories month-by-month.
- **Financial Statistics & Metrics**:
  - Class completion counters (total scheduled vs. completed lessons).
  - Payment tracking statistics (number of paid, upcoming, and overdue classes).
  - Income analytics: Total Received, Upcoming Expected Revenue, and Outstanding Loans (debt).
  - Paid progress bar representing percentage of completed payments for the month.
- **One-Click Payment Toggling**: Ability to mark student lessons as paid or unpaid instantly, integrating with event-based payment API endpoints (`POST /events/{eventId}/payments` and `DELETE /events/{eventId}/payments`).
- **Dynamic Alerts**: User-friendly notification popups on payment update success or failure.
- **Theme-Integrated Statuses**: Conditional styling categorizing lessons as **Paid** (styled with Coffee Bean theme colors), **Loan** (overdue unpaid past classes), or **Upcoming** (scheduled future classes).

#### 🔒 Authentication & Session Handling

- **Routing Protection**: Configured `authGuard` using `CanMatch` checks to secure features (Calendar and Admin modules) against unauthenticated access.
- **Automatic Token Rotation**: Integrated `refreshTokenInterceptor` which catches `401 Unauthorized` responses on API calls, handles automated token refresh request (`/auth/refresh`), locks concurrent API calls during rotation, and transparently replays original requests on success.
- **Credential Storage**: Automated token persistence in browser `localStorage`.
- **Third-Party SignIn**: Dedicated Google Authentication button (`google-btn`) for third-party federated login flows.
- **Custom Authentication Screens**: Responsive Login and Sign Up views with a side scheduling visual preview pane (`auth-schedule-panel`).
