const leadZero = number => {
  return number > 9 ? number : "0" + number;
};

const format = (timestamp, format = "hh:mm:ss") => {
  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60 - hours * 60);
  const seconds = Math.floor(timestamp % 60);

  return format
    .replace("hh", leadZero(hours))
    .replace(/^(00\D)+/g, "")
    .replace("mm", leadZero(minutes))
    .replace("ss", leadZero(seconds));
};

export default {
  format,
};
