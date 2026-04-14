// utils/price.js — helper reutilizable precio con descuento
export const getDiscountedPrice = (price, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) return Number(price);
  return Number(price) * (1 - Number(discountPercentage) / 100);
};