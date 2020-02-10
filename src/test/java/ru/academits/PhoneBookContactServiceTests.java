package ru.academits;

import org.junit.*;

import ru.academits.dao.ContactDao;
import ru.academits.model.Contact;
import ru.academits.model.ContactValidation;
import ru.academits.service.ContactService;

import java.util.Arrays;

import static org.junit.Assert.*;

public class PhoneBookContactServiceTests {
    public ContactDao contactDao;
    private ContactService contactService;
    private Contact contact1;
    private Contact contact2;

    @Before
    public void seUp() {
        contactDao = new ContactDao();
        contactService = new ContactService(contactDao);

        contact1 = new Contact();
        contact1.setFirstName("Ivan");
        contact1.setLastName("Ivanov");
        contact1.setPhone("123456");

        contact2 = new Contact();
        contact2.setFirstName("Petr");
        contact2.setLastName("Petrov");
        contact2.setPhone("456789");
    }

    @Test
    public void addContactTest() {
        ContactValidation actual = contactService.addContact(contact1);

        assertTrue(actual.isValid());
        assertNull("Error not Empty " + actual.getError(), actual.getError());
    }

    @Test
    public void addContactEmptyFirstNameTest() {
        contact2.setFirstName("");
        ContactValidation actual = contactService.addContact(contact2);

        assertFalse(actual.isValid());
        String expectedError = "Поле Имя должно быть заполнено.";
        assertEquals(expectedError, actual.getError());
    }

    @Test
    public void addContactEmptyLastNameTest() {
        contact2.setLastName("");
        ContactValidation actual = contactService.addContact(contact2);

        assertFalse(actual.isValid());
        String expectedError = "Поле Фамилия должно быть заполнено.";
        assertEquals(expectedError, actual.getError());
    }

    @Test
    public void addContactSamePhoneNumberTest() {
        contactService.addContact(contact1);
        contact2.setPhone("123456");
        ContactValidation actual = contactService.addContact(contact2);

        assertFalse(actual.isValid());
        String expectedError = "Номер телефона не должен дублировать другие номера в телефонной книге.";
        assertEquals(expectedError, actual.getError());
    }

    @Test
    public void delContactTest() {
        contactService.addContact(contact1);
        int iDToDelete = contact1.getId();
        contactService.delContact(new int[]{iDToDelete});

        assertFalse(contactService.getAllContacts().contains(contact1));
    }

    @Test
    public void getContactsIDsTest() {
        contactService.addContact(contact1);
        contactService.addContact(contact2);
        String actual = Arrays.toString(contactService.getContactsIDs());
        String expected = Arrays.toString(new int[]{1, 2, 3});

        assertEquals(expected, actual);
    }
}
