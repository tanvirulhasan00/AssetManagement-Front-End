export const BdtCurrencyFormate = (amount: any) => {
  // formate the amount as a BDT
  const formatted = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
  }).format(amount);
  return formatted;
};
