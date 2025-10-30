#!/bin/bash#!/bin/bash



# Mise Database Setup Script# Mise Database Setup Script

# This script helps you set up the Supabase database for the Mise recipe app# This script helps you set up your Mise database with sample data



echo "🍳 Mise Database Setup"echo "🍳 Setting up your Mise database with sample recipes and cookbooks..."

echo "======================"echo ""

echo ""

# Check if .env.local exists

# Colors for outputif [ ! -f .env.local ]; then

RED='\033[0;31m'    echo "❌ .env.local file not found!"

GREEN='\033[0;32m'    echo "Please copy .env.example to .env.local and fill in your Supabase credentials."

YELLOW='\033[1;33m'    echo ""

BLUE='\033[0;34m'    echo "Run: cp .env.example .env.local"

NC='\033[0m' # No Color    echo "Then edit .env.local with your Supabase URL and keys."

    exit 1

echo -e "${BLUE}This script will help you set up your Supabase database for Mise.${NC}"fi

echo ""

# Source the environment variables

# Check if database files existsource .env.local

if [ ! -f "database/schema.sql" ]; then

    echo -e "${RED}❌ Error: database/schema.sql not found!${NC}"if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then

    echo "Make sure you're running this script from the project root directory."    echo "❌ Missing Supabase credentials in .env.local"

    exit 1    echo "Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."

fi    exit 1

fi

echo -e "${YELLOW}📋 Setup Steps:${NC}"

echo ""echo "✅ Environment variables found"

echo "1. 🌐 Go to your Supabase project dashboard:"echo "📊 Supabase URL: $SUPABASE_URL"

echo "   https://supabase.com/dashboard/projects"echo ""

echo ""

echo "2. 📊 Open the SQL Editor:"echo "📋 To complete the database setup:"

echo "   Click 'SQL Editor' in the left sidebar"echo ""

echo ""echo "1. Go to your Supabase dashboard: $SUPABASE_URL"

echo "3. 📝 Run the database schema:"echo "2. Navigate to the SQL Editor"

echo "   Copy the contents of database/schema.sql and paste into SQL Editor"echo "3. Run the schema file first:"

echo "   Click 'Run' to create all tables and policies"echo "   - Copy and paste the contents of database/schema.sql"

echo ""echo "   - Click 'Run' to create tables and security policies"

echo "4. ✅ Verify setup:"echo ""

echo "   Copy the contents of database/check-existing-data.sql and run it"echo "4. Then run the seed data:"

echo "   You should see confirmation that tables were created"echo "   - Copy and paste the contents of database/seed-data.sql"

echo ""echo "   - Click 'Run' to add sample recipes and cookbooks"

echo "5. 🎯 (Optional) Add sample data:"echo ""

echo "   Copy the contents of database/safe-seed-data.sql and run it"echo "🎉 After running both SQL files, your database will have:"

echo "   This adds sample recipes and cookbooks for testing"echo "   • 8 sample recipes (Carbonara, Thai Curry, Tomato Soup, etc.)"

echo ""echo "   • 5 cookbooks (Weeknight Winners, Comfort Food, etc.)"

echo "   • Recipe-cookbook relationships"

read -p "Press Enter to view the schema file contents, or Ctrl+C to exit..."echo "   • Proper RLS policies for security"

echo ""

echo ""echo "Then you can:"

echo -e "${GREEN}📄 DATABASE SCHEMA (Copy this to Supabase SQL Editor):${NC}"echo "   1. Start the app: npm run dev"

echo "=================================================================="echo "   2. Test database connection: visit http://localhost:3000/test-recipes"

echo ""echo "   3. Use the main app: http://localhost:3000"

echo ""

cat database/schema.sql

# Optional: If curl is available, we could try to run the SQL directly

echo ""# But for now, manual steps are more reliable for Supabase
echo "=================================================================="
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Copy the schema above"
echo "2. Paste it into Supabase SQL Editor" 
echo "3. Click 'Run'"
echo "4. Run 'npm run dev' to start the application"
echo ""

read -p "Would you like to see the sample data file? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}📄 SAMPLE DATA (Optional - Copy this for test data):${NC}"
    echo "=================================================================="
    echo ""
    
    if [ -f "database/safe-seed-data.sql" ]; then
        cat database/safe-seed-data.sql
    elif [ -f "database/seed-data.sql" ]; then
        cat database/seed-data.sql
    else
        echo -e "${YELLOW}⚠️  Sample data file not found. You can still use the app without sample data.${NC}"
    fi
    
    echo ""
    echo "=================================================================="
fi

echo ""
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}🔧 Environment Variables Needed:${NC}"
echo "Make sure your .env file has:"
echo "- OPENAI_API_KEY"
echo "- NEXT_PUBLIC_SUPABASE_URL" 
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "- SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo -e "${GREEN}🚀 Ready to cook! Run 'npm run dev' to start.${NC}"