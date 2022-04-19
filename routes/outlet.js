const express = require("express");
const app = express();

const outlet = require("../models/index").outlet;
const { auth } = require("./Auth/login");

app.use(auth);
const multer = require("multer");

const path = require("path");

const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/outlet");
    },
    filename: (req, file, cb) => {
        cb(null, "image-" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async(req, res) => {
    outlet
        .findAll({ include: ["transaksi"] })
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
});

app.get("/:id_outlet", async(req, res) => {
    outlet
        .findOne({ where: { id_outlet: req.params.id_outlet } })
        .then((outlet) => {
            res.json(outlet);
        })
        .catch((error) => {
            res.json({ message: error.message });
        });
});

app.post("/", upload.single("image"), async(req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file",
        });
    } else {
        let newOutlet = {
            domisili_outlet: req.body.domisili_outlet,
            nama_outlet: req.body.nama_outlet,
            telp: req.body.telp,
            alamat: req.body.alamat,
            image: req.file.filename,
        };

        outlet
            .create(newOutlet)
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
    }
});

app.put("/", upload.single("image"), async(req, res) => {
    let param = {
        id_outlet: req.body.id_outlet,
    };

    let data = {
        domisili_outlet: req.body.domisili_outlet,
        nama_outlet: req.body.nama_outlet,
        telp: req.body.telp,
        alamat: req.body.alamat,
    };

    if (req.file) {
        const row = await outlet.findOne({ where: param });
        let oldFileName = row.image;

        let dir = path.join(__dirname, "../image/outlet", oldFileName);
        fs.unlink(dir, (err) => console.log(err));

        data.image = req.file.filename;
    }

    outlet
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

app.delete("/:id_outlet", async(req, res) => {
    try {
        let param = {
            id_outlet: req.params.id_outlet,
        };

        let result = await outlet.findOne({ where: param });
        let oldFileName = result.image;
        let dir = path.join(__dirname, "../image/outlet", oldFileName);
        fs.unlink(dir, (err) => console.log(err));
        outlet
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
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
});

module.exports = app;