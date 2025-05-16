


async function getCupons() {
    // console.log("Iniciando carregamento de cupons...");
    
    try {
        // Buscar cupons da API SQLite
        const response = await fetch('/api/cupons');
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar cupons: ${response.status}`);
        }
        
        const cupons = await response.json();
        
        // Converter valor para número, se necessário
        const cuponsProcessados = cupons.map(cupom => {
            if (cupom.valor && typeof cupom.valor === 'string') {
                cupom.valor = parseFloat(cupom.valor) || 0;
            }
            return cupom;
        });
        
        // console.log(`Total de cupons carregados: ${cupons.length}`);
        return cuponsProcessados;
        
    } catch (error) {
        console.error("Erro ao carregar cupons:", error);
        return [];
    }
} 