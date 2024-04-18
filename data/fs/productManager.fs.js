import fs from "fs";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
    this.products = [];
  }

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

  async saveProducts() {
    try {
      await fs.promises.writeFile(this.pathFile, JSON.stringify(this.products));
    } catch (error) {
      console.error("Error saving products:", error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock = 0) {
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
      console.log("All fields are required.");
      return;
    }

    const productExists = this.products.find((product) => product.code === code);

    if (productExists) {
      console.log(`Product ${title} with code ${code} already exists.`);
      return;
    }

    this.products.push(newProduct);
    await this.saveProducts();
  }

  async getProducts() {
    await this.loadProducts();
    console.log(this.products);
    return this.products;
  }

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


const productManager = new ProductManager("./files/products.json");

export default productManager;

// TESTING PROCESS:
// (async () => {
//   // await productManager.addProduct("Nike Pegasus 40 SE", "Men's running shoes", "129.99", "https://example.com/image.jpg");
//   // await productManager.addProduct("Nike Quest 5", "Men's running shoes", "76.99", "https://example.com/image.jpg", "NQ5", 15);
//   // await productManager.addProduct("Nike Quest 5", "Men's running shoes", "76.99", "https://example.com/image.jpg", "NQ5", 15);
//   // await productManager.addProduct("Jordan Stay Loyal 2", "Men's Jordan shoes", "116.99", "https://example.com/image.jpg", "JSL2", 10);
//   // await productManager.addProduct("Nike Quest 6", "Men's running shoes", "96.99", "https://example.com/image.jpg", "NQ6", 18);
//   // await productManager.addProduct("Nike Quest 11", "Men's running shoes", "96.99", "https://example.com/image.jpg", "NQ11", 25);

//   // await productManager.getProducts();

//   // await productManager.getProductById(5);

//   // await productManager.updateProduct(5, { title: "Nike Quest 10" });

//   // await productManager.deleteProduct(5);
// })();
