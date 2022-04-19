const express = require("express");
const app = express();

const detail = require("../models/index").detail_transaksi;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async(req, res) => {
    detail
        .findAll({
            include: [{ all: true, nested: true }],
        })
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
});

app.get("/:id", async(req, res) => {
    detail
        .findOne({ where: { id: req.params.id } })
        .then((detail) => {
            res.json(detail);
        })
        .catch((error) => {
            res.json({ message: error.message });
        });
});

app.post("/", async(req, res) => {
    let newDetail = {
        id_transaksi: req.body.id_transaksi,
        id_paket: req.body.id_paket,
        qty: req.body.qty,
        keterangan: req.body.keterangan,
    };

    detail
        .create(newDetail)
        .then((result) => {
            res.json({
                message: "Data Success",
                data: result,
            });
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
});

app.put("/", async(req, res) => {
    let param = {
        id: req.body.id,
    };

    let data = {
        id_transaksi: req.body.id_transaksi,
        id_paket: req.body.id_paket,
        qty: req.body.qty,
        keterangan: req.body.keterangan,
    };

    detail
        .update(data, { where: param })
        .then((result) => {
            res.json({
                message: "Data Updated",
                data: result,
            });
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
});

app.delete("/:id", async(req, res) => {
    let param = {
        id: req.params.id,
    };

    detail
        .destroy({ where: param })
        .then((result) => {
            res.json({
                message: "Data Deleted",
            });
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
});

module.exports = app;