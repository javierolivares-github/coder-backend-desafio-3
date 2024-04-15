import fs from "fs";
import crypto from "crypto";

class ProductManager {
  // Set the path to the JSON products file and initialize an empty array for the products.
  constructor() {
    this.pathFile = "./data/fs/files/products.json";
    this.products = [];
  }

  // LOAD PRODUCTS
  // Asynchronously loads the products from the JSON file into the products array.
  async loadProducts() {
    try {
      const productJson = await fs.promises.readFile(this.pathFile, "utf-8");
      if (productJson) {
        this.products = JSON.parse(productJson);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  // SAVE PRODUCTS
  // Asynchronously saves the current state of the products back to the JSON file.
  async saveProducts() {
    try {
      await fs.promises.writeFile(this.pathFile, JSON.stringify(this.products));
    } catch (error) {
      console.error("Error saving products:", error);
    }
  }

  // ADD PRODUCTS
  // Adds a new product to the products array and saves it to the file. Checks for required fields and if a product with the same code already exists.
  async addProduct(title, description, price, thumbnail, code, stock = 0) {
    try {
      const newProduct = {
        id: this.products.length + 1,
        title,
        description,
        price: parseFloat(price),
        thumbnail,
        code,
        stock,
      };

      if (Object.values(newProduct).includes(undefined)) {
        throw new Error("All fields are required.");
      }

      const productExists = this.products.find((product) => product.code === code);

      if (productExists) {
        throw new Error(`Product ${title} with code ${code} already exists.`);
      }

      let all = await fs.promises.readFile(this.pathFile, "utf-8");
      all = JSON.parse(all);
      console.log(all)
      // all.push(newProduct);
      // all = JSON.stringify(all);
      // await fs.promises.writeFile(this.pathFile, all);
      // return newProduct;
    } catch (error) {
      throw error;
    }
  }

  // GET PRODUCTS
  // Gets all the products from the products array after loading them from the file.
  async getProducts() {
    await this.loadProducts();
    console.log(this.products);
    return this.products;
  }

  // GET PRODUCT BY ID
  // Gets a product by its ID from the products array after loading them from the file.
  async getProductById(id) {
    await this.loadProducts();

    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.log(`Product with ID ${id} not found.`);
      return;
    }

    console.log(product);
    return product;
  }

  // UPDATE PRODUCT BY ID
  // Updates an existing product with new data, identified by its ID. Saves the changes to the file.
  async updateProduct(id, dataProduct) {  
    await this.loadProducts();

    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.log(`Product with ID ${id} not found.`);
      return;
    }

    this.products[index] = {
      ...this.products[index],
      ...dataProduct
    };

    await this.saveProducts();
    console.log(`Product with ID ${id} updated successfully.`);
  }

  // DELETE PRODUCT BY ID
  async deleteProduct(id) {
    await this.loadProducts();

    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.log(`Product with ID ${id} not found.`);
      return;
    }

    this.products.splice(index, 1);
    await this.saveProducts();
    console.log(`Product with ID ${id} deleted successfully.`);
  }
}

const productManager = new ProductManager();
export default productManager;
