export interface Produto {
    id: string,
    image_produto: string,
    nome_produto: string,
    preco_produto: string, // no schema está Integer


    // pagamento 
    payment_type_id: string,
    // ver se referencia o pedido... ou nao
    // ver se referencia o agendamento, ou não...

}

export interface ProdutoCreate {
    id: string,
    image_produto: string, // ao criar, o usuário obrigatoriamente deverá escolher uma imagem para compôr seu produto, do contrário pode ocorrer uma quebra de lógica bem na parte do mobile 
    preco_produto: string, // obrigatoria, também
    payment_type_id: string, // ao escolher o modo de pagamento no modal do mobile.... 
    

}

export interface ProdutoUpdate {
    // definir no escopo o que pode ser atualizado aqui
    // acredito que só a imagem faz sentido deixar como "atualizável"
    id: string,
    image_produto: string, // atualizar a URL...
    // pois o arquivo de imagem será upado no front end..
}

export interface ProdutoDelete {
    // auto descritiva, puxa o id e deleta. simples
    id: string,
    // ele também pode deletar a imagem ?? seria bom pro sistema isso ? Creio que não...
}

export interface ProdutoRepo {
    create(data: ProdutoCreate): Promise<Produto>
    update(data: ProdutoUpdate): Promise<Produto>
    delete(data: ProdutoDelete): Promise<Produto>
}