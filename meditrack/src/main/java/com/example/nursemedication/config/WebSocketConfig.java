package com.example.nursemedication.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the endpoint your client connects to
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // allow all origins (dev)
                .withSockJS(); // fallback if browser doesn't support WebSocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); // messages sent to /topic will be broadcasted
        registry.setApplicationDestinationPrefixes("/app"); // messages sent to /app go to controller
    }
}
