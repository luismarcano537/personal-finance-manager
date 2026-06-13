using System.Net;
using PersonalFinance.Api.Responses;

namespace PersonalFinance.Api.Middlewares;

public class ExceptionHandlingMiddleware
{
    private const string UnexpectedErrorMessage = "An unexpected error occurred.";

    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        var (statusCode, error, message) = exception switch
        {
            ArgumentException => (
                HttpStatusCode.BadRequest,
                "Bad Request",
                exception.Message),
            KeyNotFoundException => (
                HttpStatusCode.NotFound,
                "Not Found",
                exception.Message),
            InvalidOperationException => (
                HttpStatusCode.Conflict,
                "Conflict",
                exception.Message),
            UnauthorizedAccessException => (
                HttpStatusCode.Unauthorized,
                "Unauthorized",
                exception.Message),
            _ => (
                HttpStatusCode.InternalServerError,
                "Internal Server Error",
                UnexpectedErrorMessage)
        };

        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(
                exception,
                "An unexpected exception occurred while processing {Method} {Path}.",
                context.Request.Method,
                context.Request.Path);
        }

        var response = new ApiErrorResponse
        {
            StatusCode = (int)statusCode,
            Error = error,
            Message = message,
            TraceId = context.TraceIdentifier
        };

        context.Response.StatusCode = response.StatusCode;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(response);
    }
}
