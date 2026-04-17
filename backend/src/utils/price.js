// utils/price.js — helper reutilizable precio con descuento
export const getDiscountedPrice = (price, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) {
    return Number(Number(price).toFixed(2));
  }
  return Number((Number(price) * (1 - Number(discountPercentage) / 100)).toFixed(2));
};