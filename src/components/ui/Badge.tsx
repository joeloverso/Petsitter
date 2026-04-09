interface BadgeProps {
  children: React.ReactNode
  color?: 'ocean' | 'sunshine' | 'coral' | 'sand'
}

const colorClasses = {
  ocean: 'bg-ocean/20 text-deep-ocean border-ocean/40',
  sunshine: 'bg-sunshine/30 text-driftwood border-sunshine/60',
  coral: 'bg-coral/20 text-coral border-coral/40',
  sand: 'bg-sand/40 text-driftwood border-sand',
}

export default function Badge({ children, color = 'ocean' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${colorClasses[color]}`}
    >
      {children}
    </span>
  )
}
