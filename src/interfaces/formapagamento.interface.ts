export interface FormaPagamento {
    id: string,
    nomeForma: string,
    taxaJuros: string,
}

export interface CriarForma {
    //id: string,
    nomeForma: string,
    taxaJuros: string,
}

export interface FormaPagRepo {
    create(data: CriarForma): Promise<FormaPagamento>
    delete(id: string): Promise<FormaPagamento>
}