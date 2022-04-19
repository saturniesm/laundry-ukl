const express = require("express");
const app = express();
const models = require("../models/index");
const transaksi = models.transaksi;
const detail_transaksi = models.detail_transaksi;

const { auth } = require("./auth/auth");

app.use(auth);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async(req, res) => {
    transaksi
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
    transaksi
        .findOne({ where: { id: req.params.id } })
        .then((transaksi) => {
            res.json(transaksi);
        })
        .catch((error) => {
            res.json({ message: error.message });
        });
});

app.post("/", async(req, res) => {
    let tanggal = new Date();
    let tgl = Date.now();
    let batas = new Date().setDate(new Date().getDate() + 7);
    let newTransaksi = {
        id_outlet: req.body.id_outlet,
        kode_invoice: req.body.kode_invoice,
        id_member: req.body.id_member,
        tgl: tgl,
        batas_waktu: batas,
        tgl_bayar: tanggal,
        biaya_tambahan: req.body.biaya_tambahan,
        status: req.body.status,
        dibayar: req.body.dibayar,
        id_user: req.body.id_user,
    };

    transaksi
        .create(newTransaksi)
        .then((result) => {
            let data_detail = req.body.detail_transaksi;
            let IDTransaksi = result.id;

            for (let i = 0; i < data_detail.length; i++) {
                data_detail[i].id = IDTransaksi;
                // TODO variabel untuk ngimpan total, dan bahkan di tambahkan terus smaa total transaksi
            }
            // TODO ngambil data dari total terus nanti diambil ke sini :D dan baru apply pajak s
            detail_transaksi
                .bulkCreate(data_detail)
                .then((result) => {
                    return response.json({
                        message: `Data transaksi berhasil ditambahkan`,
                    });
                })
                .catch((error) => {
                    return response.json({
                        message: error.message,
                    });
                });

            res.json({
                message: "Transaksi berhasil ditambahkan",
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
        id_outlet: req.body.id_outlet,
        kode_invoice: req.body.kode_invoice,
        id_member: req.body.id_member,
        tgl: tgl,
        batas_waktu: batas,
        tgl_bayar: tanggal,
        biaya_tambahan: req.body.biaya_tambahan,
        status: req.body.status,
        dibayar: req.body.dibayar,
        id_user: req.body.id_user,
    };

    transaksi
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

    transaksi
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