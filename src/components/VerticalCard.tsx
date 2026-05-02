import { Button } from './ui/button'

interface Action {
  label: string
  href: string
  primary: boolean
}

interface VerticalCardProps {
  title: string
  image: string
  actions: Action[]
}

export default function VerticalCard({ title, image, actions }: VerticalCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border-light bg-card-light shadow-sm transition-colors dark:border-border-dark dark:bg-card-dark">
      <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-6 right-6 text-3xl font-bold text-white">{title}</h3>
      </div>
      <div className="flex flex-col gap-3 p-6">
        {actions.map((action, index) => (
          <Button
            key={index}
            asChild
            variant={action.primary ? 'default' : 'outline'}
            className={action.primary ? 'w-full bg-starbucks-green hover:bg-starbucks-dark text-white' : 'w-full border-starbucks-green text-starbucks-green hover:bg-starbucks-green hover:text-white dark:border-starbucks-light dark:text-starbucks-light'}
          >
            <a href={action.href} target={action.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
              {action.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}
