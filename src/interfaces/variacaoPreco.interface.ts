export interface VariacaoPreco {
    id: string,
    bairro: string,
    variacao13: string, // ou int
    variacao45: string, // ou int

    // vai precisar ref. o endereço ???
}

export interface VariacaoPrecoCreate {
    bairro: string,
    variacao13: string | null,
    variacao45: string | null
    // ref endereco ???
}

export interface VariacaoPrecoUpdate {
    // no caso de alterações posteriores de preço
    id: string,
    variacao13: string,
    variacao45: string,
}

export interface VariacaoPrecoRepo {
    create(data: VariacaoPrecoCreate): Promise<VariacaoPreco>
    // criar um update update(data: )
    update(data: VariacaoPrecoUpdate): Promise<VariacaoPreco>
    delete(id: string): Promise<VariacaoPreco>
}