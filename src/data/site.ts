// Non-collection site data: bio, trajectory, contacts. Shared by Hero,
// ExperienceList, AuthorSignature, SiteHeader and SiteFooter so this data
// isn't duplicated between `/` and `/sobre/` (REQ-6.6).
//
// github/linkedin/email below use the prototype's own stand-in values —
// pending real handles per SPEC.md §10.1, not yet confirmed by the user.

export const person = {
  name: "Bruno Vieira",
  role: "Senior Solutions Architect",
  company: "MongoDB",
  city: "São Paulo, Brasil",
  email: "bruno.silvavieira@gmail.com",
  github: "https://github.com/brvieira",
  githubHandle: "github.com/brvieira",
  linkedin: "https://linkedin.com/in/brunovrosa",
};

export const hero = {
  badge: "Senior Solutions Architect · MongoDB",
  title: "Arquiteturas de dados que saem\ndo slide e rodam em produção.",
  leadParagraph:
    "Sou Bruno Vieira. Trabalho ao lado de clientes desenhando soluções sobre MongoDB — modelagem de documentos, busca vetorial, agentes com memória — e transformo cada uma delas em uma demo funcional.",
  supportParagraph:
    "Aqui ficam essas demos, o código por trás delas e artigos curtos explicando os conceitos que mais aparecem nessas conversas.",
};

export interface ExperienceEntry {
  period: string;
  role: string;
  company: string;
  detail: string;
}

export const experience: ExperienceEntry[] = [
  {
    period: "atual",
    role: "Senior Solutions Architect",
    company: "MongoDB",
    detail:
      "Arquitetura de soluções para clientes enterprise: modelagem de documentos, estratégias de busca com Atlas Search e Vector Search, aplicações de IA com agentes e memória. Construo as demos técnicas que provam cada conceito.",
  },
  {
    period: "PLACEHOLDER",
    role: "Cargo anterior",
    company: "Empresa",
    detail:
      "PLACEHOLDER — troque por um cargo real. Uma ou duas frases sobre o escopo e o resultado, no mesmo tom da entrada acima.",
  },
  {
    period: "PLACEHOLDER",
    role: "Cargo anterior",
    company: "Empresa",
    detail:
      "PLACEHOLDER — terceira posição da trajetória. Remova a linha se preferir mostrar apenas as duas mais recentes.",
  },
];

// Home shows at most 3 positions; /sobre/ shows all (REQ-6.6).
export const homeExperience = experience.slice(0, 3);

export const focusAreas = [
  "Modelagem de documentos",
  "Atlas Vector Search",
  "Atlas Search",
  "AI agents & RAG",
  "MCP",
  "Migração de relacional",
  "Performance & índices",
];

export const snippet = {
  filename: "vector_search.py",
  label: "Busca vetorial com filtro em uma única pipeline",
  code: `pipeline = [
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
    print(doc["nome"], round(doc["score"], 3))`,
};

export const blogCategories = [
  { slug: "conceitos", label: "Conceitos" },
  { slug: "features", label: "Features" },
  { slug: "tutoriais", label: "Tutoriais" },
  { slug: "novidades", label: "Novidades" },
];
