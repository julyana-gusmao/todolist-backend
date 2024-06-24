const { PrismaClient } = require("@prisma/client");
const express = require("express");
const todoRoutes = express.Router();
const prisma = new PrismaClient();

//CREATE
todoRoutes.post("/todos", async (req, res) => {
  const { name } = req.body;
  const todo = await prisma.todo.create({
    data: {
      name,
    },
  });

  return res.status(201).json(todo);
});

//READ
todoRoutes.get("/todos", async (req, res) => {
  const todos = await prisma.todo.findMany();
  return res.status(200).json(todos);
});

//UPDATE
todoRoutes.put("/todos", async (req, res) => {
  const { name, status, id } = req.body;

  if(!id){
    return res.status(400).json({error: "Id is required"})
  }

  const idVerification = await prisma.todo.findUnique({
    where: {
      id
    },
  });

  if(!idVerification){
    return res.status(404).json({error: "Id not found"})
  }

  const todo = await prisma.todo.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      status,
    },
  });

  return res.status(200).json(todo);
});

//DELETE
todoRoutes.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const intId = parseInt(id);

  if(!intId){
    return res.status(400).json({error: "Id is required"})
  }

  const idVerification = await prisma.todo.findUnique({
    where: {
      id: Number(intId),
    },
  });

  if(!idVerification){
    return res.status(404).json({error: "Id not found"})
  }

  await prisma.todo.delete({
    where: {
      id: Number(intId),
    },
  });

  return res.status(200).json({message: "Todo deleted successfully"}).send();
})

module.exports = todoRoutes;
