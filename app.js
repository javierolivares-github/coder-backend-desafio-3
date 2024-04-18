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
// app.post("/products", create);
app.get("/products", read);
// app.get("/products/:pid", readOne);
// app.put("/products/:pid", update);
// app.delete("/products/:pid", destroy);

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
  // Logic to create a product:
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
    const all = await productManager.getProducts();
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
    const { nid } = req.params;
    const one = await productManager.readOne(nid);
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
    // Capture param
    const { nid } = req.params;
    // Capture object with modification
    const data = req.body;
    // Update the resource
    const one = await productManager.update(nid, data);
    // Condicionar y enviar la respuesta al cliente
    if (one) {
      // Send the response to the client
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
    // Capturar el id
    const { nid } = req.params;
    // buscar el recurso
    const one = await productManager.readOne(nid);
    // si existe lo elimino
    if (one) {
      await notesManager.destroy(nid);
      return res.json({status: 200, response: one});
    }
    const error = new Error("Not found!");
    error.status = 404;
    throw error;
    // condicionar y enviar respuesta al cliente
  } catch (error) {
    console.log(error);
    return res.json({ status: error.status || 500, response: error.message || "ERROR" });
  }
}



