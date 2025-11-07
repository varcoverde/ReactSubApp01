namespace LeadApi.Dtos;

public record LeadSummaryDto(
    string Id,
    string Nome,
    string Empresa,
    string Email,
    string Telefone,
    string Status,
    string Origem,
    string CriadoEm
);

public record LeadCommentDto(
    string Id,
    string Autor,
    string Conteudo,
    string CriadoEm
);

public record LeadTimelineEntryDto(
    string Id,
    string Descricao,
    string CriadoEm,
    string CriadoPor
);

public record LeadDetailDto(
    string Id,
    string Nome,
    string Empresa,
    string Email,
    string Telefone,
    string Status,
    string Origem,
    string CriadoEm,
    string Campanha,
    string ProdutoInteresse,
    decimal ValorEstimado,
    string? ObservacoesInternas,
    IReadOnlyCollection<LeadCommentDto> Comentarios,
    IReadOnlyCollection<LeadTimelineEntryDto> Historico
);

public class LeadUpdateRequest
{
    public string? Status { get; set; }
    public string? ObservacoesInternas { get; set; }
}

public class CommentRequest
{
    public string Conteudo { get; set; } = string.Empty;
}

public class LeadFilterQuery
{
    public string? Busca { get; set; }
    public string? Status { get; set; }
    public string? Origem { get; set; }
    public string? DataInicial { get; set; }
    public string? DataFinal { get; set; }
}
