---
titulo: "O que é Vector Search e como utilizar em seus projetos"
categoria: "conceitos"
data: 2026-08-12
resumo: "Busca por significado, não por palavra-chave. Neste artigo: como os embeddings representam texto, como o índice vetorial do Atlas funciona e uma pipeline pronta para copiar."
tempoLeitura: 7
rascunho: false
---

Uma busca tradicional compara termos. Se o usuário digita "sapato para corrida" e o produto está cadastrado como "tênis de running", o match não acontece. A busca vetorial resolve isso comparando representações numéricas do significado do texto, em vez dos caracteres.

## Embeddings em uma frase

Um modelo de embedding transforma um texto em um vetor de centenas ou milhares de dimensões. Textos com sentido próximo ficam próximos nesse espaço, e a distância entre eles passa a ser algo que o banco consegue ordenar.

> No MongoDB Atlas os vetores ficam no mesmo documento que o resto dos dados. Isso elimina o banco vetorial separado e o trabalho de sincronizar duas fontes de verdade.

## A pipeline

O estágio `$vectorSearch` aceita filtros pré-consulta, o que permite restringir por categoria ou estoque antes da busca semântica:

```python vector_search.py
pipeline = [
    {
        "$vectorSearch": {
            "index": "produtos_vector_index",
            "path": "descricao_embedding",
            "queryVector": embed("sapato leve para corrida"),
            "numCandidates": 150,
            "limit": 10,
            "filter": {"em_estoque": True}
        }
    },
    {
        "$project": {
            "nome": 1,
            "preco": 1,
            "score": {"$meta": "vectorSearchScore"}
        }
    }
]

for doc in db.produtos.aggregate(pipeline):
    print(doc["nome"], round(doc["score"], 3))
```

O campo `numCandidates` controla quantos vizinhos o índice examina antes de devolver os `limit` melhores. Valores mais altos aumentam a precisão e o custo da consulta — comece em dez vezes o limite e ajuste medindo.
