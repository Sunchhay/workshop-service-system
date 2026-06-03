import {
  Clock,
  MapPin,
  Navigation,
  PhoneCall
} from 'lucide-react';
import Image from 'next/image';

const googleMapUrl = 'https://maps.app.goo.gl/QaFsn9qMnPbp68ob6';

const phoneNumbers = [
  {
    label: '012 32 92 68',
    href: 'tel:012329268',
    operator: 'Cellcard',
    icon: '/icons/cellcard.png',
  },
  {
    label: '071 95 97 168',
    href: 'tel:0719597168',
    operator: 'Metfone',
    icon: '/icons/metfone.png',
  },
  {
    label: '016 31 29 68',
    href: 'tel:016312968',
    operator: 'Smart',
    icon: '/icons/smart.png',
  },
  {
    label: '061 9999 28',
    href: 'tel:061999928',
    operator: 'Cellcard',
    icon: '/icons/cellcard.png',
  },
];

const services = [
  {
    name: 'សំលៀងវីលីគាំង',
    description:
      'សេវាកម្មសំលៀង និងកែសម្រួលវីលីគាំង សម្រាប់គ្រឿងម៉ាស៊ីនគ្រប់ប្រភេទ។',
  },
  {
    name: 'សីសូមុី',
    description:
      'សេវាកម្មផ្នែកសូប៉ាប់ និងការកែសម្រួលផ្នែកម៉ាស៊ីនឲ្យដំណើរការល្អ។',
  },
  {
    name: 'ម៉ាបក្បាលកន្លះ',
    description:
      'សេវាកម្មម៉ាបក្បាលកន្លះ ឲ្យផ្ទៃស្មើ និងបិទជិតបានល្អ។',
  },
  {
    name: 'ធ្វើប៉ូម',
    description:
      'ទទួលធ្វើប៉ូម និងកែសម្រួលផ្នែកពាក់ព័ន្ធតាមតម្រូវការអតិថិជន។',
  },
  {
    name: 'ទាក់បូ',
    description: 'សេវាកម្មទាក់បូ និងកែសម្រួលគ្រឿងបន្លាស់ម៉ាស៊ីន។',
  },
  {
    name: 'ក្រឡឹងគ្រឿងម៉ាស៊ីន',
    description:
      'ទទួលក្រឡឹងគ្រឿងម៉ាស៊ីនគ្រប់ប្រភេទ តាមទំហំ និងតម្រូវការ។',
  },
];

const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61590746873034',
    icon: '/icons/facebook.png',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@raksmey.deng?_r=1&_t=ZS-96tTmwSOe4z',
    icon: '/icons/tiktok.png',
  },
  {
    label: 'Telegram',
    href: 'https://t.me/sunchhay_r',
    icon: '/icons/telegram.png',
  },
];

export default function Page() {
  return (
    <main className="landing-page min-h-screen overflow-x-hidden overflow-y-auto bg-slate-950 text-white">
      <Header />
      <HeroSection />
      {/* <ServicesSection /> */}
      <ContactSection />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061a4d]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 md:px-8">
        <a href="#" className="leading-tight">
          <div className="font-moul text-base text-yellow-300 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] sm:text-xl md:text-2xl">
            ដែង រស្មី
          </div>
          <div className="font-koulen text-xs text-slate-200 sm:text-sm">
            ជាងក្រឡឹង
          </div>
        </a>

        {/* <nav className="hidden items-center gap-8 font-koulen text-sm text-slate-100 md:flex">
          <a href="#home" className="hover:text-yellow-300">
            ទំព័រដើម
          </a>
          <a href="#services" className="hover:text-yellow-300">
            សេវាកម្ម
          </a>
          <a href="#contact" className="hover:text-yellow-300">
            ទំនាក់ទំនង
          </a>
        </nav> */}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {socials.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/25 transition hover:border-yellow-300 hover:bg-yellow-300"
            >
              <Image
                src={link.icon}
                alt={`${link.label} icon`}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </a>
          ))}
        </div>
        {/* <a
          href="tel:0719597168"
          className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-3 py-2 font-koulen text-xs text-slate-950 shadow-lg transition hover:bg-yellow-200 sm:px-4 sm:text-sm"
        >
          <PhoneCall className="h-4 w-4" />
          ទំនាក់ទំនងឥឡូវនេះ
        </a> */}
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate min-h-[620px] overflow-hidden bg-[#061b4d] sm:min-h-[680px] md:min-h-[600px] lg:min-h-[640px]"
    >
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: "url('/images/hero-desktop.png')" }}
      />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/images/hero-mobile.png')" }}
      />
      {/* Mobile bottom fade overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent md:hidden" />

      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl flex-col items-center px-4 pb-8 pt-12 text-center sm:min-h-[580px] sm:px-5 sm:pt-16 md:min-h-[500px] md:justify-center md:px-8 md:py-14 lg:min-h-[540px] gap-3">
        <div>
          <h1 className="font-moul text-[56px] leading-tight text-yellow-300 drop-shadow-[4px_5px_0_rgba(0,0,0,0.95)] sm:text-[60px] md:text-[74px] lg:text-[92px]">
            ដែង រស្មី
          </h1>

          <h2 className=" font-koulen text-[26px] leading-tight text-yellow-300 drop-shadow-[4px_5px_0_rgba(0,0,0,0.95)] sm:text-[32px] md:text-[42px] lg:text-[52px]">
            ជាងក្រឡឹង
          </h2>
        </div>

        <p className="mt-4 max-w-5xl font-koulen text-[17px] leading-[1.6] text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.95)] sm:text-[18px] md:mt-6 md:text-[20px] lg:text-[26px]">
          មានទទួល សំលៀងវីលីគាំង សីសូម៉ី ម៉ាបក្បាលកន្លះ
          <br className="hidden md:block" />
          ធ្វើប៉ូម ទាក់បូ និងក្រឡឹងគ្រឿងម៉ាស៊ីនគ្រប់ប្រភេទ
        </p>

        <div className="mt-6 grid w-full max-w-4xl grid-cols-2 gap-4 md:mt-8 md:grid-cols-4 md:gap-3">
          {phoneNumbers.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              className="flex items-center justify-start gap-2 font-[Arial] text-[22px] font-black leading-tight text-yellow-300 drop-shadow-[2px_3px_0_rgba(0,0,0,0.95)] transition hover:text-yellow-100 sm:text-[26px] md:text-[20px] lg:text-[26px]"
            >
              <Image
                src={phone.icon}
                alt={`${phone.operator} icon`}
                width={34}
                height={24}
                className="h-6 w-8.5 object-contain"
              />
              {phone.label}
            </a>
          ))}
        </div>

        <div className="mt-36 md:mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          {/* <a
            href="tel:0719597168"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-5 py-3 font-koulen text-sm text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-yellow-200 sm:px-7 sm:text-base"
          >
            <PhoneCall className="h-5 w-5" />
            ទំនាក់ទំនងឥឡូវនេះ
          </a> */}
          <a
            href={googleMapUrl}
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-5 py-3 font-koulen text-sm text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-yellow-200 sm:px-7 sm:text-base"
          >
            <MapPin className="h-5 w-5" />
            មើលទីតាំង
          </a>

          {/* <a
            href={googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-black/20 px-5 py-3 font-koulen text-sm text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-950 sm:px-7 sm:text-base"
          >
            <MapPin className="h-5 w-5" />
            មើលទីតាំង
          </a> */}
        </div>

        {/* <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {socials.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/25 transition hover:border-yellow-300 hover:bg-yellow-300"
            >
              <Image
                src={link.icon}
                alt={`${link.label} icon`}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </a>
          ))}
        </div> */}

        <p className="mt-5 max-w-5xl font-battambang text-[16px] font-bold leading-7 text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)] sm:text-base sm:leading-8 md:text-lg">
          អាសយដ្ឋាន៖ ក្រុមទី៤ ភូមិដំណាក់ហ្លូង សង្កាត់វត្តគរ ក្រុង/ខេត្តបាត់ដំបង
          <br />
          ខាងកើតរង្វង់មូលនាងរំសាយសក់ ២០០ម៉ែត្រ ផ្លូវក្រវ៉ាត់ក្រុង
        </p>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-slate-50 px-4 py-16 text-slate-950 sm:px-5 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Arial] text-xs font-black uppercase tracking-[0.25em] text-yellow-600 md:text-sm">
            Services
          </p>

          <h2 className="mt-3 font-koulen text-4xl text-slate-950 md:text-5xl">
            សេវាកម្មរបស់យើង
          </h2>

          <p className="mt-4 font-battambang text-base leading-8 text-slate-600 md:text-lg">
            ទទួលសេវាកម្មជាងក្រឡឹង និងការងារគ្រឿងម៉ាស៊ីនគ្រប់ប្រភេទ
            ដោយផ្តោតលើគុណភាពល្អ តម្លៃល្អ និងទំនុកចិត្ត
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.name}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:p-6"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-300 text-slate-950">
                <Navigation className="h-7 w-7" />
              </div>

              <h3 className="font-koulen text-2xl text-slate-950 md:text-3xl">
                {service.name}
              </h3>

              <p className="mt-4 font-battambang text-base leading-8 text-slate-600">
                {service.description}
              </p>

              <a
                href="tel:0719597168"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-koulen text-base text-white transition hover:bg-yellow-300 hover:text-slate-950"
              >
                <PhoneCall className="h-4 w-4" />
                សួរព័ត៌មានបន្ថែម
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-slate-950 px-4 py-16 text-white sm:px-5 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Arial] text-xs font-black uppercase tracking-[0.25em] text-yellow-300 md:text-sm">
            Contact & Location
          </p>

          <h2 className="mt-3 font-koulen text-4xl md:text-5xl">
            ទំនាក់ទំនង និងទីតាំង
          </h2>

          <p className="mt-4 font-koulen text-base leading-8 text-slate-300 md:text-lg">
            អាចទំនាក់ទំនងតាមលេខទូរស័ព្ទ Facebook TikTok Telegram ឬមកកាន់ទីតាំងផ្ទាល់
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg md:p-8">
            <h3 className="font-koulen text-3xl text-yellow-300">
              ព័ត៌មានទំនាក់ទំនង
            </h3>

            <div className="mt-6 space-y-3">
              {phoneNumbers.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="flex flex-col gap-3 rounded-2xl bg-white/10 px-5 py-4 text-white transition hover:bg-yellow-300 hover:text-slate-950 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="flex items-center gap-3 font-[Arial] font-black text-[20px] sm:text-[22px]">
                    <Image
                      src={phone.icon}
                      alt={`${phone.operator} icon`}
                      width={42}
                      height={28}
                      className="h-7 w-10.5 object-contain"
                    />
                    {phone.label}
                  </span>

                  {/* <span className="font-[Arial] text-[24px] font-black sm:text-[28px] md:text-[30px]">
                    {phone.label}
                  </span> */}
                </a>
              ))}
            </div>

            {/* <div className="mt-6 space-y-3">
              {phoneNumbers.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="flex flex-col gap-2 rounded-2xl bg-white/10 px-5 py-4 text-white transition hover:bg-yellow-300 hover:text-slate-950 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="flex items-center gap-2 font-battambang font-bold">
                    <Image
                      src="/icons/call.png"
                      alt="Call icon"
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                    ទូរស័ព្ទ
                  </span>
                  <span className="font-[Arial] text-2xl font-black">
                    {phone.label}
                  </span>
                </a>
              ))}
            </div> */}

            <div className="mt-8">
              <h4 className="font-koulen font-black text-white">
                បណ្តាញសង្គម
              </h4>

              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 pl-2 pr-4 py-2 font-[Arial] text-sm font-bold text-white transition hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950"
                  >
                    <Image
                      src={link.icon}
                      alt={`${link.label} icon`}
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                    />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4 font-battambang text-base leading-8 text-slate-300">
              <p className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-yellow-300" />
                <span>
                  <span className="font-bold text-white">ទីតាំង៖ </span>
                  ក្រុមទី៤ ភូមិដំណាក់ហ្លូង សង្កាត់វត្តគរ ក្រុង/ខេត្តបាត់ដំបង
                </span>
              </p>

              <p className="flex gap-3">
                <Navigation className="mt-1 h-5 w-5 shrink-0 text-yellow-300" />
                <span>
                  <span className="font-bold text-white">ចំណាំ៖ </span>
                  ខាងកើតរង្វង់មូលនាងរំសាយសក់ ២០០ម៉ែត្រ ផ្លូវក្រវ៉ាត់ក្រុង
                </span>
              </p>

              <p className="flex gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-yellow-300" />
                <span>
                  <span className="font-bold text-white">ម៉ោងធ្វើការ៖ </span>
                  ចន្ទ - អាទិត្យ, 8:00 AM - 6:00 PM
                </span>
              </p>

              <a
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-5 py-3 font-koulen text-base text-slate-950 transition hover:bg-yellow-200"
              >
                <MapPin className="h-5 w-5" />
                បើក Google Maps
              </a>
            </div>
          </div>

          <div className="min-h-[360px] overflow-hidden rounded-3xl bg-white shadow-lg lg:min-h-full">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.3664244485526!2d103.18112097593901!3d13.07594818724909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3105499bf3f4fc7d%3A0xf74fb45dc0577edd!2z4Z6H4Z624Z6E4Z6A4Z-S4Z6a4Z6h4Z654Z6EIOGeiuGfguGehCDhnprhnp_hn5Lhnpjhnrg!5e0!3m2!1sen!2skh!4v1780463430891!5m2!1sen!2skh"
              className="h-[360px] w-full border-0 sm:h-[420px] lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black px-4 py-8 text-white sm:px-5 md:px-8 pb-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-moul text-lg text-yellow-300 md:text-xl">
            ដែង រស្មី
          </p>
          <p className="font-koulen text-sm text-slate-200">
            ជាងក្រឡឹង
          </p>
          <p className="mt-2 max-w-2xl font-battambang text-sm leading-7 text-slate-400">
            សេវាកម្មសំលៀងវីលីគាំង សីសូម៉ី ម៉ាបក្បាលកន្លះ ធ្វើប៉ូម ទាក់បូ
            និងក្រឡឹងគ្រឿងម៉ាស៊ីនគ្រប់ប្រភេទ។
          </p>
        </div>

        <p className="font-[Arial] text-sm text-slate-400">
          © {new Date().getFullYear()} Deng Reaksmey. All rights reserved.
        </p>
      </div>
    </footer>
  );
}