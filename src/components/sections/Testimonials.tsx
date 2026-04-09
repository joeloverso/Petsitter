import TestimonialCard from '@/components/ui/TestimonialCard'
import WaveDivider from '@/components/layout/WaveDivider'

const testimonials = [
  {
    name: 'Kristen McCaughan',
    pets: 'Oso, Sylvie & George',
    review:
      'Brooke is an absolute life saver for us as a dog sitter. We have three loving and rambunctious dogs that need a lot of attention and we know they are always in the best hands when Brooke stays with them. She not only takes care of them with thoughtfulness and love but treats them like they are her own. I have complete peace of mind when she is staying with them. In addition, every time I come home even the house is neater than when we left it!',
  },
  {
    name: 'Cathy Sacher',
    pets: 'Ziggy',
    review:
      'Brooke took exceptional care of my older golden retriever, Ziggy who required close attention due to his health issues and anxieties. With Brooke\'s extensive experience working at a veterinary clinic and her genuine love for dogs, I felt very comfortable having her watch Ziggy. She kept me updated regularly and sent me pictures and videos which I really appreciated. She was super flexible with dates and times and willing to help in any way possible. She is a gem and I was lucky to have found her!',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-2">
            Happy Clients
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-driftwood mb-4">
            What Pet Parents Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>

      <WaveDivider fillColor="#f5ebdf" />
    </section>
  )
}
