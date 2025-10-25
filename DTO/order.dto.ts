export interface orderDTO {
  userId: number;
  products: {
    product_id: number;
    quantity: number;
  }[];
}
