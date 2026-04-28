'use client'

import { Mail } from 'lucide-react'

const WHATSAPP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`

// Fixed palette: red → teal → blue, cycling by index
const DOT_COLORS = ['#E05757', '#4EAD94', '#5B9BD5']

interface Service {
  name?: string | null
  description?: string | null
  whatsappUrl?: string | null
  email?: string | null
  id?: string | null
}

interface BookingSessionBlockProps {
  sectionTitle?: string | null
  sectionSubtitle?: string | null
  services?: Service[] | null
}

export function BookingSessionBlockComponent({
  sectionTitle = 'Booking Session',
  sectionSubtitle,
  services,
}: BookingSessionBlockProps) {
  return (
    <section className="bg-white py-12 md:py-16 px-6 md:px-[100px]">
      <div className="max-w-[1440px] mx-auto">
        {/* Heading */}
        <h2 className="font-display text-[36px] md:text-[48px] text-black leading-tight mb-6 md:mb-8">
          {sectionTitle}
        </h2>

        {/* Subtitle */}
        {sectionSubtitle && (
          <p className="text-[15px] md:text-[16px] text-black text-justify max-w-[656px] leading-[1.6] mb-8 md:mb-10">
            {sectionSubtitle}
          </p>
        )}

        {/* Service cards */}
        {services && services.length > 0 && (
          <div className="border border-[#eaecf0] rounded-[3px] max-w-[1069px]">
            {services.map((service, index) => (
              <div
                key={service.id ?? index}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 md:px-8 py-5 md:py-6 border-b last:border-b-0 border-[#eaecf0]"
              >
                {/* Left: dot + title + description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[11px] mb-2">
                    <span
                      className="flex-shrink-0 size-[10px] rounded-full"
                      style={{ backgroundColor: DOT_COLORS[index % DOT_COLORS.length] }}
                      aria-hidden="true"
                    />
                    <p className="font-bold text-[16px] text-black leading-normal">
                      {service.name}
                    </p>
                  </div>
                  {service.description && (
                    <p className="text-[15px] text-black leading-normal ml-[21px]">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Right: Book now + action buttons */}
                <div className="flex flex-col items-center gap-[4px] ml-0 md:ml-6 flex-shrink-0">
                  <span className="text-[16px] font-bold text-black text-center leading-[26px]">
                    Book Now
                  </span>
                  <div className="flex items-center gap-[9px]">
                    {/* WhatsApp button */}
                    {service.whatsappUrl && (
                      <a
                        href={service.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Book via WhatsApp"
                        className="flex items-center justify-center size-[47px] rounded-[20px] bg-[#8ec0bd] hover:bg-[#7ab0ad] transition-colors duration-150 text-white"
                      >
                        <span
                          className="size-[20px]"
                          dangerouslySetInnerHTML={{ __html: WHATSAPP_SVG }}
                        />
                      </a>
                    )}

                    {/* Email button */}
                    {service.email && (
                      <a
                        // href={service.email}
                        href={`mailto:${service.email}`}
                        aria-label="Book via Email"
                        className="flex items-center justify-center size-[47px] rounded-[20px] border border-[#3f3e3e] hover:bg-gray-50 transition-colors duration-150 text-[#3f3e3e]"
                      >
                        <Mail size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
