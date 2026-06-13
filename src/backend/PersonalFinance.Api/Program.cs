using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PersonalFinance.Api.Middlewares;
using PersonalFinance.Infrastructure;
using PersonalFinance.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT key is not configured.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("JWT issuer is not configured.");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("JWT audience is not configured.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,

            ValidateAudience = true,
            ValidAudience = jwtAudience,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)),

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
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

app.MapGet("/health/database", async (AppDbContext dbContext) =>
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
