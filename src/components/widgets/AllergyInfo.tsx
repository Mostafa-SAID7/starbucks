import { AllergyInfoType as AllergyInfoProps } from "@/types";

export function AllergyInfo({ title, description, link, linkLabel }: AllergyInfoProps) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6 dark:bg-zinc-800/50 text-start">
      <h3 className="mb-2 text-xl font-bold text-foreground-light dark:text-foreground-dark flex items-center">
        <span className="mr-2 rtl:ml-2 rtl:mr-0 text-starbucks-green">⚠️</span> {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="inline-block text-sm font-semibold text-starbucks-green hover:underline dark:text-starbucks-light"
      >
        {linkLabel}
      </a>
    </div>
  )
}
