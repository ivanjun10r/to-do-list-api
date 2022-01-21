const restify = require('restify');

class Item {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

var items = new Map();

function listItems (req, res, next) {
    console.log("listItems function was called.");
    if (items.size === 0) res.send({message: "Empty list of items."});
    else res.send({"items": [...items.values()]});
    next();
};

function createItem (req, res, next) {
    console.log("createItem function was called.");
    if (!req.body.id) res.send({message: "Error: You should fill the identifier (id field)."});
    else if  (!req.body.name) res.send({message: "Error: You should fill the name (name field)."});
    else if (req.body.id && items.get(req.body.id)) res.send({message: `Error: You can't create an item with id ${req.body.id}`});
    else {
        items.set(req.body.id, new Item(req.body.id, req.body.name));
        res.send({message: `The item ${req.body.id} was successfully added.`});
    };
    next();
};

function getItem (req, res, next) {
    let item = items.get(req.params.idItem);
    if (!item) res.send({message: "Error: Item doesn't exist."});
    else {
        res.send({"item": item});
    };
    console.log(`getItem function was called with idItem ${req.params.idItem}.`);
    next();
};

function updateItem (req, res, next) {
    let item = items.get(req.params.idItem);
    if (!item) res.send({message: "Error: Item doesn't exist."});
    else if (!req.body.name) res.send({message: "Error: You should fill the name (name field)."});
    else {
        item.name = req.body.name;
        res.send({message: `The item ${req.params.idItem} was successfully updated.`});
    };
    console.log(`deleteItem function was called with idItem ${req.params.idItem}.`);
    next();
};

function deleteItem (req, res, next) {
    if (!items.get(req.params.idItem)) res.send({message: "Error: Item doesn't exist."});
    else {
        items.delete(req.params.idItem);
        res.send({message: `The item ${req.params.idItem} was successfully removed.`});
    };
    console.log(`deleteItem function was called with idItem ${req.params.idItem}.`);
    next();
};

const server = restify.createServer();

server.listen(8080, () => {
    console.log("Server running in port 8080...");
});

server.use(restify.plugins.bodyParser())

server.get('/', listItems);
server.post('/add/', createItem);
server.get('/:idItem/', getItem);
server.put('/:idItem/update/', updateItem);
server.del('/:idItem/delete/', deleteItem);