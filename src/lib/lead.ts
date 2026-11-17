import { services, type Service, type Category } from "../data/services";
export type Lead = {
  name: string;
  phone: string;
  service: string;
  consent: boolean;
};
export const initialLead: Lead = {
  name: "",
  phone: "",
  service: "",
  consent: false,
};
export type LeadAction =
  | { type: "field"; field: "name" | "phone"; value: string }
  | { type: "service"; value: string }
  | { type: "consent"; value: boolean }
  | { type: "reset" };
export function leadReducer(state: Lead, action: LeadAction): Lead {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.value };
    case "service":
      return { ...state, service: action.value };
    case "consent":
      return { ...state, consent: action.value };
    case "reset":
      return { ...initialLead };
  }
}
export function formatPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] === "7" || digits[0] === "8") digits = digits.slice(1);
  digits = digits.slice(0, 10);
  let result = "+7";
  if (digits.length) result += " (" + digits.slice(0, 3);
  if (digits.length > 3) result += ") " + digits.slice(3, 6);
  if (digits.length > 6) result += "-" + digits.slice(6, 8);
  if (digits.length > 8) result += "-" + digits.slice(8, 10);
  return result;
}
export function validateLead(data: Lead) {
  const errors: Partial<Record<keyof Lead, string>> = {};
  if (!data.name.trim()) errors.name = "Введите ваше имя";
  if (!/^7[349]\d{9}$/.test(data.phone.replace(/\D/g, "")))
    errors.phone = "Введите корректный номер: +7 (999) 999-99-99";
  if (!services.some((s) => s.id === data.service))
    errors.service = "Выберите услугу";
  if (!data.consent)
    errors.consent = "Подтвердите условия формы";
  return errors;
}
export function filterServices(items: Service[], category: Category) {
  return category === "Все услуги"
    ? items
    : items.filter((s) => s.category === category);
}
