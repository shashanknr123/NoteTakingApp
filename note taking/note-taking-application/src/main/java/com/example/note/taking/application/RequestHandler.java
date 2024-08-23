package com.example.note.taking.application;

import org.springframework.integration.annotation.*;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

@Component
public class RequestHandler {

    @ServiceActivator(inputChannel = "requestChannel")
    public void handleRequest(Message<String> message) {
        String request = message.getPayload();
        saveRequestToFile(request);
    }

    private void saveRequestToFile(String request) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("requests.log", true))) {
            writer.write(request);
            writer.newLine();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}