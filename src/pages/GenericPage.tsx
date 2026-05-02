import SEO from '../components/SEO'

interface GenericPageProps {
  title: string
  content: string
  imageUrl?: string
}

export default function GenericPage({ title, content, imageUrl }: GenericPageProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO title={title} />
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-foreground-light dark:text-foreground-dark mb-4">
          {title}
        </h1>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-auto rounded-lg object-cover shadow-sm mb-6"
          />
        )}
        <div 
          className="prose dark:prose-invert max-w-none text-foreground-light dark:text-foreground-dark"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </div>
  )
}
