using LeadApi.Models;
namespace LeadApi.Data;

public static class SeedData
{
    public static void Initialize(LeadContext context)
    {
        if (context.Leads.Any())
        {
            return;
        }

        var agora = DateTimeOffset.UtcNow;

        var leads = new List<Lead>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Nome = "Mariana Silva",
                Empresa = "InovaTech",
                Email = "mariana.silva@inovatech.com",
                Telefone = "+55 11 91234-5678",
                Status = "novo",
                Origem = "Landing Page",
                CriadoEm = agora.AddDays(-2),
                Campanha = "Campanha Abril",
                ProdutoInteresse = "Plataforma CRM",
                ValorEstimado = 12000m,
                ObservacoesInternas = "Interessada em apresentação completa.",
                Comentarios =
                {
                    new LeadComment
                    {
                        Id = Guid.NewGuid(),
                        Autor = "Ana Paula",
                        Conteudo = "Entrar em contato ainda esta semana.",
                        CriadoEm = agora.AddDays(-1),
                    }
                },
                Historico =
                {
                    new LeadTimelineEntry
                    {
                        Id = Guid.NewGuid(),
                        Descricao = "Lead criado a partir da landing page.",
                        CriadoEm = agora.AddDays(-2),
                        CriadoPor = "Sistema"
                    }
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                Nome = "Carlos Oliveira",
                Empresa = "AgroMais",
                Email = "carlos.oliveira@agromais.com",
                Telefone = "+55 62 99876-5432",
                Status = "em_andamento",
                Origem = "Indicação",
                CriadoEm = agora.AddDays(-10),
                Campanha = "Campanha Parcerias",
                ProdutoInteresse = "Consultoria de Marketing",
                ValorEstimado = 8500m,
                ObservacoesInternas = "Negociação avançada.",
                Comentarios =
                {
                    new LeadComment
                    {
                        Id = Guid.NewGuid(),
                        Autor = "Bruno Lima",
                        Conteudo = "Aguardando proposta revisada.",
                        CriadoEm = agora.AddDays(-3)
                    }
                },
                Historico =
                {
                    new LeadTimelineEntry
                    {
                        Id = Guid.NewGuid(),
                        Descricao = "Contato inicial realizado por telefone.",
                        CriadoEm = agora.AddDays(-9),
                        CriadoPor = "Bruno Lima"
                    },
                    new LeadTimelineEntry
                    {
                        Id = Guid.NewGuid(),
                        Descricao = "Enviado material de apoio.",
                        CriadoEm = agora.AddDays(-5),
                        CriadoPor = "Bruno Lima"
                    }
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                Nome = "Juliana Costa",
                Empresa = "EducaPlus",
                Email = "juliana.costa@educaplus.com",
                Telefone = "+55 21 93456-7890",
                Status = "convertido",
                Origem = "Evento",
                CriadoEm = agora.AddDays(-30),
                Campanha = "Feira de Educação",
                ProdutoInteresse = "Treinamento corporativo",
                ValorEstimado = 15000m,
                ObservacoesInternas = "Contrato fechado na última semana.",
                Comentarios =
                {
                    new LeadComment
                    {
                        Id = Guid.NewGuid(),
                        Autor = "Patrícia Gomes",
                        Conteudo = "Solicitou cronograma de implementação.",
                        CriadoEm = agora.AddDays(-8)
                    }
                },
                Historico =
                {
                    new LeadTimelineEntry
                    {
                        Id = Guid.NewGuid(),
                        Descricao = "Lead originado durante apresentação no evento.",
                        CriadoEm = agora.AddDays(-28),
                        CriadoPor = "Patrícia Gomes"
                    },
                    new LeadTimelineEntry
                    {
                        Id = Guid.NewGuid(),
                        Descricao = "Proposta comercial aprovada.",
                        CriadoEm = agora.AddDays(-9),
                        CriadoPor = "Patrícia Gomes"
                    },
                    new LeadTimelineEntry
                    {
                        Id = Guid.NewGuid(),
                        Descricao = "Contrato assinado.",
                        CriadoEm = agora.AddDays(-7),
                        CriadoPor = "Juliana Costa"
                    }
                }
            }
        };

        foreach (var lead in leads)
        {
            foreach (var comentario in lead.Comentarios)
            {
                comentario.LeadId = lead.Id;
            }

            foreach (var historico in lead.Historico)
            {
                historico.LeadId = lead.Id;
            }
        }

        context.Leads.AddRange(leads);
        context.SaveChanges();
    }
}
