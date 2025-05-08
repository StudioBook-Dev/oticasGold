function editarCupom(id) {
    getCupons()
        .then(cupons => {
            cupons.forEach(cupom => {
                if (String(cupom.id) === String(id)) {
                    abrirModalSecundarioCupons(cupom);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar cupons:', error);
        });
} 