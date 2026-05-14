# 🐟 AquaCulture Client

A web application for managing aquaculture operations — including fish farms, crew workers, and assignments. Built with **React 19**, **TypeScript**, **Material UI 9**, and **Vite 8**.



## ✨ Features

- **Fish Farm Management** — Create, view, update, and delete fish farms with support for geo-location (latitude/longitude), cage counts, barge status, and image uploads.
- **Worker Management** — Full CRUD for crew workers including name, email, age, role/position, certification tracking, and profile images.
- **Crew Assignment** — Assign and manage workers across fish farms with role-based positioning (CEO, Captain, Worker).
- **Search & Filtering** — Advanced search with sorting, filtering by assignment status, barge availability, cage range, and crew roles.
- **Dual View Modes** — Toggle between card view and data grid view for both fish farms and workers.
- **Interactive Map Previews** — Leaflet-powered maps displaying fish farm locations.
- **Image Uploads** — Cloudinary integration for uploading profile images and farm pictures via signed uploads.
- **Toast Notifications** — User feedback through `react-hot-toast`.
- **Custom MUI Theme** — A polished, consistent design system using Inter font with custom palette, typography, and component overrides.


## 🛠️ Tech Stack

| Category          | Technology                                     |
| ----------------- | ---------------------------------------------- |
| **Framework**     | React 19 with React Compiler                   |
| **Language**      | TypeScript 6                                   |
| **Build Tool**    | Vite 8 + Rolldown Babel Plugin                 |
| **UI Library**    | Material UI (MUI) 9 + Emotion                  |
| **Routing**       | React Router DOM 7                             |
| **HTTP Client**   | Axios                                          |
| **Maps**          | Leaflet + React Leaflet                        |
| **Icons**         | Lucide React                                   |
| **Notifications** | React Hot Toast                                |
| **Linting**       | ESLint 10 + typescript-eslint                  |
| **Formatting**    | Prettier                                       |


## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- The [AquaCulture Backend API](http://localhost:5180) running locally

### Installation

```bash
# Clone the repository
git clone https://github.com/foverokavindz/AquaCultureClient.git
cd AquaCultureClient

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Build

```bash
# Type-check and build for production
npm run build

# Preview the production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting without writing
npm run format:check
```

---

## ⚙️ Configuration

### API Base URL

The backend API endpoint is configured in `src/configs/api.config.ts`:

```typescript
export const apiConfig = {
  baseURL: 'http://localhost:5180/api', // can use .env later
  timeout: 60000,
  headers: {
    'X-App-Version': '1.0.0',
  },
};
```

Update `baseURL` to point to your backend environment.

---

## 🗺️ Routes

| Path              | Page             | Description                    |
| ----------------- | ---------------- | ------------------------------ |
| `/dashboard`      | Dashboard        | Home / overview page           |
| `/fish-farms`     | Fish Farms       | List all fish farms            |
| `/fish-farms/:id` | Fish Farm Details | View/edit a specific fish farm |
| `/workers`        | Workers          | List all workers               |
| `/workers/:id`    | Worker Details   | View/edit a specific worker    |

---

## 🏗️ Architecture

### API Abstraction

The project uses a clean **interface-based API layer** (`IApiClient`) decoupled from the Axios implementation. Services consume this interface, making the HTTP client easily swappable.

```
IApiClient (interface)  ←  AxiosClient (implementation)
       ↑
   Services (FishFarm, Worker, FileUploader)
```

### Theming

A centralized MUI theme (`src/theme/Theme.ts`) defines:
- Custom color palette (primary, secondary, semantic, borders)
- Inter font family with calibrated typography scale
- Component-level overrides for Paper, Card, Button, Input, Select, and more

### Image Uploads

Images are uploaded via a **signed upload** flow:
1. Client requests a signature from the backend (`/api/Image/sign`)
2. Client uploads directly to Cloudinary using the signed credentials
3. The returned URL is stored with the entity

