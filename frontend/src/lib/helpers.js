import { differenceInDays, format, formatDistance, parseISO } from "date-fns";

function formatCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  });

  return formatter.format(amount);
}

function formatYYYYMMDD(date) {
  if (!date) {
    return null;
  }
  return format(toISO(date), "yyy-MM-dd");
}

function formatMonthDD(date) {
  return format(toISO(date), "MMMM d");
}

function distanceInWordsFromNow(date) {
  return formatDistance(toISO(date), Date.now(), {
    addSuffix: true,
    includeSeconds: true
  });
}

function totalNights(from, to) {
  return differenceInDays(toISO(to), toISO(from));
}

function toISO(date) {
  if (typeof date === "string") {
    return parseISO(date);
  }
  return date;
}

export {
  formatCurrency,
  formatYYYYMMDD,
  formatMonthDD,
  distanceInWordsFromNow,
  totalNights
};
