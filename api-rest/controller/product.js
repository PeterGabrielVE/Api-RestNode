'use strict'

const Product = require('../models/product')


function getProduct(req, res) {
	// body...
	let productId = req.params.productId

	Product.findById(productId, (err,product) => {
		if(err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
		if(!product) return res.status(404).send({message: `El producto no existe`})

		res.status(200).send({ product })
	})
}

function getProducts(req, res) {
	// body...
	Product.find({}, (err, products) => {
		if(err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
		if(!products) return res.status(404).send({message: 'No existen productos'})

		res.send(200, { products })
	})
}

function saveProduct(req,res) {
	// body...
	console.log('POST /api/product')
	console.log(req.body)

	let product = new Product()
	product.name = req.body.name
	product.picture = req.body.picture
	product.price = req.body.price
	product.category = req.body.category
	product.description = req.body.description

	product.save((err, productStored) => {
		if(err) res.status(500).send({message: `Error al salvar en la base de datos: ${err}`})
		
		res.status(200).send({product: productStored})
	})
}


function updateProduct(req, res) {
	// body...
	/* Pra instanciar la variable "update" con el objeto Product
 de mongoose que estamos manejando como modelo para la base de datos, 
 para no perder las validaciones que definimos para mantener nuestra base de datos
  bajo control y en orden. Para solucionarlo hice lo siguiente: */

	let productId = req.params.productId  
	let update= new Product(req.body)


/*La siguiente  linea permite reemplazar el "id" que genero mongoose
 para la variable "update" por el del poducto que estamos actualizando. */

	update._id = productId

//Para tener actualizado el Update. Para ello se debe colocar el parametro {new: true} despues del parametro "update" y antes de la función de callback, así: 

Product.findByIdAndUpdate(productId, update, {new: true}, (err, userUpdated) => {
  if(err) res.status(500).send({message: `Error al actualizar el producto: ${err}`})
  
  res.status(200).send({ product: userUpdated })
}﻿)
}

function deleteProduct(req,res) {
	// body...
	let productId = req.params.productId

	Product.findById(productId, (err,product) => {
		if(err) res.status(500).send({message: `Error al borrar el producto: ${err}`})

		product.remove(err => {
			if(err) res.status(404).send({message: `Error al borrar el producto: ${err}`})
			res.status(200).send({message: 'El producto ha sido eliminado con exito'})
	})

   })
}

module.exports = {
	getProduct,
	getProducts,
	saveProduct,
	updateProduct,
	deleteProduct
}