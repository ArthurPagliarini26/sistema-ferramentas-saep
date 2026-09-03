const express = require('express');
const cors = require('cors');
const connection = require('./db');

const server = express();

server.use(cors());
server.use(express.json());

// GET - Listar produtos
server.get('/produtos', (req, res) => {

    const sql = 'SELECT * FROM produtos';

    connection.query(sql, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }

        res.json(resultados);
    });
});


// GET - Buscar produto por ID
server.get('/produtos/:id', (req, res) => {

    const id = req.params.id;

    const sql = 'SELECT * FROM produtos WHERE id_produto = ?';

    connection.query(sql, [id], (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }

        res.json(resultados[0]);
    });
});


// POST - Cadastrar produto
server.post('/produtos', (req, res) => {

    const {
        nome,
        cor,
        textura,
        unidade_de_medida,
        aplicacao,
        data_validacao,
        estoque_minimo,
        id_categoria
    } = req.body;

    const sql = `
        INSERT INTO produtos
        (
            nome,
            cor,
            textura,
            unidade_de_medida,
            aplicacao,
            data_validacao,
            estoque_minimo,
            id_categoria
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nome,
        cor,
        textura,
        unidade_de_medida,
        aplicacao,
        data_validacao,
        estoque_minimo,
        id_categoria
    ];

    connection.query(sql, valores, (erro, resultado) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }
        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso',
            id_produto: resultado.insertId
        });
    });
});


// PUT - Atualizar produto
server.put('/produtos/:id', (req, res) => {

    const id = req.params.id;

    const {
        nome,
        cor,
        textura,
        unidade_de_medida,
        aplicacao,
        data_validacao,
        estoque_minimo,
        id_categoria
    } = req.body;

    const sql = `
        UPDATE produtos
        SET
            nome = ?,
            cor = ?,
            textura = ?,
            unidade_de_medida = ?,
            aplicacao = ?,
            data_validacao = ?,
            estoque_minimo = ?,
            id_categoria = ?
        WHERE id_produto = ?
    `;

    const valores = [
        nome,
        cor,
        textura,
        unidade_de_medida,
        aplicacao,
        data_validacao,
        estoque_minimo,
        id_categoria,
        id
    ];

    connection.query(sql, valores, (erro, resultado) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }

        res.json({
            mensagem: 'Produto atualizado com sucesso'
        });
    });
});


// DELETE - Excluir produto
server.delete('/produtos/:id', (req, res) => {

    const id = req.params.id;
    const sql = 'DELETE FROM produtos WHERE id_produto = ?';

    connection.query(sql, [id], (erro, resultado) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }
        res.json({
            mensagem: 'Produto excluído com sucesso'
        });
    });
});

const PORT = 8082;

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});