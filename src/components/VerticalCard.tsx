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
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-starbucks-dark shadow-sm">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex w-full flex-col items-center p-8 text-center mt-20">
        <h3 className="mb-6 text-3xl font-extrabold text-white drop-shadow-md">
          {title}
        </h3>

        <div className="flex w-full flex-col gap-4 max-w-[200px]">
          {actions.map((action, index) => (
            <Button
              key={index}
              asChild
              className={
                action.primary
                  ? 'w-full rounded-2xl bg-starbucks-green font-bold text-white shadow-md hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white'
                  : 'w-full rounded-2xl border-2 border-white bg-transparent font-bold text-white hover:bg-white hover:text-starbucks-dark dark:border-starbucks-light dark:text-starbucks-light dark:hover:bg-starbucks-light dark:hover:text-black'
              }
            >
              <a href={action.href} target={action.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
                {action.label}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
