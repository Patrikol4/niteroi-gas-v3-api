export interface Endereco {
    id: string,
    rua: string, 
    numero: string,
    complemento: string,
    cep: string, // ou int

    userId: string,
    bairroId: string,
    agendamentos: Array<String>, // será que vai ter esse "agendamentos" nesta nova versão ?
    // tendo em vista que a versão no app anterior foi um fiasco total...
    pedido: string,
}

export interface EnderecoCreate {
    id: string,
    rua: string,
    numero: string,
    complemento: string,
    cep: string,

    userId: string,
    // caso necessitar mais objetos para criação
    // ...favor informar aqui!
}

export interface EnderecoRepo {
    create(data: EnderecoCreate ): Promise<Endereco>
    // um delete talvez ficaria bom ?
    // sei que um update é realmente necessário para todos os casos....
    // mas depois defino isso no escopo.
    // findById???
}