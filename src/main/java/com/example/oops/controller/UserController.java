package com.example.oops.controller;

import com.example.oops.model.User;
import com.example.oops.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        boolean success = userService.login(user.getUsername(), user.getPassword());
        return success ? "Login Successful ✅" : "Invalid Credentials ❌";
    }
}
