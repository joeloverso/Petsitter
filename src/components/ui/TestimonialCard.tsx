interface TestimonialCardProps {
  name: string
  pets: string
  review: string
}

export default function TestimonialCard({ name, pets, review }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8 border border-sand/50 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
      <div className="text-4xl text-ocean/30 font-serif leading-none">&ldquo;</div>
      <p className="text-gray-600 leading-relaxed italic flex-1">{review}</p>
      <div className="flex items-center gap-3 pt-2 border-t border-sand/50">
        <div className="w-10 h-10 rounded-full bg-seafoam flex items-center justify-center text-deep-ocean font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-driftwood">{name}</p>
          <p className="text-sm text-gray-500">{pets}</p>
        </div>
      </div>
    </div>
  )
}
