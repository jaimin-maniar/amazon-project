import { formatCurrency } from "../scripts/utils/money.js";

export class Product {
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`
  }

  getPrice() {
    return `${formatCurrency(this.priceCents)}`
  }
  extraInfoHTML() {
    return ''
  }
  extraHTMLforInstructionsAndWarranty() {
    return ''
  }
  id;
  image;
  name;
  rating;
  priceCents;
}

export class Clothing extends Product {
  sizeChartLink;
  type;
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
    this.type = productDetails.type;
  }
  extraInfoHTML() {
    return `
    <a href="${this.sizeChartLink}"target="_blank">Size chart</a>
    `
  }
}

export class Appliance extends Product {
  instructionsLink;
  warrantyLink;
  type;
  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
    this.type = productDetails.type;
  }
  extraHTMLforInstructionsAndWarranty() {
    return `
    <a href="${this.instructionsLink}"target="_blank">Instructions</a>
    <a href="${this.warrantyLink}"target="_blank">Warranty</a>
    `
  }
}


export let products = [];

export function loadProductsFetch() {
  const promise = fetch('https://supersimplebackend.dev/products')
    .then((response) => {
      return response.json();
    }).then((productsData) => {
      products = productsData.map((productDetails) => {
        if (productDetails.type === 'clothing') {
          return new Clothing(productDetails);
        } else if (productDetails.type === 'appliance') {
          return new Appliance(productDetails);
        } else {
          return new Product(productDetails);
        }
      });
      return products
    });

  return promise;
}
loadProductsFetch()
