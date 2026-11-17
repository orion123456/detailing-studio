import { describe, it, expect } from "vitest";
import {
  formatPhone,
  validateLead,
  leadReducer,
  initialLead,
  filterServices,
} from "../../src/lib/lead";
import { services } from "../../src/data/services";
describe("phone", () => {
  it("formats pasted Russian numbers", () => {
    expect(formatPhone("8 999 1234567")).toBe("+7 (999) 123-45-67");
    expect(formatPhone("+79991234567")).toBe("+7 (999) 123-45-67");
  });
  it("supports partial input and empty deletion", () => {
    expect(formatPhone("")).toBe("");
    expect(formatPhone("999")).toBe("+7 (999");
    expect(formatPhone("123456789012345")).not.toContain("012345");
  });
});
describe("lead", () => {
  it("reports all missing fields", () =>
    expect(Object.keys(validateLead(initialLead))).toHaveLength(4));
  it("rejects incomplete and invalid phones", () =>
    expect(
      validateLead({
        ...initialLead,
        name: "Олег",
        phone: "+7 (000) 000-00-00",
        service: "polish",
        consent: true,
      }).phone,
    ).toBeTruthy());
  it("accepts a valid lead", () =>
    expect(
      validateLead({
        name: "Олег",
        phone: "+7 (999) 123-45-67",
        service: "polish",
        consent: true,
      }),
    ).toEqual({}));
  it("rejects unknown services", () =>
    expect(
      validateLead({ ...initialLead, service: "fake" }).service,
    ).toBeTruthy());
  it("selects service and resets personal data", () => {
    const chosen = leadReducer(
      { ...initialLead, name: "Олег" },
      { type: "service", value: "polish" },
    );
    expect(chosen.service).toBe("polish");
    expect(leadReducer(chosen, { type: "reset" })).toEqual(initialLead);
  });
});
it("filters categories without mutating services", () => {
  expect(filterServices(services, "Все услуги")).toHaveLength(12);
  expect(
    filterServices(services, "Салон").every((s) => s.category === "Салон"),
  ).toBe(true);
  expect(services).toHaveLength(12);
});
