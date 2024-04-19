import express from "express";
import productManager from "./data/fs/productManager.fs.js";

// To create an express app/server:
const app = express();

// For initializing the express app, I need to configure:
const port = 8080;
const ready = console.log("server ready on port " + port);

// To initialize the server:
app.listen(port, ready);

// To configure the server with specific functions:
app.use(express.json()); // To manage JSON
app.use(express.urlencoded({extended:true})); // To use the info that comes from body


// Browser events:
app.get("/", index);
app.post("/products", create); 
app.get("/products", read); 
app.get("/products/:pid", readOne); 
app.put("/products/:pid", update); 
app.delete("/products/:pid", destroy); 

// To configure the callbacks:
async function index(req, res) {
  try {
    const message = "Welcome to the Product Manager";
    return res.json({ status: 200, response: message });
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, response: error.message });
  }
}

async function create(req,res) {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const newProduct = await productManager.addProduct(title, description, price, thumbnail, code, stock);
    return res.json({ status: 201, response: newProduct });

  } catch (error) {
    console.log(error);
    return res.json({ status: error.status || 500, response: error.message || "ERROR" });
    
  }
}

async function read(req,res) {
  try {
    const { limit } = req.query;
    const all = await productManager.getProducts(limit);
    if (all.length > 0) {
      return res.json({ status: 200, response: all });
    } else {
      return res.json({ status: 404, response: "Not found" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, response: error.message });
  }
}

async function readOne(req,res) {
  try {
    const { pid } = req.params;
    const one = await productManager.getProductById(pid);
    if (one) {
      return res.json({ status: 200, response: one });

    } else {
      const error = new Error("Not found!");
      error.status = 404;
      throw error;

    }

  } catch (error) {
    console.log(error);
    return res.json({ status: error.status || 500, response: error.message || "ERROR" });

  }
}

async function update(req,res) {
  try {
    // Capture params
    const { pid } = req.params;
    // Capture body
    const data = req.body;
    // Update
    const one = await productManager.updateProduct(pid, data);
    // Response
    if (one) {
      return res.json({ status: 200, response: one });
    } else {
      const error = new Error("Not found!");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: error.status || 500, response: error.message || "ERROR" });
  }
}

async function destroy(req,res) {
  try {
    // Capture params
    const { pid } = req.params;
    // Search
    const one = productManager.getProductById(pid);
    // Destroy
    if (one) {
      await productManager.deleteProduct(pid);
      return res.json({status: 200, response: one});
    }
    // Error
    const error = new Error("Not found!");
    error.status = 404;
    throw error;
    
  } catch (error) {
    console.log(error);
    return res.json({ status: error.status || 500, response: error.message || "ERROR" });
  }
}



