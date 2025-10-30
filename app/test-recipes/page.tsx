import { createClient } from "@/utils/supabase/server";

export default async function RecipesTest() {
  const supabase = await createClient();
  const { data: recipes } = await supabase.from("recipes").select();

  return (
    <div className="p-8 bg-bone min-h-screen">
      <h1 className="font-spectral text-2xl text-text-charcoal mb-6">
        Mise Recipes from Supabase
      </h1>
      <div className="bg-butcher-paper rounded-mise p-4 overflow-auto">
        <pre className="text-sm text-text-charcoal">
          {JSON.stringify(recipes, null, 2)}
        </pre>
      </div>
    </div>
  );
}
