using System.Linq;
using LeadApi.Dtos;
using LeadApi.Models;

namespace LeadApi.Extensions;

public static class LeadMappingExtensions
{
    public static LeadSummaryDto ToSummaryDto(this Lead lead) => new(
        lead.Id.ToString(),
        lead.Nome,
        lead.Empresa,
        lead.Email,
        lead.Telefone,
        lead.Status,
        lead.Origem,
        lead.CriadoEm.ToString("O")
    );

    public static LeadDetailDto ToDetailDto(this Lead lead)
    {
        var comentarios = lead.Comentarios
            .OrderByDescending(c => c.CriadoEm)
            .Select(c => new LeadCommentDto(
                c.Id.ToString(),
                c.Autor,
                c.Conteudo,
                c.CriadoEm.ToString("O")
            ))
            .ToList();

        var historico = lead.Historico
            .OrderByDescending(h => h.CriadoEm)
            .Select(h => new LeadTimelineEntryDto(
                h.Id.ToString(),
                h.Descricao,
                h.CriadoEm.ToString("O"),
                h.CriadoPor
            ))
            .ToList();

        return new LeadDetailDto(
            lead.Id.ToString(),
            lead.Nome,
            lead.Empresa,
            lead.Email,
            lead.Telefone,
            lead.Status,
            lead.Origem,
            lead.CriadoEm.ToString("O"),
            lead.Campanha,
            lead.ProdutoInteresse,
            lead.ValorEstimado,
            lead.ObservacoesInternas,
            comentarios,
            historico
        );
    }
}
