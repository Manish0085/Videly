package com.manish.videostreaming.exception;

import lombok.Data;
import java.util.List;

@Data
public class ApiError {
    private int statusCode;
    private String message;
    private boolean success;
    private List<String> errors;

    public ApiError(int statusCode, String message, List<String> errors) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;
    }
    
    public ApiError(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = null;
    }
}
