namespace LeadApi.Models;

public class LeadTimelineEntry
{
    public Guid Id { get; set; }
    public Guid LeadId { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public DateTimeOffset CriadoEm { get; set; }
    public string CriadoPor { get; set; } = string.Empty;
}
