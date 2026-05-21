const productNameImageMap = {
    'Fonte 500W': '/products/fonte-500w.svg',
    'Bateria 12V': '/products/bateria-12v.svg',
    'Memória RAM 8GB': '/products/memoria-ram-8gb.svg',
    'HD SSD 256GB': '/products/hd-ssd-256gb.svg'
}

export function getProductImageUrl(product) {
    if (product?.image_url) {
        return product.image_url
    }

    const name = (product?.name || '').trim()
    if (productNameImageMap[name]) {
        return productNameImageMap[name]
    }

    return '/products/sem-imagem.svg'
}
