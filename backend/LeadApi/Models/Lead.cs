namespace LeadApi.Models;

public class Lead
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Empresa { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Status { get; set; } = "novo";
    public string Origem { get; set; } = string.Empty;
    public DateTimeOffset CriadoEm { get; set; }
    public string Campanha { get; set; } = string.Empty;
    public string ProdutoInteresse { get; set; } = string.Empty;
    public decimal ValorEstimado { get; set; }
    public string? ObservacoesInternas { get; set; }

    public ICollection<LeadComment> Comentarios { get; set; } = new List<LeadComment>();
    public ICollection<LeadTimelineEntry> Historico { get; set; } = new List<LeadTimelineEntry>();
}
