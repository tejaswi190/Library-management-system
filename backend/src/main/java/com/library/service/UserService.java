package com.library.service;

import com.library.dto.UserDto;
import com.library.model.User;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDto> getAllStudents() {
        return userRepository.findByRole(User.Role.STUDENT)
                .stream().map(UserDto::from).collect(Collectors.toList());
    }

    public UserDto getUser(Long id) {
        return userRepository.findById(id)
                .map(UserDto::from)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }
}
