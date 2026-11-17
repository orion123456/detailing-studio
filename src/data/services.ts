export const categories = [
  "Все услуги",
  "Кузов",
  "Защита",
  "Салон",
  "Дополнительно",
] as const;
export type Category = (typeof categories)[number];
export type Service = {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  featured?: boolean;
};
export const services: Service[] = [
  {
    id: "ppf",
    name: "Оклейка защитной PPF-плёнкой",
    category: "Защита",
    price: 120000,
    image: "black",
    description:
      "Невидимая защита кузова от сколов, царапин и дорожных реагентов.",
    featured: true,
  },
  {
    id: "ceramic",
    name: "Керамическое покрытие",
    category: "Защита",
    price: 15000,
    image: "ceramic-clean",
    description:
      "Глубокий блеск, гидрофобный эффект и дополнительная защита лакокрасочного покрытия.",
    featured: true,
  },
  {
    id: "polish",
    name: "Полировка кузова",
    category: "Кузов",
    price: 12000,
    image: "hero-clean",
    description:
      "Убираем мелкие царапины и возвращаем кузову чистый, выразительный блеск.",
    featured: true,
  },
  {
    id: "wash",
    name: "Детейлинг-мойка",
    category: "Кузов",
    price: 2500,
    image: "wash",
    description:
      "Бережное многоэтапное очищение кузова, дисков и труднодоступных деталей.",
  },
  {
    id: "vinyl",
    name: "Оклейка виниловой плёнкой",
    category: "Кузов",
    price: 80000,
    image: "body",
    description:
      "Новый цвет и фактура. Индивидуальный характер вашего автомобиля.",
  },
  {
    id: "interior",
    name: "Детейлинг салона",
    category: "Салон",
    price: 5000,
    image: "interior",
    description:
      "Деликатный уход за каждой поверхностью для ощущения нового автомобиля.",
  },
  {
    id: "tint",
    name: "Тонировка стёкол",
    category: "Дополнительно",
    price: 5000,
    image: "service-tint",
    description:
      "Комфорт в салоне и защита от яркого солнца с учётом действующих требований.",
  },
  {
    id: "restore",
    name: "Реставрация кожи и пластика",
    category: "Салон",
    price: 3000,
    image: "service-restore",
    description:
      "Восстановление внешнего вида материалов и устранение следов износа.",
  },
  {
    id: "clean",
    name: "Химчистка салона",
    category: "Салон",
    price: 10000,
    image: "service-clean",
    description:
      "Глубокая очистка обивки, ковров и потолка с подбором подходящих составов.",
  },
  {
    id: "sound",
    name: "Шумоизоляция автомобиля",
    category: "Дополнительно",
    price: 25000,
    image: "service-sound",
    description: "Меньше дорожного шума, больше комфорта в каждой поездке.",
  },
  {
    id: "chrome",
    name: "Антихром",
    category: "Кузов",
    price: 15000,
    image: "wheel",
    description: "Сдержанные тёмные акценты вместо хромированных элементов.",
  },
  {
    id: "sale",
    name: "Предпродажная подготовка",
    category: "Дополнительно",
    price: 12000,
    image: "detail",
    description:
      "Комплексный уход за кузовом и салоном перед встречей с новым владельцем.",
  },
];
export const priceLabel = (price: number) =>
  `от ${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
