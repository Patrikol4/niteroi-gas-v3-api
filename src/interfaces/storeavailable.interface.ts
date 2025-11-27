export interface StoreAvailable {
    id: string,
    isOpen: boolean,
    timestamps: Date,
}

export interface StoreAvailableCreate {
    // essa vai ser criada uma só vez, depois disso não necessitando mais
    isOpen: boolean,
    timestamps: Date,
}

export interface StoreAvailableRepo {
    create(data: StoreAvailableCreate): Promise<StoreAvailable>
    // não vou criar o update pois ele se atualiza automaticamente.. 
    // ou será que necessito ????
}