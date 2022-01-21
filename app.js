/**
 * Método para simplificar o modelo de resposta
 * status  {Integer}            Códido de status da resposta
 * message {String, Array}      Mensagem da resposta
 * content {Array, Object}      Conteúdo da resposta
 */

export default (req, res, next) => {

    /**
     * Método de de resposta padrão para Exact Code
     * @param {Integer}         status        Códido de status da resposta
     * @param {String, Array}   message       Mensagem da resposta
     * @param {Array, Object}   content       Conteúdo da resposta
     * @returns 
     */
    res.send = (status, message, content, version = true, endpoint = true) => {

        let result = {};

        result.status = status;
        result.message = message;

        if (status === 500) {
            console.log(content)
        } else if (!!content) {
            result.content = content;
        }

        if (!!version) {
            result.version = process.env.npm_package_version
        }

        if (!!endpoint) {
            result.endpoint = req.originalUrl || req.baseUrl || req.url
        }

        return res.status(status).json(result);
    }

    res.success = function (message = 'Sucesso!', content) {
        return this.send(200, message, content)
    }

    res.created = function (message = 'Algo foi criado com sucesso!', content) {
        return this.send(201, message, content)
    }

    res.accepted = function (message = 'Requisição aceita!', content) {
        return this.send(201, message, content)
    }

    res.noContent = function (message = 'Sem conteúdo!', content) {
        return this.send(201, message, content)
    }

    res.badRequest = function (message = 'Requisição inválida!', content) {
        return this.send(400, message, content)
    }

    res.unauthorized = function (message = 'Credencias inválidas!', content) {
        return this.send(401, message, content)
    }

    res.forbidden = function (message = 'Sem autorização!', content) {
        return this.send(403, message, content)
    }

    res.notFound = function (message = 'Recurso não encontrado!', content) {
        return this.send(404, message, content)
    }

    res.methodNotAllowed = function (message = 'Métodos não permitido!', content) {
        return this.send(405, message, content)
    }

    res.error = function (message = 'Erro interno!', content) {
        return this.send(500, message, content)
    }

    next()
}