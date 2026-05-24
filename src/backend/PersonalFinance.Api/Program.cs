using PersonalFinance.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new
    {
        status = "Healthy",
        application = "PersonalFinance.Api",
        timestamp = DateTime.UtcNow
    }))
    .WithName("HealthCheck")
    .WithTags("Health");

app.MapGet("/health/database", async (PersonalFinance.Infrastructure.Persistence.AppDbContext dbContext) =>
    {
        var canConnect = await dbContext.Database.CanConnectAsync();

        return canConnect
            ? Results.Ok(new
            {
                status = "Healthy",
                database = "PostgreSQL",
                canConnect = true,
                timestamp = DateTime.UtcNow
            })
            : Results.Problem("Database connection failed");
    })
    .WithName("DatabaseHealthCheck")
    .WithTags("Health");


app.Run();