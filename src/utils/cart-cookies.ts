import type { CartItem } from "@/interfaces";
import Cookies from "js-cookie";

export class CartCookiesClient {
  static getCart(): CartItem[] {
    const cart = JSON.parse(Cookies.get("cart") || "[]");
    return cart;
  }

  static addItem(cartItem: CartItem): CartItem[] {
    const cart = CartCookiesClient.getCart();

    const itemInCart = cart.find(
      (item) =>
        item.productId === cartItem.productId && item.size === cartItem.size
    ); // Check if the item already exists in the cart
    // If the item exists, update its quantity; otherwise, add it to the cart

    if (itemInCart) {
      itemInCart.quantity += cartItem.quantity;
    } else {
      cart.push(cartItem);
    }

    Cookies.set("cart", JSON.stringify(cart));

    return cart;
  }

  static removeItem(productId: string, size: string): CartItem[] {
    const cart = CartCookiesClient.getCart();

    console.log({ productId, size });

    const updatedCart = cart.filter(
      (item) => !(item.productId === productId && item.size === size)
    ); // Remove the item with the specified productId and size
    // Update the cart cookie with the new cart contents

    Cookies.set("cart", JSON.stringify(updatedCart));

    return updatedCart;
  }
}
