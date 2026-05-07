import { Link } from 'react-router-dom'
import { Card, CardContent, Button } from '@/components/ui'

import { MenuCategory } from "@/types/menu";

interface MenuGridProps {
  categories: MenuCategory[]
}

export function MenuGrid({ categories }: MenuGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {categories.map((category) => (
        <Card key={category.id} className="overflow-hidden border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark transition-colors">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img
              src={category.image}
              alt={category.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="mb-2 text-xl font-bold text-foreground-light dark:text-foreground-dark">{category.title}</h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
            <Button asChild variant="outline" className="w-auto border-starbucks-green text-starbucks-green hover:bg-starbucks-green hover:text-white dark:border-starbucks-light dark:text-starbucks-light dark:hover:bg-starbucks-light dark:hover:text-black">
              <Link to={category.href || "#"}>{category.title.replace('اكتشف ', '')}</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}