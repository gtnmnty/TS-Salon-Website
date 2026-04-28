#include <stdio.h>
#include <string.h>
#include <ctype.h>

#define MAX 100;

int choice;

void displayMenu();
void chooseOption();
void listVacancies();

typedef struct {
    int roomNum;
    char category[30];
    int bedrooms;
    float price;
    int isAvailable;

    char guestName[50];
    char guestID[20];
    char guestPhone[15];
} Room;


int main() {
    while (1) {
        displayMenu();
        chooseOption();
    }

    return 0;
}

void displayMenu() {
    printf("\n--- GILDED LUXURY ---\n");
    printf("1. Vacancies\n");
    printf("2. Reserve\n");
    printf("3. Details\n");
    printf("4. Registry\n");
    printf("5. Checkout\n");
    printf("6. Inquiry\n");
    printf("0. Exit\n");
    printf("Selection: ");
}

void chooseOption() {
    int choice;
    scanf("%d", &choice);

    switch (choice) {
        case 1: listVacancies(); break;
        case 2: reserveRoom(); break;
        case 3: roomInfo(); break;
        case 4: findGuest(); break;
        case 5: paymentProcess(); break;
        case 6: Inquiry(); break;
        case 7: 
            printf("Thank you for visiting us! :>\n");
            exit(0); 
        default: 
            printf("Invalid choice. Try again.\n");
    }
}