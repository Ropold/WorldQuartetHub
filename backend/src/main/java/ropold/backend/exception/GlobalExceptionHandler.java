package ropold.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CountryNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public CountryError handleCountryNotFoundException(CountryNotFoundException e) {
        log.error("CountryNotFoundException: {}", e.getMessage(), e);
        return new CountryError(e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CountryError handleRuntimeException(RuntimeException e) {
        log.error("Unhandled RuntimeException: {}", e.getMessage(), e);
        return new CountryError(e.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public AccessDeniedError handleAccessDeniedException(AccessDeniedException e) {
        return new AccessDeniedError(e.getMessage());
    }

}
