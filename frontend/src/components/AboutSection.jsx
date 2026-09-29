import Portrait from './Portrait';
import { Reveal, Stagger, StaggerItem } from './SectionReveal';
import { expertiseChips } from '../data/expertise';

/**
 * About — "Meet Wanda Gordon" (light ivory).
 * Shared by the Home scroll and the dedicated /about route
 * so copy never drifts between the two.
 */
export default function AboutSection() {
  return (
    <section id="about" aria-label="About Wanda Gordon" className="section-sand relative scroll-mt-20 overflow-hidden">
      {/* ghost numeral backdrop */}
      <div aria-hidden className="ghost-numeral pointer-events-none absolute -top-4 right-4 select-none md:right-12">
        W
      </div>

      <div className="container-editorial section-pad relative">
        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-[0.2em] text-plum">01</p>
          <p className="eyebrow mb-4">Meet Wanda Gordon</p>
          <h2 className="heading-display max-w-[16ch] text-3xl text-charcoal sm:text-4xl md:text-5xl">
            Financial knowledge changes what becomes possible.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="min-w-0">
            <Reveal delay={0.08}>
              <p className="body-editorial text-base text-charcoal/80 md:text-lg">
                Wanda Gordon is a certified financial educator, financial coach
                and speaker passionate about helping people understand money,
                develop stronger financial habits and make informed financial
                decisions.
              </p>
            </Reveal>

            <Stagger className="mt-8 flex flex-wrap gap-2.5">
              {expertiseChips.map((chip) => (
                <StaggerItem key={chip}>
                  <span className="inline-flex min-h-[36px] items-center border border-charcoal/20 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-charcoal/75 transition-colors hover:border-plum hover:text-plum">
                    {chip}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.12} className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none lg:pl-6">
            <div aria-hidden className="absolute -right-8 -top-8 h-48 w-48 rounded-[45%_55%_58%_42%/50%_44%_56%_50%] bg-sage-soft/60" />
            <Portrait
              aspect="aspect-[4/5]"
              tone="light"
              src="/wanda-about.jpg"
              objectPosition="center 15%"
              caption="Wanda Gordon — Certified Financial Educator"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
