export interface orderDTO {
  userId: number;
  products: {
    productId: number;
    quantity: number;
  }[];
}
