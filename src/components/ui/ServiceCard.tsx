interface ServiceCardProps {
  icon: string
  title: string
  description: string
  pricing: string[]
  notes?: string[]
  onLearnMore?: () => void
}

export default function ServiceCard({
  icon,
  title,
  description,
  pricing,
  notes,
  onLearnMore,
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8 flex flex-col items-center text-center border border-sand/50 hover:shadow-xl transition-shadow duration-300">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display text-2xl text-deep-ocean mb-3">{title}</h3>
      <p className="text-gray-600 mb-5 leading-relaxed">{description}</p>
      <div className="w-full bg-white-sand rounded-2xl p-4 mb-5">
        {pricing.map((line) => (
          <p key={line} className="text-sm font-semibold text-driftwood leading-loose">
            {line}
          </p>
        ))}
      </div>
      {notes && notes.length > 0 && (
        <ul className="text-xs text-gray-500 space-y-1 mb-5 text-left w-full">
          {notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="text-ocean mt-0.5">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}
      {onLearnMore && (
        <button
          onClick={onLearnMore}
          className="mt-auto bg-coral text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-light-coral transition-colors"
        >
          Learn More
        </button>
      )}
    </div>
  )
}
