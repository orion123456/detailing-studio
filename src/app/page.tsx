import { SparklesCore } from "@/components/ui/sparkles";
import { BeamsBackground } from "@/components/ui/beams-background";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CheckCheck,
  Clock3,
  Gem,
  HandHeart,
  Layers3,
  MapPin,
  MessageSquare,
  Phone,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Wallet,
  Wrench,
} from "lucide-react";
import { Header, Logo, MobileCTA } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { Reviews } from "@/components/sections/Reviews";
import { LeadForm } from "@/components/sections/LeadForm";
import { LeadProvider } from "@/components/sections/lead-context";
import { company } from "@/data/company";
import { navigation } from "@/data/navigation";
const advantages = [
  {
    icon: Gem,
    title: "Качественные материалы",
    text: "Подбираем составы и покрытия под задачу и особенности вашего автомобиля.",
  },
  {
    icon: Wrench,
    title: "Опытные мастера",
    text: "Внимательный подход и аккуратность на каждом этапе работы.",
  },
  {
    icon: Wallet,
    title: "Разумные цены",
    text: "Понятный расчёт стоимости. Согласовываем объём работ до начала.",
  },
  {
    icon: ScanLine,
    title: "Современное оборудование",
    text: "Инструменты для точной работы с кузовом, покрытиями и салоном.",
  },
  {
    icon: HandHeart,
    title: "Индивидуальный подход",
    text: "Учитываем состояние машины, ваши пожелания и повседневные задачи.",
  },
  {
    icon: Clock3,
    title: "Соблюдение сроков",
    text: "Заранее обсуждаем время выполнения и планируем каждый этап.",
  },
];
const process = [
  {
    icon: MessageSquare,
    title: "Заявка и консультация",
    text: "Вы рассказываете об автомобиле и услуге, которая вас интересует.",
  },
  {
    icon: ScanLine,
    title: "Осмотр и расчёт стоимости",
    text: "Оцениваем состояние и согласовываем объём работ и стоимость.",
  },
  {
    icon: Layers3,
    title: "Выполнение работ",
    text: "Выполняем согласованные процедуры с вниманием к каждой детали.",
  },
  {
    icon: CheckCheck,
    title: "Проверка результата и выдача автомобиля",
    text: "Проверяем результат и передаём вам ухоженный автомобиль.",
  },
];
export default function Page() {
  return (
    <LeadProvider>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <Header />
      <main id="main">
        <section id="home" className="hero">
          <Image
            className="hero-image"
            src="/images/hero-clean.webp"
            alt="Тёмный спортивный автомобиль с глубокими отражениями на кузове"
            fill
            priority
            sizes="100vw"
            quality={90}
          />
          <div className="hero-shade" />
          <BeamsBackground className="hero-beams" intensity="subtle" />
          <div className="container hero-content">
            <p className="eyebrow">
              <span className="red-line" /> ДЕТЕЙЛИНГ-СТУДИЯ В МОСКВЕ
            </p>
            <h1>
              Профессиональный
              <br />
              детейлинг вашего
              <br />
              <span>автомобиля</span>
              <span className="red-dot">.</span>
            </h1>
            <p className="hero-description">
              Вернём автомобилю безупречный вид и защитим его на долгие годы.
              Качественные материалы, внимание к деталям и разумные цены.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <a href="#lead">
                  Рассчитать стоимость <ArrowUpRight size={18} />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="#services">
                  Наши услуги <ArrowDown size={17} />
                </a>
              </Button>
            </div>
          </div>
          <div className="container hero-bottom">
            <div>
              <ShieldCheck size={20} />
              <span>
                Защита и уход
                <br />
                <strong>с вниманием к деталям</strong>
              </span>
            </div>
            <div>
              <Sparkles size={20} />
              <span>
                Профессиональный подход
                <br />
                <strong>к вашему автомобилю</strong>
              </span>
            </div>
            <a href="#advantages" className="explore">
              ЛИСТАЙТЕ ВНИЗ <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero-side">DETAILS MAKE THE DIFFERENCE</div>
        </section>
        <section id="advantages" className="section light advantages">
          <SparklesCore className="advantages-sparkles" />
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">01 / ПОЧЕМУ МЫ</p>
                <h2>
                  Хороший уход.
                  <br />
                  <span className="muted">Заметная разница.</span>
                </h2>
              </div>
              <p className="section-description">
                Любим автомобили. Ценим ваше доверие.
                <br />И знаем, что безупречность складывается из мелочей.
              </p>
            </div>
            <div className="advantages-grid">
              {advantages.map((a, i) => (
                <Reveal key={a.title}>
                  <article className="advantage">
                    <div className="advantage-top">
                      <a.icon size={27} strokeWidth={1.5} />
                      <span>0{i + 1}</span>
                    </div>
                    <h3>{a.title}</h3>
                    <p>{a.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <Services />
        <Portfolio />
        <section id="about" className="section light">
          <div className="container about-grid">
            <Reveal className="about-image">
              <Image
                src="/images/wash.webp"
                alt="Бережный уход за кузовом автомобиля"
                fill
                sizes="(max-width:768px) 100vw,50vw"
              />
              <span className="image-label">УХОД, КОТОРЫЙ ЗАМЕТЕН</span>
            </Reveal>
            <Reveal className="about-copy">
              <p className="eyebrow">04 / О СТУДИИ</p>
              <h2>
                Больше, чем чистота.
                <br />
                <span className="muted">Отношение к делу.</span>
              </h2>
              <p>
                В Detailing Studio мы помогаем автомобилям выглядеть безупречно.
                Подбираем услуги под состояние машины и пожелания владельца,
                уделяем внимание каждой детали и предлагаем качественный уход по
                разумной цене.
              </p>
              <div className="stats">
                <div>
                  <strong>{company.experience}</strong>
                  <span>лет опыта</span>
                </div>
                <div>
                  <strong>{company.cars}</strong>
                  <span>автомобилей</span>
                </div>
                <div>
                  <strong>12</strong>
                  <span>услуг детейлинга</span>
                </div>
              </div>
              <a className="text-link" href="#lead">
                Познакомимся с вашим автомобилем <ArrowUpRight size={19} />
              </a>
            </Reveal>
          </div>
        </section>
        <section id="process" className="section process-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">05 / КАК МЫ РАБОТАЕМ</p>
                <h2>
                  Всё понятно.
                  <br />
                  <span className="muted">На каждом этапе.</span>
                </h2>
              </div>
              <p className="section-description">
                От первого знакомства до финального блеска.
                <br />
                Четыре простых шага к результату.
              </p>
            </div>
            <div className="process-grid">
              {process.map((p, i) => (
                <Reveal key={p.title}>
                  <article className="process-card">
                    <div>
                      <span className="step-number">0{i + 1}</span>
                      <p.icon size={24} />
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <Reviews />
        <LeadForm />
        <section id="contacts" className="section contacts dark">
          <div className="container contact-grid">
            <div>
              <p className="eyebrow">08 / КОНТАКТЫ</p>
              <h2>
                До встречи
                <br />
                <span className="muted">в студии.</span>
              </h2>
              <div className="contact-row">
                <MapPin />
                <div>
                  <small>АДРЕС СТУДИИ</small>
                  <p>{company.address}</p>
                </div>
              </div>
              <div className="contact-row">
                <Phone />
                <div>
                  <small>ТЕЛЕФОН</small>
                  <p>{company.phone}</p>
                </div>
              </div>
              <div className="contact-row">
                <Clock3 />
                <div>
                  <small>ВРЕМЯ РАБОТЫ</small>
                  <p>{company.hours}</p>
                </div>
              </div>
            </div>
            <div className="contact-image">
              <Image
                src="/images/studio.webp"
                alt="Автомобиль в пространстве мастерской"
                fill
                sizes="(max-width:768px) 100vw,50vw"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="footer dark">
        <div className="container">
          <div className="footer-top">
            <a href="#home">
              <Logo />
            </a>
            <nav aria-label="Навигация в подвале">
              {navigation.map((n) => (
                <a key={n.id} href={`#${n.id}`}>
                  {n.label}
                </a>
              ))}
            </nav>
            <a
              href="#home"
              className="icon-button"
              aria-label="Вернуться наверх"
            >
              <ArrowUp size={20} />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Detailing Studio</span>
            <span>{company.phone}</span>
            <span>Политика конфиденциальности</span>
          </div>
        </div>
      </footer>
      <MobileCTA />
    </LeadProvider>
  );
}
