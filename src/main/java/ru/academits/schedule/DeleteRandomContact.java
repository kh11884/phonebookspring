package ru.academits.schedule;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DeleteRandomContact {
    @Scheduled(fixedRate = 10000)
    public void deleteRandomContact(){


        System.out.println("Scheduler!");
    }
}
