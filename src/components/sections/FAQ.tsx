import { createClient } from '@/lib/supabase/server'
import FAQItem from '@/components/ui/FAQItem'
import WaveDivider from '@/components/layout/WaveDivider'

const fallbackFaqs = [
  {
    question: 'How do I book?',
    answer:
      'You can reach Brooke by text or email; links are in the Contact section below. For new clients, a free meet & greet is required before the first booking.',
  },
  {
    question: 'How far in advance do I need to book?',
    answer:
      '1–2 weeks in advance for most bookings. For stays lasting 1 week or longer, please book 2–4 weeks ahead to ensure availability.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'A minimum of 3 days notice is required to cancel without a fee. Cancellations with less than 3 days notice will incur a $50 cancellation fee.',
  },
  {
    question: 'What holidays are you unavailable?',
    answer:
      'Brooke is not available on Christmas Eve, Christmas Day, Thanksgiving, Easter, or Valentine\'s Day. A $25/day holiday surcharge applies to other major holidays.',
  },
  {
    question: 'Do you handle medication?',
    answer:
      'Yes! Brooke has experience administering insulin, oral, topical, and injectable medications. There is an additional $15 fee per pet requiring medication.',
  },
  {
    question: 'What animals do you sit for?',
    answer:
      'Primarily dogs and cats, but Brooke also has experience with birds, fish, snakes, other reptiles, and small animals. Reach out to discuss your specific pet.',
  },
  {
    question: 'Do you require a meet & greet?',
    answer:
      'Yes, a free meet & greet is required for all new clients before the first booking. This lets Brooke get to know your pet and ensures it\'s a good fit.',
  },
  {
    question: 'Do you accept all breeds?',
    answer:
      'All friendly breeds are welcome! Brooke does not accept aggressive dogs or cats for the safety of all pets in her care.',
  },
  {
    question: 'Do you offer grooming?',
    answer:
      'Grooming is not offered. Bathing is only provided if medically necessary and advised by your pet\'s veterinarian.',
  },
]

export default async function FAQ() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('active', true)
    .order('sort_order')

  const faqs = data && data.length > 0 ? data : fallbackFaqs

  return (
    <section id="faqs" className="bg-white-sand py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-2">
            Got Questions?
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-driftwood mb-4">
            FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>

      <WaveDivider fillColor="#ffffff" />
    </section>
  )
}
