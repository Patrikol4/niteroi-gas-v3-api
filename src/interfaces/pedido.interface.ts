export interface Pedido {
    id: string,
    pagamentoId: string,
    produtoId: string,
    quantidade: string,
    troco: string,

    userId: string,
    entregadorId?: string | null // pode ser vazio
    enderecoId: string, // nao pode ser vazio
    status: string,
    total: string,

    // datas etc
    createdAt: Date,
    // esse será atualizado na hora automatica ..updateAt:
    tempo: string | null // tempo passado da entrega.

    // na hora de cancelar.. painel
    cancel: string,
    cancelMessage: string,

}   