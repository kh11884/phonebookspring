package ru.academits.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ru.academits.model.IDsToDelete;
import ru.academits.phonebook.PhoneBookController;

@Component
public class DeleteRandomContact {
    private final  PhoneBookController phoneBookController;
    private static final Logger logger = LoggerFactory.getLogger(DeleteRandomContact.class);

    public DeleteRandomContact(PhoneBookController phoneBookController) {
        this.phoneBookController = phoneBookController;
    }

//    @Scheduled(fixedRate = 10000)
//    public void deleteRandomContact(){
//        int[] contactsIDs = phoneBookController.getContactsIDs();
//
//        if(contactsIDs.length > 0) {
//            int randomIndex = (int) Math.floor(Math.random() * contactsIDs.length);
//            IDsToDelete iDsToDelete = new IDsToDelete();
//            iDsToDelete.setiDs(new int[]{contactsIDs[randomIndex]});
//
//            phoneBookController.delContact(iDsToDelete);
//            logger.info("called SchedulerMethod deleteRandomContact with parameters: " + iDsToDelete);
//        }
//    }
}
