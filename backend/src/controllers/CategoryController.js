const categoryRepository = require("../repository/CategoryRepository");

class CategoryController {
    // [CREATE] POST /categories
    async create(req, res) {
        try {
            const newCategory = await categoryRepository.create(req.body);
            return res.status(201).json(newCategory);
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            return res.status(500).json({ error: "Falha interna ao criar categoria." });
        }
    }

    // [READ ALL] GET /categories
    async findAll(req, res) {
        try {
            const categories = await categoryRepository.findAll();
            return res.status(200).json(categories);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            return res.status(500).json({ error: "Falha interna ao buscar categorias." });
        }
    }

    // [READ ONE] GET /categories/:id
    async findById(req, res) {
        const { id } = req.params;
        try {
            const category = await categoryRepository.findById(id);
            if (!category) {
                return res.status(404).json({ error: "Categoria não encontrada." });
            }
            return res.status(200).json(category);
        } catch (error) {
            console.error("Erro ao buscar categoria:", error);
            return res.status(500).json({ error: "Falha interna ao buscar categoria." });
        }
    }

    // [UPDATE] PUT /categories/:id
    async update(req, res) {
        const { id } = req.params;
        try {
            const updatedCategory = await categoryRepository.update(id, req.body);
            return res.status(200).json(updatedCategory);
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            return res.status(500).json({ error: "Falha interna ao atualizar categoria. O ID existe?" });
        }
    }

    // [DELETE] DELETE /categories/:id
    async delete(req, res) {
        const { id } = req.params;
        try {
            const deletedCategory = await categoryRepository.delete(id);
            return res.status(200).json(deletedCategory);
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
            return res.status(500).json({ error: "Falha interna ao deletar categoria. O ID existe?" });
        }
    }
}

module.exports = new CategoryController();