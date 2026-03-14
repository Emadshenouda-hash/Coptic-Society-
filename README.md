# Grand Coptic Benevolent Society — Official Website

The official website of **The Grand Coptic Benevolent Society** (الجمعية القبطية الخيرية الكبرى), a charitable, non-profit organisation founded in Cairo in **1881** to serve needy families, enhance social justice, and promote cultural awareness across Egypt.

**Live site:** https://www.coptic-society.org

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Cloud Storage |
| AI | Google Genkit (bylaws summarisation) |
| Deployment | Firebase App Hosting |

---

## Features

- **Bilingual (EN/AR)** — Full English/Arabic support with RTL layout switching
- **CMS** — Firestore-backed dynamic content editable via the admin panel
- **Admin Panel** — Authenticated dashboard for managing news, programs, board members, documents, and media
- **Donation Form** — Donation intake with Firestore storage
- **Contact Form** — Multi-field contact submissions stored in Firestore
- **AI Bylaws Summariser** — Upload a PDF and get an AI-generated summary via Google Genkit
- **SEO** — Per-page metadata, Open Graph, Twitter Cards, sitemap.xml, robots.txt, JSON-LD schema
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigation support

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project ([create one here](https://console.firebase.google.com/))
- A Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/your-org/Coptic-Society-.git
cd Coptic-Society-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project credentials (found in Firebase Console → Project Settings → Your apps → SDK setup):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_key
```

### 4. Set up Firebase

1. Enable **Firestore**, **Authentication** (Email/Password), and **Storage** in the Firebase Console.
2. Deploy Firestore and Storage security rules:

```bash
firebase deploy --only firestore:rules,storage
```

3. Create your first admin user:
   - Sign in via Firebase Console → Authentication → Add user
   - In Firestore, create a document at `roles_admin/{uid}` with any field (e.g., `role: "admin"`)

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### 6. (Optional) Run the Genkit AI dev server

```bash
npm run genkit:dev
```

---

## Project Structure

```
src/
├── app/
│   ├── (main)/          # Public-facing website routes
│   │   ├── page.tsx     # Homepage (server component)
│   │   ├── home-client.tsx
│   │   ├── about/
│   │   ├── programs/
│   │   ├── news/
│   │   ├── governance/
│   │   ├── membership/
│   │   ├── bylaws/
│   │   ├── contact/
│   │   └── donate/
│   ├── admin/           # Protected admin panel
│   ├── layout.tsx       # Root layout (fonts, metadata, JSON-LD)
│   ├── sitemap.ts       # Sitemap generation
│   ├── robots.ts        # robots.txt generation
│   └── not-found.tsx    # Custom 404 page
├── components/
│   ├── layout/          # Header, Footer
│   ├── admin/           # Admin panel components
│   ├── auth/            # Login form
│   └── ui/              # shadcn/ui components
├── context/
│   └── language-context.tsx   # EN/AR language switching
├── firebase/            # Firebase SDK setup and hooks
├── hooks/               # Custom React hooks
├── lib/
│   ├── content.ts       # Static fallback content
│   └── definitions.ts   # TypeScript types
└── ai/
    └── flows/           # Genkit AI flows
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (port 9002) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type check |
| `npm run genkit:dev` | Start Genkit AI development server |

---

## Deployment

This project is configured for **Firebase App Hosting**.

```bash
firebase deploy
```

See `apphosting.yaml` for hosting configuration.

---

## Adding Content

All public content can be managed through the admin panel at `/admin`. The admin panel supports:

- **News posts** — Create, edit, and publish bilingual news articles
- **Programs** — Manage program descriptions and images
- **Board members** — Maintain the board of directors listing
- **Pages** — Override static page content with dynamic Firestore content
- **Documents** — Upload and manage downloadable documents
- **Media** — Upload and manage images

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please ensure `npm run lint` and `npm run typecheck` pass before submitting.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Contact

**The Grand Coptic Benevolent Society**
175 Ramsis Street, Cairo, Egypt
P.O. Box 47, Fagalah, Cairo, Egypt
Phone: +20 2 591 2234
Email: info@coptic-society.org
