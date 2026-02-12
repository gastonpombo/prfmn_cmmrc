import { getSupabaseClient, type Category } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data || []
}

export async function CategoriesGrid() {
  const categories = await getCategories()

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary">
            Explor&aacute;
          </p>
          <h2 className="text-balance font-serif text-3xl text-primary md:text-4xl">
            Nuestras Categor&iacute;as
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="group relative flex h-64 items-end overflow-hidden rounded"
            >
              {cat.image_url ? (
                <Image
                  src={cat.image_url || "/placeholder.svg"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
              <div className="absolute inset-0 bg-primary/30 transition-colors group-hover:bg-primary/40" />
              <div className="relative z-10 p-6">
                <h3 className="font-serif text-xl text-primary-foreground">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
