function formatter(date) {

  if (typeof date === "undefined") {
    return "unknown"
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  const correctedDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  const splitDate = correctedDate.toISOString().split("T");
  return splitDate[0] + " " + splitDate[1].split(".")[0];
}

export default {
  methods: {
    formatDate: formatter
  }
};
