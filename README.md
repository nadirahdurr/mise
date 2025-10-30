# Mise - Let's make something out of nothing

A beautiful, AI-powered recipe generation app that helps you turn whatever ingredients you have into delicious meals. Built with Next.js, OpenAI, and Supabase.

## Features

### 🧠 **AI Recipe Generation**

- Uses OpenAI custom responses with advanced prompting for consistent, high-quality recipes
- Supports both text ingredients and image uploads
- Smart vibe selection (Asian, Italian, Quick 15-min, Comfort Food, etc.)
- Custom vibe creation with add/remove functionality
- "Let Mise Decide" option for surprise recipes

### 📸 **Advanced Image Processing**

- Upload photos of your ingredients for automatic recipe generation
- Intelligent image compression using Sharp to optimize for AI processing
- Support for both ingredient text and images in a single recipe request
- Flexible input: ingredients and/or photos

### 🎨 **Beautiful, Responsive UI**

- Designed with a calm, minimal aesthetic inspired by chef's mise en place
- Fully responsive design for desktop, tablet, and mobile
- Smooth animations and transitions
- Toast notifications for user feedback

### 📚 **Complete Recipe & Cookbook Management**

- Save and organize recipes in custom cookbooks
- Full CRUD operations - create, read, update, and delete recipes and cookbooks
- Recipe list with hover-to-delete functionality
- Individual recipe pages with detailed view and management options
- Cookbook customization with covers, colors, and styles

### 🔍 **Smart Search & Organization**

- Search recipes by title, description, or cuisine tags
- Filter and organize by cooking style, difficulty, and time
- Pagination for large recipe collections
- Real-time search results

### 📄 **Professional PDF Export**

- Generate beautiful cookbook PDFs with custom styling
- Multi-page recipe support for long recipes
- Professional layout with cover pages and recipe details
- Fallback HTML export for universal compatibility

### 🖼️ **AI-Generated Recipe Images**

- Recipes include beautiful AI-generated photos using OpenAI's image models
- Support for both URL and base64 image formats
- Permanent image storage in database

## Brand Identity

Mise embodies the calm confidence of a professional kitchen with a warm, approachable interface. The design uses:

- **Colors**: Warm neutrals (Bone, Butcher Paper) with organic accents (Olive Oil Gold, Herb Green)
- **Typography**: Spectral for headings, Inter for UI elements
- **Tone**: Minimal but human, functional but soft, professional but cozy

## Tech Stack

### **Core Framework**

- **Next.js 16**: App Router with TypeScript
- **React 18**: Latest features with hooks and server components
- **TypeScript**: Full type safety throughout the application

### **Styling & UI**

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Design System**: Curated color palette and typography
- **Lucide React**: Beautiful, consistent icons
- **React Hot Toast**: Elegant notification system

### **Backend & Database**

- **Next.js API Routes**: Serverless functions with full TypeScript support
- **Supabase**: PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)**: Secure data access policies
- **Service Role Keys**: Bypass RLS for server-side operations

### **AI & Image Processing**

- **OpenAI Custom Responses**: Advanced prompt engineering for consistent results
- **OpenAI Image Generation**: Support for multiple image models (gpt-image-1, DALL-E)
- **Sharp**: High-performance image processing and compression
- **Base64 & URL Image Handling**: Flexible image format support

### **PDF Generation**

- **Puppeteer**: Server-side PDF generation from HTML
- **Custom CSS**: Professional cookbook layouts with page break support
- **Fallback HTML Export**: Universal compatibility when PDF fails

### **Development & Deployment**

- **ESLint & TypeScript**: Code quality and type checking
- **Vercel**: Optimized deployment platform
- **Environment Management**: Secure configuration handling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mise.git
cd mise
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Database Setup

**🚨 IMPORTANT: Database Setup Required**

The application requires a PostgreSQL database with specific tables and RLS policies.

#### Method 1: Automated Setup (Recommended)

```bash
npm run setup
```

This runs `./setup-db.sh` which provides step-by-step instructions.

#### Method 2: Manual Setup

1. **Go to Supabase SQL Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

2. **Run Schema**: Copy ALL contents of `database/schema.sql` and click "Run"

   - Creates `recipes`, `cookbooks`, and `cookbook_recipes` tables
   - Sets up Row Level Security (RLS) policies
   - Creates performance indexes
   - Configures proper relationships and constraints

3. **Verify Setup**: Run `database/check-existing-data.sql` to confirm tables exist

4. **Add Sample Data** (Optional): Run `database/safe-seed-data.sql`
   - 8 diverse sample recipes (Carbonara, Thai Curry, Tacos, etc.)
   - 5 sample cookbooks with different themes
   - Proper recipe-cookbook relationships

#### Database Schema Overview

```sql
-- Recipes table with full recipe data
create table recipes (
  id text primary key default concat('recipe_', extract(epoch from now()), '_', substr(gen_random_uuid()::text, 1, 8)),
  title text not null,
  description text,
  prep_time integer not null default 15,
  cook_time integer not null default 30,
  servings integer not null default 4,
  difficulty text not null default 'Medium',
  ingredients text[] not null default '{}',
  instructions text[] not null default '{}',
  cuisine_tags text[] not null default '{}',
  image_url text,
  tips text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Cookbooks for organization
create table cookbooks (
  id text primary key default concat('cookbook_', extract(epoch from now()), '_', substr(gen_random_uuid()::text, 1, 8)),
  title text not null,
  description text,
  author text not null default 'Mise Chef',
  cover_color text not null default '#5F6B3C',
  cover_photo_url text,
  cover_style text not null default 'classic',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Many-to-many relationship
create table cookbook_recipes (
  id bigserial primary key,
  cookbook_id text references cookbooks(id) on delete cascade,
  recipe_id text references recipes(id) on delete cascade,
  created_at timestamptz default now(),
  unique(cookbook_id, recipe_id)
);
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
mise/
├── app/                           # Next.js 16 app directory
│   ├── api/                      # API routes (serverless functions)
│   │   ├── generate-recipe/      # Main recipe generation endpoint
│   │   ├── recipes/              # Recipe CRUD operations
│   │   │   └── [id]/            # Individual recipe operations
│   │   └── cookbooks/           # Cookbook management
│   │       └── [id]/
│   │           ├── route.ts     # Cookbook CRUD
│   │           └── export/      # PDF generation
│   ├── recipes/                 # Recipe pages
│   │   ├── page.tsx            # Recipe list with search & delete
│   │   └── [id]/               # Individual recipe view
│   ├── cookbooks/               # Cookbook pages
│   │   ├── page.tsx            # Cookbook library
│   │   └── [id]/               # Cookbook viewer with pagination
│   ├── globals.css              # Global styles & CSS variables
│   ├── layout.tsx               # Root layout with toast provider
│   └── page.tsx                # Home - main recipe generation
├── components/                   # React components
│   ├── MainInterface.tsx        # Recipe generation with image upload
│   ├── RecipeDisplay.tsx        # Recipe result display
│   ├── Sidebar.tsx              # Navigation with active states
│   ├── IngredientInput.tsx      # Smart ingredient input
│   ├── VibeSelector.tsx         # Vibe selection with custom vibes
│   ├── DeleteRecipeButton.tsx   # Recipe deletion with confirmation
│   ├── DeleteCookbookButton.tsx # Cookbook deletion with confirmation
│   ├── SaveRecipeButton.tsx     # Recipe saving functionality
│   └── CookbookCustomizationModal.tsx # Cookbook editing
├── lib/                         # Utility libraries
│   ├── supabase.ts             # Database client & TypeScript types
│   └── utils.ts                # Helper functions
├── utils/                       # Additional utilities
│   └── supabase/               # Supabase client configurations
├── database/                    # Database management
│   ├── schema.sql              # Complete database schema
│   ├── seed-data.sql           # Sample data for development
│   ├── safe-seed-data.sql      # Safe seeding script
│   └── check-existing-data.sql # Data verification queries
└── public/                     # Static assets
    └── [various image assets]
```

## API Endpoints

### POST /api/generate-recipe

Generate a recipe based on ingredients, images, and cooking preferences. Supports both JSON and FormData requests.

**JSON Body:**

```json
{
  "ingredients": ["chicken", "rice", "vegetables"],
  "vibes": ["Asian", "Quick 15-min"],
  "letMiseDecide": false
}
```

**FormData Body (with image):**

```
ingredients: JSON.stringify(["chicken", "rice"])
vibes: JSON.stringify(["Asian", "Comfort Food"])
letMiseDecide: "false"
image: File object
```

**Response:**

```json
{
  "success": true,
  "recipe": {
    "id": "recipe_123",
    "title": "Asian Chicken Rice Bowl",
    "description": "A delicious and quick meal...",
    "prep_time": 15,
    "cook_time": 20,
    "servings": 4,
    "difficulty": "Easy",
    "ingredients": [...],
    "instructions": [...],
    "cuisine_tags": ["Asian", "Quick"],
    "image_url": "data:image/png;base64,..."
  },
  "saved_to_database": true
}
```

### GET /api/recipes

Fetch saved recipes with pagination and search.

**Query params:**

- `limit`: Number of recipes (default: 20)
- `offset`: Number to skip for pagination (default: 0)

### GET /api/recipes/[id]

Fetch a specific recipe by ID.

### PUT /api/recipes/[id]

Update a recipe.

### DELETE /api/recipes/[id]

Delete a recipe and remove from all cookbooks.

### GET /api/cookbooks

Fetch all cookbooks with recipe counts.

### POST /api/cookbooks

Create a new cookbook.

### GET /api/cookbooks/[id]

Fetch a cookbook with all its recipes.

### PUT /api/cookbooks/[id]

Update cookbook details (title, description, cover, etc.).

### DELETE /api/cookbooks/[id]

Delete a cookbook (recipes remain but are removed from cookbook).

### POST /api/cookbooks/[id]/export

Generate and download a PDF of the cookbook.

**Response:** PDF file or HTML fallback for printing.

## Deployment

The app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set your environment variables in Vercel
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Key Features Implemented

### 🚀 **Recent Enhancements**

- **Flexible Image Input**: Upload photos alongside or instead of text ingredients
- **Smart Image Compression**: Automatic optimization for AI processing using Sharp
- **Complete CRUD Operations**: Full create, read, update, delete for recipes and cookbooks
- **Advanced PDF Export**: Multi-page cookbook generation with professional layouts
- **Custom Vibe System**: Add your own cooking styles beyond the defaults
- **Real-time Search**: Instant recipe filtering and organization
- **Confirmation Modals**: Safe deletion with detailed warnings
- **Responsive Design**: Fully optimized for all device sizes

### 🔧 **Technical Improvements**

- **OpenAI Custom Responses**: Advanced prompt engineering for consistent results
- **Dual Image Format Support**: Handles both URL and base64 image formats
- **Service Role Authentication**: Proper RLS bypass for server operations
- **Type-Safe APIs**: Full TypeScript coverage across all endpoints
- **Error Handling**: Comprehensive error management with user feedback
- **Performance Optimization**: Image compression, pagination, and smart caching

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run setup        # Database setup helper
```

## Environment Variables

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Development settings
NODE_ENV=development
```

## Acknowledgments

- **OpenAI**: For the incredible custom responses API and image generation models
- **Supabase**: For the excellent PostgreSQL platform with real-time capabilities
- **Next.js Team**: For the amazing App Router and server components
- **Sharp**: For high-performance image processing
- **Puppeteer**: For reliable PDF generation
- **Tailwind CSS**: For the utility-first CSS framework
- **All open-source contributors**: Who made this project possible

---

**Mise** - Because great meals start with what you already have. 🍳

_Turn your ingredients into culinary inspiration with the power of AI._
