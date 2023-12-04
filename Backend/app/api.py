from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from typing import List

app = FastAPI()
origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# GET ROUTE
@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Hello, World!"}

# Modelo Pydantic para los datos de la tarea
class Todo(BaseModel):
    id: int
    item: str
    imagen: str = None
    ingredientes: List[str] = []  # Lista de ingredientes
    preparacion: str = ""         # Descripción de la preparación

todos = [
    {"id": 1, "item": "Pozoles rojo tradicional", "imagen": "https://editorialtelevisa.brightspotcdn.com/dims4/default/dfd7901/2147483647/strip/true/crop/560x560+220+0/resize/1000x1000!/format/webp/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2017%2F07%2Fpozole-rojo-receta.jpg", "ingredientes": ["maíz", "carne de cerdo", "chile rojo", "otros ingredientes..."],
        "preparacion": "Descripción de cómo preparar el pozole rojo tradicional."},

    {"id": 2, "item": "Mole poblano", "imagen": "https://editorialtelevisa.brightspotcdn.com/dims4/default/c331b6b/2147483647/strip/true/crop/560x560+220+0/resize/1000x1000!/format/webp/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2014%2F07%2Fmole-poblano.jpg", "ingredientes": ["maíz", "carne de cerdo", "chile rojo", "otros ingredientes..."],
        "preparacion": "Descripción de cómo preparar el pozole rojo tradicional."},

    {"id": 3, "item": "Barbacoa de res", "imagen": "https://editorialtelevisa.brightspotcdn.com/dims4/default/a692d1e/2147483647/strip/true/crop/672x672+264+0/resize/1000x1000!/format/webp/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2021%2F05%2Fcomo-hacer-barbacoa-de-res.jpg", "ingredientes": ["maíz", "carne de cerdo", "chile rojo", "otros ingredientes..."],
        "preparacion": "Descripción de cómo preparar el pozole rojo tradicional."},

    {"id": 4, "item": "Tacos de cortadillo", "imagen": "https://editorialtelevisa.brightspotcdn.com/dims4/default/94e5005/2147483647/strip/true/crop/672x672+402+0/resize/1000x1000!/format/webp/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Ff0%2Ffb%2F46a3b39d44b8af6887388475d3ed%2Ftacos-de-cortadillo-receta.jpg", "ingredientes": ["maíz", "carne de cerdo", "chile rojo", "otros ingredientes..."],
        "preparacion": "Descripción de cómo preparar el pozole rojo tradicional."},

    {"id": 5, "item": "Tlacoyos de frijol", "imagen": "https://editorialtelevisa.brightspotcdn.com/dims4/default/e5743d1/2147483647/strip/true/crop/560x560+220+0/resize/1000x1000!/format/webp/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2020%2F08%2Ftlacoyos-de-frijol.jpg", "ingredientes": ["maíz", "carne de cerdo", "chile rojo", "otros ingredientes..."],
        "preparacion": "Descripción de cómo preparar el pozole rojo tradicional."},

        {"id": 6, "item": "Tlacoyos de frijol", "imagen": "https://editorialtelevisa.brightspotcdn.com/dims4/default/e5743d1/2147483647/strip/true/crop/560x560+220+0/resize/1000x1000!/format/webp/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2020%2F08%2Ftlacoyos-de-frijol.jpg", "ingredientes": ["maíz", "carne de cerdo", "chile rojo", "otros ingredientes..."],
        "preparacion": "Descripción de cómo preparar el pozole rojo tradicional."},

    {"id": 7, "item": "Pambazo de papa con chorizo", "imagen": "https://editorialtelevisa.brightspotcdn.com/dims4/default/870cc1b/2147483647/strip/true/crop/600x338+0+31/resize/1000x563!/format/webp/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2021%2F07%2Fpambazo-rojo.jpg", "ingredientes": ["maíz", "carne de cerdo", "chile rojo", "otros ingredientes..."],
        "preparacion": "Descripción de cómo preparar el pozole rojo tradicional."}
]

@app.get("/todo", tags=["todos"])
async def get_todos() -> dict:
    return { "data": todos }

# POST ROUTE
@app.post("/todo", tags=["todos"])
async def add_todo(todo: Todo) -> dict:
    todos.append(todo.dict())
    return {"data": "Todo added."}


# PUT ROUTE
@app.put("/todo/{id}", tags=["todos"])
async def update_todo(id: int, body: Todo) -> dict:
    for todo in todos:
        if todo["id"] == id:
            todo.update(body.dict())
            return {"data": f"Todo with id {id} has been updated."}

    return {"data": f"Todo with id {id} not found."}
    
    
# DELETE ROUTE
@app.delete("/todo/{id}", tags=["todos"])
async def delete_todo(id: int) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todos.remove(todo)
            return {
                "data": f"Todo with id {id} has been removed."
            }

    return {
        "data": f"Todo with id {id} not found."
    }