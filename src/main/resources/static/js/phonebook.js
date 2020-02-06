function Contact(firstName, lastName, phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.checked = false;
    this.shown = true;
}

function IDsToDelete(iDs) {
    this.iDs = iDs;
}

new Vue({
    el: "#app",
    data: {
        validation: false,
        serverValidation: false,
        firstName: "",
        lastName: "",
        phone: "",
        rows: [],
        serverError: "",
        checkAll: false
    },
    methods: {
        contactToString: function (contact) {
            var note = "(";
            note += contact.firstName + ", ";
            note += contact.lastName + ", ";
            note += contact.phone;
            note += ")";
            return note;
        },
        convertContactList: function (contactListFromServer) {
            return contactListFromServer.map(function (contact, i) {
                return {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phone: contact.phone,
                    checked: false,
                    shown: true,
                    number: i + 1
                };
            });
        },
        addContact: function () {
            if (this.hasError) {
                this.validation = true;
                this.serverValidation = false;
                return;
            }

            var self = this;

            var contact = new Contact(this.firstName, this.lastName, this.phone);
            $.ajax({
                type: "POST",
                url: "/phoneBook/rpc/api/v1/addContact",
                contentType: "application/json",
                data: JSON.stringify(contact)
            }).done(function () {
                self.serverValidation = false;
            }).fail(function (ajaxRequest) {
                self.serverError = "Ошибка Удаления на сервере.";
                self.serverValidation = true;
            }).always(function () {
                self.loadData();
            });

            self.firstName = "";
            self.lastName = "";
            self.phone = "";
            self.validation = false;
        },
        deleteContact: function (contact) {
            var self = this;
            var iDToDelete = new IDsToDelete([contact.id]);

            $.ajax({
                type: "POST",
                url: "/phoneBook/rpc/api/v1/delContact",
                contentType: "application/json",
                data: JSON.stringify(iDToDelete)
            }).done(function () {
                self.serverValidation = true;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = false;
            }).always(function () {
                self.loadData();
            });
        },
        loadData: function () {
            var self = this;

            $.get("/phoneBook/rpc/api/v1/getAllContacts").done(function (contactListFormServer) {
                self.rows = self.convertContactList(contactListFormServer);
            });
        },
        checkedAllContacts: function () {
            var self = this;
            this.rows.forEach(function (contact) {
                contact.checked = self.checkAll;
            });
        },
        deleteCheckedContacts: function () {
            this.checkAll = false;

            var iDs = this.rows.filter(function (contact) {
                return contact.checked;
            }).map(function (contact) {
                return contact.id;
            });
            var iDsToDelete = new IDsToDelete(iDs);

            var self = this;
            $.ajax({
                type: "POST",
                url: "/phoneBook/rpc/api/v1/delContact",
                contentType: "application/json",
                data: JSON.stringify(iDsToDelete)
            }).done(function () {
                self.serverValidation = true;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = false;
            }).always(function () {
                self.loadData();
            });
        },
        isAllChecked: function () {
            if (this.rows.length === 0) {
                this.checkAll = false;
            } else {
                this.checkAll = this.rows.every(function (contact) {
                    return contact.checked === true;
                });
            }
        },
        sendDeleteRequest: function (iDsArray) {
            var iDsToDelete = new IDsToDelete(iDsArray);

            var self = this;
            $.ajax({
                type: "POST",
                url: "/phoneBook/rpc/api/v1/delContact",
                contentType: "application/json",
                data: JSON.stringify(iDsToDelete)
            }).done(function () {
                self.serverValidation = true;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = false;
            }).always(function () {
                self.loadData();
            });
        }
    },
    computed: {
        firstNameError: function () {
            if (this.firstName) {
                return {
                    message: "",
                    error: false
                };
            }

            return {
                message: "Поле Имя должно быть заполнено.",
                error: true
            };
        },
        lastNameError: function () {
            if (!this.lastName) {
                return {
                    message: "Поле Фамилия должно быть заполнено.",
                    error: true
                };
            }

            return {
                message: "",
                error: false
            };
        },
        phoneError: function () {
            if (!this.phone) {
                return {
                    message: "Поле Телефон должно быть заполнено.",
                    error: true
                };
            }

            var self = this;

            var sameContact = this.rows.some(function (c) {
                return c.phone === self.phone;
            });

            if (sameContact) {
                return {
                    message: "Номер телефона не должен дублировать другие номера в телефонной книге.",
                    error: true
                };
            }

            return {
                message: "",
                error: false
            };
        },
        hasError: function () {
            return this.lastNameError.error || this.firstNameError.error || this.phoneError.error;
        }
    },
    created: function () {
        this.loadData();
    }
});

